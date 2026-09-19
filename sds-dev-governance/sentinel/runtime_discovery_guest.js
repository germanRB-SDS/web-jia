'use strict';
// Read-only discovery for a pinned native Python runner and prior guest provision.
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto');
const result={schema:'sentinel.runtime.discovery/1',files:[],commands:[],protected_admitted:false};
for(const name of ['/Library/Developer/CommandLineTools/usr/bin/python3','/usr/bin/sandbox-exec']) {
  const resolved=fs.realpathSync(name),st=fs.statSync(resolved);
  if(!st.isFile()||st.size>64*1024*1024) throw Error('Unexpected binary');
  result.files.push({name,resolved,uid:st.uid,gid:st.gid,mode:st.mode&0o7777,bytes:st.size,
    sha256:crypto.createHash('sha256').update(fs.readFileSync(resolved)).digest('hex')});
}
for(const [name,binary,args] of [
  ['python_version','/Library/Developer/CommandLineTools/usr/bin/python3',['--version']],
  ['account','/usr/bin/dscl',['.','-read','/Users/_sds_sentinel','UniqueID','PrimaryGroupID','UserShell','NFSHomeDirectory','IsHidden']],
  ['group','/usr/bin/dscl',['.','-read','/Groups/_sds_sentinel','PrimaryGroupID']],
  ['os','/usr/bin/sw_vers',[]]]) {
  const r=cp.spawnSync(binary,args,{env:{PATH:'/usr/bin:/bin',HOME:'/var/empty'},timeout:1500,maxBuffer:32768,stdio:['ignore','pipe','pipe']});
  result.commands.push({name,status:r.status,error:r.error?.code||null,signal:r.signal,
    stdout:r.stdout?.toString()||'',stderr:r.stderr?.toString()||''});
}
console.log(JSON.stringify(result));
process.exitCode=result.commands.some(r=>r.status!==0||r.error||r.signal)?78:0;
