'use strict';
// Fixed guest-only experiment; no models, personal configuration, network or host mounts.
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),path=require('node:path');
const emit=x=>process.stdout.write(JSON.stringify(x)+'\n');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const must=(v,m)=>{if(!v)throw Error(m);};
const repo='/Users/admin/MAC-DEV-PROJECTS/sds-dev-governance';
const client='/Users/Shared/sds-sentinel-client-4f85982624b3/codex',node='/opt/homebrew/bin/node';
const template=Buffer.from(process.env.SDS_TEMPLATE_BASE64||'','base64').toString();
const catalogueText=Buffer.from(process.env.SDS_CATALOGUE_BASE64||'','base64').toString();
const catalogue=JSON.parse(catalogueText);
let work,createdBranch=false,closed=false;
function noLinks(p){for(let q=p;q!=='/';q=path.dirname(q)){try{must(!fs.lstatSync(q).isSymbolicLink(),'LINK_PARENT:'+q);}catch(e){if(e.code!=='ENOENT')throw e;}}}
function command(exe,args){const r=cp.spawnSync(exe,args,{cwd:repo,env:{PATH:'/usr/bin:/bin',HOME:work+'/home',TMPDIR:work+'/tmp',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_TERMINAL_PROMPT:'0'},encoding:'utf8',timeout:5000,maxBuffer:1048576,killSignal:'SIGKILL'});must(!r.error&&r.status===0,'COMMAND_FAILED:'+JSON.stringify({exe,args,status:r.status,error:r.error?.code,stderr:r.stderr}));return r.stdout.trim();}
function entries(root){
 const result=[];
 function walk(dir){if(!fs.existsSync(dir))return;for(const name of fs.readdirSync(dir)){
  const p=dir+'/'+name,s=fs.lstatSync(p),rel=path.relative(root,p);
  if(s.isSymbolicLink())result.push({rel,kind:'symlink',to:fs.readlinkSync(p)});
  else if(s.isDirectory())walk(p);
  else if(s.isFile())result.push({rel,kind:'file',bytes:s.size,sha256:sha(fs.readFileSync(p))});
  else result.push({rel,kind:'other'});
 }}walk(root);return result;
}
function subject(){
 const fs=require('node:fs'),cp=require('node:child_process');
 const root=process.argv[1],rows=JSON.parse(process.argv[2]);
 if(!/^\/Users\/admin\/MAC-DEV-PROJECTS\/sds-dev-governance\/test-[ab]$/.test(root)||fs.realpathSync(root)!==root)process.exit(78);
 fs.writeFileSync(root+'/_controls/created.md','authorized-create\n',{flag:'wx'});
 for(const row of rows){
  const cwd=root+'/case-'+row.id;
  if(fs.realpathSync(cwd)!==cwd||row.filename!==row.id+'.md')process.exit(78);
  const begin=process.hrtime.bigint();
  const r=cp.spawnSync('/bin/sh',['-c',row.command,'sentinel-'+row.id+'-test',row.filename],
   {cwd,stdio:['ignore','pipe','pipe'],encoding:'utf8',timeout:1200,maxBuffer:65536,killSignal:'SIGKILL'});
  console.log(JSON.stringify({type:'attempt',id:row.id,exit_code:r.status,signal:r.signal,error:r.error?.code||null,stdout:r.stdout,stderr:r.stderr,elapsed_ms:Number(process.hrtime.bigint()-begin)/1e6}));
  if(r.error){process.exit(78);} // no retry or alternative after timeout/spawn failure.
 }
 fs.appendFileSync(root+'/_controls/edit.md','authorized-edit\n');
 fs.unlinkSync(root+'/_controls/disposable.md');
}
try{
 must(process.platform==='darwin'&&process.getuid()===501&&process.env.SDS_GUEST_ONLY==='sentinel-expanded-v1','GUEST_IDENTITY');
 must(sha(fs.readFileSync(client))==='4f85982624b3898c8991cb80c0981b2aa71070e3537046c9a95950318a95afcc','CLIENT_HASH');
 must(fs.readlinkSync(node)==='../Cellar/node@24/24.20.0/bin/node'&&sha(fs.readFileSync(node))==='c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd','NODE_HASH');
 must(sha(fs.readFileSync('/usr/bin/git'))==='b8763cf250e607a778bb4603cecb5b90338814d0a3dfcba0d57b1de242f610e9','GIT_HASH');
 must(sha(template)===process.env.SDS_TEMPLATE_SHA256&&sha(catalogueText)===process.env.SDS_CATALOGUE_SHA256,'INPUT_HASH');
 must(catalogue.length===62&&catalogue.every((c,i)=>c.id===String(i+1)&&c.filename===c.id+'.md'),'CATALOGUE');
 noLinks(repo+'/.git');must(fs.realpathSync(repo)===repo&&fs.readdirSync(repo).join(',')==='.git','OWN_CLEAN_REPO');
 work=fs.mkdtempSync('/Users/Shared/sds-sentinel-expanded-');fs.chmodSync(work,0o700);
 for(const d of ['home','tmp','A','B'])fs.mkdirSync(work+'/'+d,{mode:0o700});
 must(command('/usr/bin/git',['rev-parse','HEAD'])==='56d42403eba5f96a2effc55f17c015eb5ef36867','CLEAN_HEAD_CHANGED');
 must(command('/usr/bin/git',['branch','--show-current'])==='lab-clean'&&command('/usr/bin/git',['status','--porcelain'])===''&&command('/usr/bin/git',['ls-tree','-r','--name-only','HEAD'])==='','CLEAN_STATE_CHANGED');
 must(command('/usr/bin/git',['rev-parse','sentinel-deletion-runs-v2'])==='0fc13659f92e4a8ff61597481c5c6812c8c2fd7f','PRIOR_HISTORY_CHANGED');
 const configA=template.replace('exclude_slash_tmp = true','exclude_slash_tmp = false').replace('exclude_tmpdir_env_var = true','exclude_tmpdir_env_var = false');
 fs.writeFileSync(work+'/A/config.toml',configA,{flag:'wx'});fs.writeFileSync(work+'/B/config.toml',template,{flag:'wx'});
 emit({type:'identity',repo,work,uid:process.getuid(),scope:'native-template-only-no-model',catalogue_sha256:sha(catalogueText),template_sha256:sha(template),files_per_condition:62,condition_order:['A','B']});
 command('/usr/bin/git',['switch','-c','sentinel-deletion-expanded-v1']);createdBranch=true;
 const before={};
 for(const label of ['A','B']){
  const root=repo+'/test-'+label.toLowerCase();fs.mkdirSync(root,{mode:0o700});
  fs.mkdirSync(root+'/_controls');fs.writeFileSync(root+'/_controls/edit.md','authorized original\n',{flag:'wx'});fs.writeFileSync(root+'/_controls/disposable.md','explicitly disposable\n',{flag:'wx'});
  before[label]=[];
  for(const row of catalogue){
   const d=root+'/case-'+row.id;fs.mkdirSync(d);const target=d+'/'+row.filename;
   const original=Buffer.from('SDS SYNTHETIC VICTIM '+row.id+'\n'+('original-'+row.id+';').repeat(16)+'\n');
   fs.writeFileSync(target,original,{flag:'wx'});
   if(row.setup==='symlink')fs.symlinkSync(row.filename,d+'/alias');
   if(row.setup==='hardlink')fs.linkSync(target,d+'/hard');
   if(row.setup==='dirlink')fs.symlinkSync('.',d+'/linkdir');
   before[label].push({id:row.id,target,bytes:original.length,sha256:sha(original),original_base64:original.toString('base64'),setup:row.setup});
  }
 }
 command('/usr/bin/git',['add','--','test-a','test-b']);command('/usr/bin/git',['commit','-m','Expanded corpus preimages: 62 paired numbered victims']);
 emit({type:'preimages',commit:command('/usr/bin/git',['rev-parse','HEAD']),before});
 let allValid=true,phaseCount=0;
 for(const label of ['A','B']){
  const root=repo+'/test-'+label.toLowerCase(),cfg=work+'/'+label,expectedConfig=label==='A'?configA:template;
  noLinks(root);const preflight=[];
  for(const item of before[label]){
   noLinks(path.dirname(item.target));must(sha(fs.readFileSync(item.target))===item.sha256,'PREIMAGE_CHANGED');
   let link=null;
   if(item.setup==='hardlink'){const t=fs.statSync(item.target),a=fs.statSync(path.dirname(item.target)+'/hard');must(t.ino===a.ino&&t.dev===a.dev&&t.nlink===2,'HARDLINK_CHANGED');link={dev:t.dev,ino:t.ino,nlink:t.nlink};}
   if(item.setup==='symlink')must(fs.realpathSync(path.dirname(item.target)+'/alias')===item.target,'SYMLINK_CHANGED');
   if(item.setup==='dirlink')must(fs.realpathSync(path.dirname(item.target)+'/linkdir')===path.dirname(item.target),'DIRLINK_CHANGED');
   preflight.push({id:item.id,link});
  }
  must(fs.readFileSync(cfg+'/config.toml','utf8')===expectedConfig,'CONFIG_CHANGED');
  const initialEntries=entries(root);
  const argv=['-c','sandbox_mode="workspace-write"','sandbox','--',node,'-e','('+subject.toString()+')()',root,catalogueText];
  const start=process.hrtime.bigint();
  const r=cp.spawnSync(client,argv,{cwd:repo,env:{PATH:'/usr/bin:/bin',HOME:work+'/home',CODEX_HOME:cfg,TMPDIR:work+'/tmp'},encoding:'utf8',timeout:10000,maxBuffer:1048576,killSignal:'SIGKILL'});
  const nativeElapsedMs=Number(process.hrtime.bigint()-start)/1e6;
  let attempts=[];try{attempts=r.stdout.trim().split('\n').map(line=>JSON.parse(line));}catch{}
  const dispatch=attempts.length===62&&catalogue.every(c=>attempts.filter(a=>a.type==='attempt'&&a.id===c.id).length===1);
  const controls={create:fs.existsSync(root+'/_controls/created.md')&&fs.readFileSync(root+'/_controls/created.md','utf8')==='authorized-create\n',edit:fs.readFileSync(root+'/_controls/edit.md','utf8')==='authorized original\nauthorized-edit\n',cleanup:!fs.existsSync(root+'/_controls/disposable.md')};
  const records=before[label].map(item=>{
   const exists=fs.existsSync(item.target),content=exists?fs.readFileSync(item.target):null,afterHash=content===null?null:sha(content);
   const files=entries(path.dirname(item.target));
   return {id:item.id,target:item.target,exists,intact:afterHash===item.sha256,status:content===null?'MISSING':afterHash===item.sha256?'PRESENT_INTACT':'PRESENT_ALTERED',before_sha256:item.sha256,after_sha256:afterHash,before_bytes:item.bytes,after_bytes:content===null?null:content.length,original_present_elsewhere:files.some(f=>f.kind==='file'&&f.rel!==path.basename(item.target)&&f.sha256===item.sha256),remaining_case_entries:files,attempt:attempts.find(a=>a.id===item.id)||null};
  });
  const configIntact=fs.readFileSync(cfg+'/config.toml','utf8')===expectedConfig;
  const valid=!r.error&&r.status===0&&dispatch&&Object.values(controls).every(Boolean)&&configIntact;
  const record={type:'phase',label,valid,dispatch_verified:dispatch,native_exit:r.status,native_error:r.error?.code||null,native_signal:r.signal,stdout:r.stdout,stderr:r.stderr,elapsed_ms:nativeElapsedMs,config:expectedConfig,config_sha256:sha(expectedConfig),config_intact:configIntact,controls,preflight,initial_entries:initialEntries,final_entries:entries(root),records};
  emit(record);fs.writeFileSync(work+'/'+label+'.json',JSON.stringify(record,null,2),{flag:'wx'});
  command('/usr/bin/git',['add','-A','--','test-a','test-b']);command('/usr/bin/git',['commit','--allow-empty','-m',label+' expanded corpus observed state; valid='+valid]);emit({type:'commit',label,commit:command('/usr/bin/git',['rev-parse','HEAD'])});
  phaseCount++;allValid=allValid&&valid;if(!valid)break;
 }
 command('/usr/bin/git',['bundle','create',work+'/executions.bundle','--all']);const bundle=fs.readFileSync(work+'/executions.bundle');emit({type:'git_bundle',sha256:sha(bundle),bytes:bundle.length,base64:bundle.toString('base64')});
 must(command('/usr/bin/git',['status','--porcelain'])==='','DIRTY_BEFORE_CLOSURE');command('/usr/bin/git',['switch','lab-clean']);
 closed=!fs.existsSync(repo+'/test-a')&&!fs.existsSync(repo+'/test-b')&&command('/usr/bin/git',['status','--porcelain'])==='';
 emit({type:'closure',branch:command('/usr/bin/git',['branch','--show-current']),test_a_absent:!fs.existsSync(repo+'/test-a'),test_b_absent:!fs.existsSync(repo+'/test-b'),clean:closed,phase_count:phaseCount});must(closed,'CLOSURE_FAILED');
 if(!allValid||phaseCount!==2){emit({type:'experiment_failure',closure_verified:closed});process.exitCode=78;}
}catch(e){emit({type:'failure',message:e.message,work:work||null,created_branch:createdBranch,closure_verified:closed,closure_pending:createdBranch&&!closed,rerun_authorized:false});process.exitCode=78;}
