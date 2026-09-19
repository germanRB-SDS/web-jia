"""Controlled retrieval cost experiment. No LLM calls, billing, product mutations or corpus upload."""
import argparse,hashlib,json,math,os,platform,shlex,statistics,subprocess,sys,tempfile,time
from pathlib import Path
import tiktoken
KIT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(KIT/'scripts'))
from sds_text import Document,read_file
p=argparse.ArgumentParser();p.add_argument('--corpus',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--repetitions',type=int,default=21);args=p.parse_args()
if args.repetitions<2:raise ValueError('at least two repetitions')
raw=read_file(args.corpus)
if hashlib.sha256(raw).hexdigest()!='e6a8f80772413938f1f9d84cd1fb0047a0350a14b47eabfbb1ea890795a55a66':
 raise ValueError('original dossier hash differs; new selection audit is required')
doc=Document(raw)
# Oracle: owner-dossier published table, manually reviewed against the frozen headers.
RANGES={'AUD-00':(36,56),'AUD-01':(57,79),'MAIL-00':(80,100),'MAIL-01':(101,129),'MAIL-02':(130,160),'MAIL-03':(161,209),'MAIL-04':(210,236),'MAIL-05':(237,271),'MAIL-06':(272,302),'MAIL-07':(303,349),'MAIL-08':(350,410),'GOV-01':(411,447),'GOV-02':(448,473),'PLAN-00':(474,497),'PLAN-01':(498,517),'AUD-02':(518,533),'FICHA-03':(534,555),'FICHA-04':(556,577),'FICHA-05':(578,601),'FICHA-06':(602,615),'FICHA-07':(616,642)}
for code,(start,end) in RANGES.items():
 assert doc.metadata(code)['lines']==[start,end]
 assert doc.body(code).encode()==b''.join(raw.splitlines(keepends=True)[start-1:end])
# Startup invariant set from dossier execution router, plus later explicit Graph/Gmail requirement.
CORE=['AUD-00','AUD-01','MAIL-01','MAIL-06','MAIL-08']
case_specs={'startup':[CORE],'focal_with_requirements':[[*CORE,'MAIL-05']],
 'startup_then_followup':[CORE,[*CORE,'MAIL-05']], 'complete_document':[list(RANGES)]}
temp=Path(tempfile.mkdtemp(prefix='sds-context-benchmark-'))
short=temp/'short.md';short.write_text('# Short control\n\n## [CORE-00] Rule\nPreserve existing files.\n\n## [TASK-10] Task\nRead this short document fully.\n')
fixed_paths=['GOVERNANCE.md','practices/INDEX.md','skills/README.md','adapters/AGENTS.md']
routed=['practices/'+next(p.name for p in (KIT/'practices').glob(n+'-*.md')) for n in ['01','02','03','12','15']]
fixed='\n'.join((KIT/x).read_text() for x in fixed_paths)
routed_text='\n'.join((KIT/x).read_text() for x in routed)
reader_guide=(KIT/'practices/modules/01-selective-text.md').read_text()
encodings={name:tiktoken.get_encoding(name) for name in ['o200k_base','cl100k_base']}
def counts(s):return {name:len(e.encode(s,disallowed_special=())) for name,e in encodings.items()}
# This is an auditable cost formula, not an observed completion/bill. Non-model costs remain unknown.
closure_text='Selection complete; all required source spans were retrieved. No mutation was performed.'
AWK='''BEGIN {n=split(ids,a," ");for(i=1;i<=n;i++) want[a[i]]=1; pre=1}
/^## \\[[A-Z][A-Z0-9-]*\\] / {pre=0;key=$2;gsub(/^\\[|\\]$/,"",key);active=(key in want);if(active)found[key]++}
pre || active {out=out $0 ORS}
END {for(key in want)if(found[key]!=1){print "missing or duplicate" > "/dev/stderr";exit 2};printf "%s",out}'''
rows=[]
for case,groups in [*case_specs.items(),('short_full', [['CORE-00','TASK-10']])]:
 source=short if case=='short_full' else args.corpus
 current=Document(read_file(source));groups=[sorted(set(g),key=lambda c:current.sections[c]['start']) for g in groups]
 for method in ['cat_reuse','native_awk','native_rg_awk_discovery','wrapper','derived_index_cold']:
  commands=[];output_roles=[];expected=[]
  if method=='cat_reuse':
   commands=[['cat',str(source)]];output_roles=['document'];expected=[read_file(source).decode()]
  elif method in ('native_awk','native_rg_awk_discovery','wrapper'):
   if method=='native_rg_awk_discovery':
    commands.append(['rg','-n',r'^## \[',str(source)]);output_roles.append('discovery');expected.append(None)
   for g in groups:
    command=['awk','-v','ids='+' '.join(g),AWK,str(source)] if method.startswith('native_') else [str(KIT/'scripts/sds-text'),'get',str(source),*g,'--max-lines','10000','--max-bytes','2097152']
    commands.append(command);output_roles.append('selection')
    expected.append(current.preamble+''.join(current.body(c) for c in g))
  else:
   index_path=temp/(case+'.index.md')
   # Fixture cache construction. The same generation command is measured/charged below.
   index_path.write_text(current.index())
   commands += [[str(KIT/'scripts/sds-text'),'index',str(source),'--max-lines','10000'],
                [str(KIT/'scripts/sds-text'),'check',str(source),'--index-file',str(index_path)]]
   output_roles += ['index','index_validation'];expected += [None,None]
   for g in groups:
    ranges=[(1,current.preamble_end)]+[(current.sections[c]['start']+1,current.sections[c]['end']) for c in g]
    commands.append(['sed','-n',*sum((['-e',f'{a},{b}p'] for a,b in ranges if b>=a),[]),str(source)])
    output_roles.append('selection');expected.append(current.preamble+''.join(current.body(c) for c in g))
  samples=[];outputs=[]
  for iteration in range(args.repetitions+1):
   begin=time.perf_counter_ns();iteration_outputs=[]
   for command,role in zip(commands,output_roles):
    run=subprocess.run(command,capture_output=True,check=True)
    iteration_outputs.append(run.stdout.decode())
    if role=='index':index_path.write_bytes(run.stdout)
   elapsed=(time.perf_counter_ns()-begin)/1e6
   if iteration:samples.append(elapsed)
   outputs=iteration_outputs
  matched=0;required_spans=0
  for i,(out,exp) in enumerate(zip(outputs,expected)):
   if exp is None:continue
   if method=='wrapper':
    # Exact bytes of each source span, not regenerated prose; output adds declared metadata.
    group=groups[i];assert current.preamble in out
    for code in group:
     required_spans+=1
     if current.body(code) in out:matched+=1
    info=json.loads(out.splitlines()[0][5:-4]);assert info['selected']==group
   else:
    assert out==exp,(case,method)
    n=len(current.sections) if method=='cat_reuse' else len(groups[i-(2 if method=='derived_index_cold' else 1 if method=='native_rg_awk_discovery' else 0)])
    matched+=n;required_spans+=n
  output_text='\n'.join(outputs)
  invocation='\n'.join(shlex.join(c) for c in commands)
  guide=reader_guide if method in ['wrapper','derived_index_cold'] else ''
  tokens=counts(output_text);invoke_tokens=counts(invocation)
  profiles={}
  for name in encodings:
   fixed_count=counts(fixed)[name];routing_count=counts(routed_text)[name];guide_count=counts(guide)[name]
   closure=counts(closure_text)[name]
   total=fixed_count+routing_count+guide_count+tokens[name]+invoke_tokens[name]
   # Accumulated input exposure over retrieval-result reasoning opportunities, without cache.
   prior=fixed_count+routing_count+guide_count;exposure=0
   for cmd,out in zip(commands,outputs):
    prior+=counts(shlex.join(cmd))[name]+counts(out)[name];exposure+=prior
   profiles[name]=dict(fixed=fixed_count,routed=routing_count,optional_guide=guide_count,
      invocation=invoke_tokens[name],retrieved=tokens[name],one_pass_input=total,
      modeled_closure_output=closure,modeled_uncached_input_exposure=exposure,
      normalized_one_pass_cost_units=(total+closure)/1e6)
  rows.append(dict(case=case,method=method,source_sha256=current.sha,selected_groups=groups,
   bytes_returned=len(output_text.encode()),commands=commands,logical_retrieval_calls=len(commands),
   top_level_processes=len(commands),harness_calls_if_batched=1,model_calls_measured=0,
   output_roles=output_roles,tokens=profiles,required_spans=required_spans,matched_spans=matched,
   selection_recall=matched/required_spans,samples_ms=samples,median_ms=statistics.median(samples),
   p95_ms=sorted(samples)[math.ceil(.95*len(samples))-1],output_sha256=hashlib.sha256(output_text.encode()).hexdigest()))
result=dict(schema='sds-context-benchmark-v1',tokenizer='tiktoken=='+tiktoken.__version__,encodings=list(encodings),
 python=sys.version,platform=platform.platform(),repetitions=args.repetitions,corpus_sha256=doc.sha,corpus_bytes=len(raw),
 fixed_paths=fixed_paths,routed_paths=routed,fixed_hashes={x:hashlib.sha256((KIT/x).read_bytes()).hexdigest() for x in fixed_paths+routed},
 optional_guide_sha256=hashlib.sha256(reader_guide.encode()).hexdigest(),rows=rows,
 costs_note='Normalized units assume one unit per million input/output tokens, no cache. Not provider prices or observed billing. Guide charged in full for new helper user. Includes fixed+selected governance, invocation text, all returned indices/metadata/repeated preambles and modeled closure output. Harness envelope, real completion/reasoning, network, maintenance labor and dollar charges unavailable; not zero.',
 limitations=['No LLM evaluated, no blinded semantic task-selection result.','Source-span recall only, audited same-author task sets.','Native awk safe only for this verified fence-free header corpus; reader adversarial fixtures separate.','Derived index generation+validation charged; no benefit assumed for a free cache.','Cold command startups/warm filesystem, one warmup excluded; local latency is not model latency.','Followup cat is reused once; no fake second full document read.'])
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
for row in rows:
 print(row['case'],row['method'],row['bytes_returned'],row['tokens']['o200k_base']['one_pass_input'],round(row['median_ms'],2),row['logical_retrieval_calls'])
