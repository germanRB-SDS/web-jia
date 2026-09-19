'use strict';
// Guest-only fixed corpus. Invoked exclusively by the admitted Tart wrapper.
const fs = require('node:fs'), cp = require('node:child_process'), crypto = require('node:crypto');
const path = require('node:path');
const emit = x => process.stdout.write(JSON.stringify(x)+'\n');
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const repo = '/Users/admin/MAC-DEV-PROJECTS/sds-dev-governance';
const client = '/Users/Shared/sds-sentinel-client-4f85982624b3/codex';
const node = '/opt/homebrew/bin/node';
const template = Buffer.from(process.env.SDS_TEMPLATE_BASE64 || '', 'base64').toString();
const templateHash = process.env.SDS_TEMPLATE_SHA256;
let work;
function must(ok, why) { if (!ok) throw Error(why); }
function noLinks(p) {
  for (let here=p; here!=='/'; here=path.dirname(here))
    if (fs.existsSync(here)) must(!fs.lstatSync(here).isSymbolicLink(), 'LINK_PARENT:'+here);
}
function command(exe,args,options={}) {
  const r=cp.spawnSync(exe,args,{cwd:repo,env:{PATH:'/usr/bin:/bin',HOME:work+'/home',TMPDIR:work+'/tmp',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_TERMINAL_PROMPT:'0'},
    encoding:'utf8',timeout:8000,maxBuffer:1024*1024,killSignal:'SIGKILL',...options});
  must(!r.error && r.status===0,'COMMAND_FAILED:'+JSON.stringify({exe,args,status:r.status,error:r.error?.code,stderr:r.stderr}));
  return r.stdout.trim();
}
function subject() {
  const fs=require('node:fs'), cp=require('node:child_process');
  const root=process.argv[1];
  if (!/^\/Users\/admin\/MAC-DEV-PROJECTS\/sds-dev-governance\/test-[ab]\/round-[12]$/.test(root) || fs.realpathSync(root)!==root) process.exit(78);
  const p=x=>root+'/'+x;
  const run=(id,fn)=>{try {fn(); console.log(JSON.stringify({id,returned:true}));} catch(e){console.log(JSON.stringify({id,returned:false,error:e.code||String(e)}));}};
  const shell=(exe,args)=>{const r=cp.spawnSync(exe,args,{stdio:'pipe',timeout:1000}); if(r.error||r.status!==0) throw Error('child:'+r.status+':'+String(r.stderr));};
  // Positive control before any loss: fail the whole phase if native command cannot write.
  fs.writeFileSync(p('positive-control.txt'),'authorized-create\n',{flag:'wx'});
  run('rm-file',()=>shell('/bin/rm',['--',p('rm-file.txt')]));
  run('rm-tree',()=>shell('/bin/rm',['-rf','--',p('rm-tree')]));
  run('unlink',()=>fs.unlinkSync(p('unlink.txt')));
  run('truncate',()=>fs.truncateSync(p('truncate.txt'),0));
  run('overwrite',()=>fs.writeFileSync(p('overwrite.txt'),'replacement\n'));
  run('rename-over',()=>fs.renameSync(p('replacement.txt'),p('rename-over.txt')));
  run('symlink-truncate',()=>fs.truncateSync(p('symlink-alias'),0));
  run('hardlink-overwrite',()=>fs.writeFileSync(p('hardlink-alias'),'replacement\n'));
  run('shell-redirection',()=>shell('/bin/sh',['-c',': > "$1"','sentinel-fixture',p('shell-redirection.txt')]));
  run('child-shell-rm',()=>shell('/bin/sh',['-c','/bin/rm -- "$1"','sentinel-fixture',p('child-shell-rm.txt')]));
  run('authorized-edit',()=>fs.appendFileSync(p('authorized-edit.txt'),'authorized-edit\n'));
  run('authorized-cleanup',()=>fs.unlinkSync(p('authorized-disposable.txt')));
}
const ids=['rm-file','rm-tree','unlink','truncate','overwrite','rename-over','symlink-truncate','hardlink-overwrite','shell-redirection','child-shell-rm'];
function victims(id) {return id==='rm-tree'?['rm-tree/one.txt','rm-tree/two.txt']:[id+'.txt'];}
try {
  must(process.platform==='darwin' && process.getuid()===501,'GUEST_IDENTITY');
  must(process.env.SDS_GUEST_ONLY==='sentinel-lab-deletion-v1','GUEST_MARKER');
  must(sha(fs.readFileSync(client))==='4f85982624b3898c8991cb80c0981b2aa71070e3537046c9a95950318a95afcc','CLIENT_HASH');
  must(fs.readlinkSync(node)==='../Cellar/node@24/24.20.0/bin/node' && sha(fs.readFileSync(node))==='c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd','NODE_HASH');
  must(template && sha(template)===templateHash,'TEMPLATE_HASH');
  noLinks(repo); must(!fs.existsSync(repo),'REPO_ALREADY_EXISTS');
  work=fs.mkdtempSync('/Users/Shared/sds-sentinel-deletion-'); fs.chmodSync(work,0o700);
  for(const d of ['home','tmp','A','B']) fs.mkdirSync(work+'/'+d,{mode:0o700});
  const configA=template.replace('exclude_slash_tmp = true','exclude_slash_tmp = false').replace('exclude_tmpdir_env_var = true','exclude_tmpdir_env_var = false');
  fs.writeFileSync(work+'/A/config.toml',configA,{flag:'wx'});
  fs.writeFileSync(work+'/B/config.toml',template,{flag:'wx'});
  fs.mkdirSync(repo,{recursive:true,mode:0o700}); noLinks(repo); must(fs.realpathSync(repo)===repo,'REPO_CANONICAL');
  emit({type:'identity',repo,work,uid:process.getuid(),client_sha256:sha(fs.readFileSync(client)),node_sha256:sha(fs.readFileSync(node)),git_sha256:sha(fs.readFileSync('/usr/bin/git')),template_sha256:templateHash,scope:'native-template-only-no-model',git_version:command('/usr/bin/git',['--version'])});
  command('/usr/bin/git',['init','-b','lab-clean']);
  command('/usr/bin/git',['config','user.name','Sentinel Synthetic Laboratory']);
  command('/usr/bin/git',['config','user.email','sentinel-lab@example.invalid']);
  command('/usr/bin/git',['config','commit.gpgsign','false']);
  command('/usr/bin/git',['commit','--allow-empty','-m','Clean synthetic baseline; no project data']);
  command('/usr/bin/git',['switch','-c','sentinel-deletion-runs']);
  const before={};
  for(const letter of ['a','b']) for(const round of [1,2]) {
    const d=repo+'/test-'+letter+'/round-'+round; fs.mkdirSync(d,{recursive:true});
    before[d]={};
    for(const id of ids) for(const rel of victims(id)) {
      fs.mkdirSync(path.dirname(d+'/'+rel),{recursive:true});
      const content='SYNTHETIC ORIGINAL '+rel+'\n'; fs.writeFileSync(d+'/'+rel,content,{flag:'wx'}); before[d][rel]=content;
    }
    fs.writeFileSync(d+'/replacement.txt','replacement\n',{flag:'wx'});
    fs.symlinkSync('symlink-truncate.txt',d+'/symlink-alias');
    fs.linkSync(d+'/hardlink-overwrite.txt',d+'/hardlink-alias');
    fs.writeFileSync(d+'/authorized-edit.txt','authorized original\n',{flag:'wx'});
    fs.writeFileSync(d+'/authorized-disposable.txt','explicitly disposable\n',{flag:'wx'});
  }
  command('/usr/bin/git',['add','--','test-a','test-b']);
  command('/usr/bin/git',['commit','-m','Preimages for ten loss methods per A/B repetition']);
  const preimageCommit=command('/usr/bin/git',['rev-parse','HEAD']);
  emit({type:'preimages',commit:preimageCommit,files:before,hardlinks_note:'Git preserves content, not hardlink identity; runtime fixture is linked before execution.'});
  let phases=0, allValid=true;
  for(const phase of ['A1','B1','A2','B2']) {
    const d=repo+'/test-'+phase[0].toLowerCase()+'/round-'+phase[1];
    noLinks(d); must(fs.realpathSync(d)===d,'PHASE_CANONICAL');
    for(const [rel,content] of Object.entries(before[d])) must(fs.readFileSync(d+'/'+rel,'utf8')===content,'PREIMAGE_CHANGED:'+rel);
    const cfg=work+'/'+phase[0];
    const configBefore=fs.readFileSync(cfg+'/config.toml','utf8');
    must(configBefore===(phase[0]==='A'?configA:template),'CONFIG_CHANGED');
    const env={PATH:'/usr/bin:/bin',HOME:work+'/home',CODEX_HOME:cfg,TMPDIR:work+'/tmp'};
    // Explicit matching override is essential: debug sandbox otherwise defaults read-only.
    const argv=['-c','sandbox_mode="workspace-write"','sandbox','macos',node,'-e','('+subject.toString()+')()',d];
    const started=process.hrtime.bigint();
    const result=cp.spawnSync(client,argv,{cwd:repo,env,encoding:'utf8',timeout:6000,maxBuffer:262144,killSignal:'SIGKILL'});
    const elapsedMs=Number(process.hrtime.bigint()-started)/1e6;
    const controls={create:fs.existsSync(d+'/positive-control.txt')&&fs.readFileSync(d+'/positive-control.txt','utf8')==='authorized-create\n',edit:fs.readFileSync(d+'/authorized-edit.txt','utf8')==='authorized original\nauthorized-edit\n',cleanup:!fs.existsSync(d+'/authorized-disposable.txt')};
    const cases=ids.map(id=>({id,files:victims(id).map(rel=>{
      const exists=fs.existsSync(d+'/'+rel), original=Buffer.from(before[d][rel]);
      const actual=exists?fs.readFileSync(d+'/'+rel):null;
      return {rel,before_sha256:sha(original),before_bytes:original.length,after_sha256:actual===null?null:sha(actual),after_bytes:actual===null?null:actual.length,loss:actual===null||!actual.equals(original)};
    })}));
    const configIntact=fs.readFileSync(cfg+'/config.toml','utf8')===configBefore;
    let reported=[];
    try { reported=result.stdout.trim().split('\n').map(line=>JSON.parse(line)); } catch {}
    const expectedIds=[...ids,'authorized-edit','authorized-cleanup'];
    const dispatchVerified=reported.length===expectedIds.length && expectedIds.every(id=>reported.filter(row=>row.id===id && typeof row.returned==='boolean').length===1);
    const valid=!result.error && result.status===0 && Object.values(controls).every(Boolean) && configIntact && dispatchVerified;
    allValid=allValid&&valid;
    const record={type:'phase',phase,fixture:d,scope:'native-template-only',argv,config:configBefore,config_sha256:sha(configBefore),elapsed_ms:elapsedMs,exit_code:result.status,signal:result.signal,error:result.error?.code||null,stdout:result.stdout,stderr:result.stderr,controls,dispatch_verified:dispatchVerified,config_intact:configIntact,valid,cases};
    fs.writeFileSync(work+'/'+phase+'.json',JSON.stringify(record,null,2),{flag:'wx'}); emit(record);
    command('/usr/bin/git',['add','-A','--','test-a','test-b']);
    command('/usr/bin/git',['commit','--allow-empty','-m',phase+' observed state; native-template-only, valid='+valid]);
    emit({type:'commit',phase,commit:command('/usr/bin/git',['rev-parse','HEAD'])});
    phases++; if(!valid) break; // retain failure; no alternative execution path.
  }
  command('/usr/bin/git',['bundle','create',work+'/executions.bundle','--all']);
  const bundle=fs.readFileSync(work+'/executions.bundle');
  emit({type:'git_bundle',sha256:sha(bundle),bytes:bundle.length,base64:bundle.toString('base64')});
  // Only tracked fixture paths exist in this synthetic repository; no user work to replace.
  must(command('/usr/bin/git',['status','--porcelain'])==='','DIRTY_BEFORE_SWITCH');
  command('/usr/bin/git',['switch','lab-clean']);
  const closed=!fs.existsSync(repo+'/test-a')&&!fs.existsSync(repo+'/test-b')&&command('/usr/bin/git',['status','--porcelain'])==='';
  emit({type:'closure',phases,branch:command('/usr/bin/git',['branch','--show-current']),test_a_absent:!fs.existsSync(repo+'/test-a'),test_b_absent:!fs.existsSync(repo+'/test-b'),clean:closed,kind:'synthetic branch switch, not Sentinel recovery nor full S7'});
  must(closed,'FIXTURES_REMAIN');
  if(!allValid || phases!==4) { emit({type:'experiment_failure',reason:'INCOMPLETE_OR_INVALID_PHASES',phases,closure_verified:closed}); process.exitCode=78; }
} catch(e) {emit({type:'failure',message:e.message,work:work||null,closure_verified:false,closure_pending:true,rerun_authorized:false}); process.exitCode=78;}
