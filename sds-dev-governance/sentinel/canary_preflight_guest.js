'use strict';
// Fixed guest-only diagnostic: dedicated non-login subject, direct root eslogger,
// five bounded unlink canaries and custody probes on newly created synthetic files.
// This does not admit a protected client or claim lifecycle/recovery coverage.
const fs = require('node:fs');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const env = {PATH:'/usr/bin:/bin:/usr/sbin:/sbin', HOME:'/var/empty', LANG:'C'};
const node = '/opt/homebrew/Cellar/node@24/24.20.0/bin/node';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const commands = [], streams = [], children = [];
const result = {schema:'sentinel.canary.discovery/1', commands, cases:[], errors:[],
  account_created:false, group_created:false, provision_attempts:[], protected_admitted:false,
  service_absent:false, subject_uid:551, subject_gid:551};
let root, label, attempted = false;
function run(name, binary, args) {
  const r = cp.spawnSync(binary, args, {env, timeout:1500, maxBuffer:65536,
    stdio:['ignore','pipe','pipe']});
  const row = {name, status:r.status, signal:r.signal, error:r.error?.code || null,
    stdout:r.stdout?.toString('utf8') || '', stderr:r.stderr?.toString('utf8') || ''};
  commands.push(row); return row;
}
function requireSuccess(r) {
  if (r.status !== 0 || r.signal || r.error) throw Error('Command failed: '+r.name);
  return r;
}
function save(name, data) {
  const fd = fs.openSync(root+'/'+name, 'wx', 0o600);
  try { fs.writeFileSync(fd,data); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}
function best(stage, action) {
  try { return action(); } catch(e) { result.errors.push({stage,error:String(e)}); }
}
function drain(s) {
  const b=Buffer.alloc(16384);
  while (true) {
    let n;
    try { n=fs.readSync(s.fd,b,0,b.length,null); }
    catch(e) { if (e.code==='EAGAIN'||e.code==='EWOULDBLOCK') return; throw e; }
    if (!n) return;
    if (s.size+n>s.limit) throw Error('Sensor capacity');
    s.parts.push(Buffer.from(b.subarray(0,n))); s.size+=n;
  }
}
function account() {
  // Refuse existing names or numeric identities before any directory-service write.
  for (const [kind,id] of [['Users','UniqueID'],['Groups','PrimaryGroupID']]) {
    const listing=requireSuccess(run('list_'+kind,'/usr/bin/dscl',['.','-list','/'+kind,id]));
    for (const line of listing.stdout.trim().split('\n')) {
      const parts=line.trim().split(/\s+/);
      if (parts[0]==='_sds_sentinel'||parts.at(-1)==='551') throw Error('Account/group collision');
    }
  }
  for (const args of [
    ['.','-create','/Groups/_sds_sentinel'],
    ['.','-create','/Groups/_sds_sentinel','PrimaryGroupID','551'],
    ['.','-create','/Users/_sds_sentinel'],
    ['.','-create','/Users/_sds_sentinel','UniqueID','551'],
    ['.','-create','/Users/_sds_sentinel','PrimaryGroupID','551'],
    ['.','-create','/Users/_sds_sentinel','UserShell','/usr/bin/false'],
    ['.','-create','/Users/_sds_sentinel','NFSHomeDirectory','/var/empty'],
    ['.','-create','/Users/_sds_sentinel','IsHidden','1']]) {
    const attempt={args,state:'UNKNOWN'}; result.provision_attempts.push(attempt);
    if(args.length===3) result[args[2].startsWith('/Groups/')?'group_created':'account_created']=null;
    requireSuccess(run('provision_'+args[2]+'_'+(args[3]||'record'),'/usr/bin/dscl',args));
    attempt.state='CONFIRMED';
    if(args[2]==='/Groups/_sds_sentinel') result.group_created=true;
    if(args[2]==='/Users/_sds_sentinel') result.account_created=true;
  }
  result.account=requireSuccess(run('account_verify','/usr/bin/dscl',
    ['.','-read','/Users/_sds_sentinel','UniqueID','PrimaryGroupID','UserShell','NFSHomeDirectory','IsHidden']));
}
const subjectSource = `
'use strict';
const fs=require('node:fs');
const c=JSON.parse(process.argv[1]);
process.setgroups([]); process.setgid(551); process.setuid(551);
if(process.getuid()!==551||process.geteuid()!==551||process.getgid()!==551||
   process.getgroups().some(g=>g!==551)) throw Error('Privilege drop failed');
const r={uid:process.getuid(),gid:process.getgid(),groups:process.getgroups(),pid:process.pid,denials:{}};
for(const [name,fn] of [
 ['control_read',()=>fs.readFileSync(c.control)],
 ['original_write',()=>fs.writeFileSync(c.original,'unexpected')],
 ['signal_custodian',()=>process.kill(c.custodian,0)],
 ['regain_root',()=>process.setuid(0)]]) {
 try { fn(); r.denials[name]='UNEXPECTED_SUCCESS'; }
 catch(e) { r.denials[name]=e.code; }
 if(r.denials[name]==='UNEXPECTED_SUCCESS') throw Error('Custody failure: '+name);
}
fs.writeFileSync(c.work+'/legitimate.txt','legitimate',{flag:'wx',mode:0o600});
fs.appendFileSync(c.work+'/legitimate.txt',' append');
r.legitimate=fs.readFileSync(c.work+'/legitimate.txt','utf8')==='legitimate append';
fs.unlinkSync(c.canary);
r.canary_absent=!fs.existsSync(c.canary);
console.log(JSON.stringify(r));
`;
async function main() {
  if(process.getuid()!==0||process.geteuid()!==0) throw Error('Guest root required');
  if(hash(fs.readFileSync(node))!=='c8eedc7651a438fb7d2ceb36fd70032676c855586a36c950ba5a662f0b7853bd') throw Error('Node drift');
  if(hash(fs.readFileSync('/usr/bin/eslogger'))!=='ebff5608a2840a8b0b3ee2e4bbc9afaa1034171729c5e78c72ec63b0c7e1fcd1') throw Error('Sensor drift');
  root=fs.mkdtempSync('/private/var/tmp/sds-sentinel-canary-'); fs.chmodSync(root,0o755);
  result.root=root; label='com.sds.sentinel.canary.'+crypto.randomUUID(); result.label=label;
  console.log(JSON.stringify({schema:'sentinel.canary.start/1',root,label}));
  account();
  fs.mkdirSync(root+'/test-a',0o755); fs.mkdirSync(root+'/test-b',0o700);
  for(const [name,limit] of [['stdout',2*1024*1024],['stderr',65536]]) {
    requireSuccess(run('fifo_'+name,'/usr/bin/mkfifo',['-m','600',root+'/'+name+'.fifo']));
    streams.push({name,limit,size:0,parts:[],fd:fs.openSync(root+'/'+name+'.fifo',fs.constants.O_RDONLY|fs.constants.O_NONBLOCK)});
  }
  const plist=`<?xml version="1.0"?><plist version="1.0"><dict><key>Label</key><string>${label}</string>
<key>ProgramArguments</key><array><string>/usr/bin/eslogger</string><string>unlink</string><string>fork</string><string>exec</string><string>exit</string></array>
<key>RunAtLoad</key><true/><key>KeepAlive</key><false/><key>StandardOutPath</key><string>${root}/stdout.fifo</string>
<key>StandardErrorPath</key><string>${root}/stderr.fifo</string><key>WorkingDirectory</key><string>/var/empty</string>
<key>EnvironmentVariables</key><dict><key>PATH</key><string>/usr/bin:/bin</string><key>HOME</key><string>/var/empty</string></dict></dict></plist>`;
  save('sensor.plist',plist); requireSuccess(run('plist','/usr/bin/plutil',['-lint',root+'/sensor.plist']));
  attempted=true; requireSuccess(run('bootstrap','/bin/launchctl',['bootstrap','system',root+'/sensor.plist']));
  result.sensor_state=requireSuccess(run('sensor_state','/bin/launchctl',['print','system/'+label]));
  const match=result.sensor_state.stdout.match(/\n\s*pid = (\d+)\n/);
  if(!match||!result.sensor_state.stdout.includes('state = running')) throw Error('Sensor not running');
  result.sensor_pid=Number(match[1]);
  const started=performance.now(), deadline=started+4000;
  await pause(100);
  for(let i=1;i<=5;i++) {
    if(performance.now()>=deadline) throw Error('Collection deadline before fixture');
    const dir=root+'/test-a/case-'+i; fs.mkdirSync(dir,0o755);
    const work=dir+'/work'; fs.mkdirSync(work,0o700); fs.chownSync(work,551,551);
    const control=dir+'/control', original=dir+'/original', canary=work+'/canary.txt';
    fs.writeFileSync(control,'synthetic-control',{flag:'wx',mode:0o600});
    fs.writeFileSync(original,'synthetic-original',{flag:'wx',mode:0o444});
    fs.writeFileSync(canary,'canary-'+i,{flag:'wx',mode:0o444});
    const st=fs.statSync(canary), begin=performance.now();
    if(performance.now()>=deadline) throw Error('Collection deadline before subject');
    const child=cp.spawn(node,['-e',subjectSource,JSON.stringify({work,control,original,canary,custodian:process.pid})],
      {cwd:work,env,detached:true,stdio:['ignore','pipe','pipe']});
    const item={number:i,pid:child.pid,canary,canary_dev:st.dev,canary_ino:st.ino,
      stdout:'',stderr:'',exit:null,signal:null,error:null};
    children.push(child); result.cases.push(item);
    child.on('error',e=>{item.error=String(e);});
    for(const name of ['stdout','stderr']) child[name].on('data',b=>{
      if(Buffer.byteLength(item[name])+b.length>8192) {item.error='Subject output capacity';child.kill('SIGKILL');}
      else item[name]+=b.toString();
    });
    child.on('close',(code,signal)=>{item.exit=code;item.signal=signal;item.closed=true;});
    while(!item.closed&&!item.error&&performance.now()<Math.min(deadline,begin+600)) {
      for(const s of streams) drain(s); await pause(10);
    }
    item.elapsed_ms=performance.now()-begin;
    if(!item.closed||item.exit!==0||item.error) throw Error('Canary child failed or deadline');
    item.observation=JSON.parse(item.stdout);
    item.original_intact=fs.readFileSync(original,'utf8')==='synthetic-original';
    item.control_intact=fs.readFileSync(control,'utf8')==='synthetic-control';
    const o=item.observation;
    if(o.uid!==551||o.gid!==551||o.pid!==item.pid||!Array.isArray(o.groups)||
       o.groups.some(g=>g!==551)||!o.legitimate||!o.canary_absent||
       !item.original_intact||!item.control_intact||
       !['EACCES','EPERM'].includes(o.denials.control_read)||
       !['EACCES','EPERM'].includes(o.denials.original_write)||
       o.denials.signal_custodian!=='EPERM'||o.denials.regain_root!=='EPERM') throw Error('Custody/positive oracle failed');
    item.native_canary_attribution='PENDING_RAW_ANALYSIS';
  }
  while(performance.now()<deadline) { for(const s of streams) drain(s); await pause(10); }
  result.collection_elapsed_ms=performance.now()-started;
}
(async()=>{
  try { await main(); } catch(e) { result.errors.push({stage:'main',error:String(e)}); }
  finally {
    for(const c of children) if(c.exitCode===null&&c.signalCode===null) best('child_kill',()=>c.kill('SIGKILL'));
    // Allow exit/close handlers to reap only these five owned children before VM closure.
    const end=performance.now()+1000;
    while(children.some(c=>c.exitCode===null&&c.signalCode===null)&&performance.now()<end) await pause(10);
    result.children_closed=children.every(c=>c.exitCode!==null||c.signalCode!==null);
    if(attempted) {
      best('bootout',()=>{result.bootout=requireSuccess(run('bootout','/bin/launchctl',['bootout','system/'+label]));});
      best('service_absent',()=>{
        const r=run('final_state','/bin/launchctl',['print','system/'+label]);
        result.service_absent=r.status===113&&r.stderr.includes('Could not find service "'+label+'" in domain for system');
      });
    }
    for(const s of streams) {
      best('drain_'+s.name,()=>drain(s)); best('close_'+s.name,()=>fs.closeSync(s.fd));
      const b=Buffer.concat(s.parts); result[s.name]={bytes:b.length,sha256:hash(b),base64:b.toString('base64')};
      best('persist_'+s.name,()=>save(s.name+'.raw',b));
    }
    if(root) { best('persist_result',()=>save('result.json',JSON.stringify(result))); best('sync',()=>requireSuccess(run('sync','/bin/sync',[]))); }
    process.exitCode=result.errors.length||!result.service_absent||!result.children_closed||result.cases.length!==5?78:0;
    console.log(JSON.stringify(result));
  }
})();
