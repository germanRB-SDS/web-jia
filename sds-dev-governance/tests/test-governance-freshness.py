"""Read-only freshness cases against disposable local Git remotes; no network needed."""
import hashlib,json,os
from pathlib import Path
import shutil,subprocess,sys,tempfile,unittest
KIT=Path(__file__).resolve().parent.parent
SHELL=sys.argv.pop(1) if len(sys.argv)>1 and sys.argv[1].startswith('/') else '/bin/bash'
sys.path.insert(0,str(KIT/'scripts'))
from governance_tree import inventory,fingerprint

class Freshness(unittest.TestCase):
 def setUp(self):
  self.tmp=Path(tempfile.mkdtemp(prefix='sds-freshness-test-'));self.repo=self.tmp/'kit';self.repo.mkdir()
  self.git('init','-q','-b','main');(self.repo/'GOVERNANCE.md').write_text('baseline')
  self.git('add','GOVERNANCE.md');self.commit('baseline');self.a=self.git('rev-parse','HEAD')
  self.remote=self.tmp/'remote.git';subprocess.run(['git','clone','-q','--bare',str(self.repo),str(self.remote)],check=True)
  self.git('remote','add','origin',str(self.remote))
 def git(self,*args):
  return subprocess.check_output(['git','--no-optional-locks','-C',str(self.repo),*args],text=True,stderr=subprocess.DEVNULL).strip()
 def commit(self,title):self.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm',title)
 def move_remote(self,oid):subprocess.run(['git','--git-dir',str(self.remote),'update-ref','refs/heads/main',oid],check=True)
 def advance_local(self):
  (self.repo/'GOVERNANCE.md').write_text('local evolution');self.git('add','GOVERNANCE.md');self.commit('evolve');return self.git('rev-parse','HEAD')
 def call(self,*args,kit=None,active=None,env=None,code=1):
  before=self.git('rev-parse','HEAD'),self.git('status','--porcelain'),(self.repo/'.git/index').read_bytes(),(self.repo/'.git/config').read_bytes()
  p=subprocess.run([SHELL,str(KIT/'scripts/governance-freshness.sh'),'--kit',str(kit or self.repo),'--active-revision',active or self.a,*args],env=env,capture_output=True,text=True,timeout=10)
  self.assertEqual(p.returncode,code,p.stderr)
  after=self.git('rev-parse','HEAD'),self.git('status','--porcelain'),(self.repo/'.git/index').read_bytes(),(self.repo/'.git/config').read_bytes()
  self.assertEqual(before,after);self.assertFalse((self.repo/'.git/FETCH_HEAD').exists())
  if code==2:self.assertEqual(p.stdout,'');return p
  data=json.loads(p.stdout);self.assertFalse(data['updated']);return data
 def test_current_offline_dirty_and_pin(self):
  self.assertTrue(self.call(code=0)['verified_current'])
  self.assertEqual(self.call('--offline')['relation'],'OFFLINE')
  (self.repo/'incubation.md').write_text('retain')
  self.assertIn('LOCAL_CHANGES_PRESERVED',self.call()['issues'])
  self.assertIn('ACTIVE_REVISION_MISMATCH',self.call(active='0'*40)['issues'])
 def test_ancestry_ahead_behind_diverged(self):
  b=self.advance_local();self.assertEqual(self.call(active=b)['relation'],'LOCAL_AHEAD_OR_INCUBATION')
  # Populate disposable bare object store, then independently change its branch.
  self.git('push','-q','origin','HEAD:refs/heads/future');self.move_remote(b);self.git('checkout','-q','--detach',self.a)
  self.assertEqual(self.call()['relation'],'REMOTE_AHEAD')
  self.git('checkout','-q','-b','parallel');(self.repo/'other').write_text('different');self.git('add','other');self.commit('parallel')
  self.assertEqual(self.call(active=self.git('rev-parse','HEAD'))['relation'],'DIVERGED')
 def test_unknown_remote_object_and_unavailable(self):
  other=self.tmp/'other';subprocess.run(['git','clone','-q',str(self.remote),str(other)],check=True)
  subprocess.run(['git','-C',str(other),'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm','remote-only'],check=True)
  subprocess.run(['git','-C',str(other),'push','-q','origin','HEAD:main'],check=True)
  self.assertEqual(self.call()['relation'],'REMOTE_DIFFERENT_ANCESTRY_UNKNOWN')
  self.assertEqual(self.call('--remote',str(self.tmp/'missing'))['relation'],'REMOTE_UNAVAILABLE')
 def test_vendored_provenance_and_incubation(self):
  copy=self.tmp/'vendored';shutil.copytree(self.repo,copy,ignore=shutil.ignore_patterns('.git'))
  fp=fingerprint(inventory(copy))
  self.assertIn('VENDORED_PROVENANCE_UNVERIFIED',self.call('--remote',str(self.remote),kit=copy)['issues'])
  self.assertTrue(self.call('--remote',str(self.remote),'--expected-fingerprint',fp,kit=copy,code=0)['verified_current'])
  (copy/'GOVERNANCE.md').write_text('incubated')
  self.assertIn('TREE_DELTA_OR_INCUBATION_PRESERVED',self.call('--remote',str(self.remote),'--expected-fingerprint',fp,kit=copy)['issues'])
 def test_timeout_and_invalid_inputs(self):
  bin_dir=self.tmp/'bin';bin_dir.mkdir();real=shutil.which('git')
  script=bin_dir/'git';script.write_text('#!'+sys.executable+'\nimport os,sys,time\nif "ls-remote" in sys.argv: time.sleep(3)\nos.execv('+repr(real)+',["git",*sys.argv[1:]])\n');script.chmod(0o755)
  env=dict(os.environ,PATH=str(bin_dir)+':'+os.environ['PATH'])
  self.assertEqual(self.call('--timeout','0.2',env=env)['relation'],'REMOTE_TIMEOUT')
  for args in [('--timeout','0'),('--remote','https://name:private@example.invalid/repo'),('--ref','refs/heads/a..b')]:self.call(*args,code=2)
  self.call(active='short',code=2)
 def test_tag_and_worktree(self):
  self.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','tag','-a','v1','-m','fixture')
  self.git('push','-q','origin','refs/tags/v1:refs/tags/v1')
  self.assertEqual(self.call('--ref','refs/tags/v1',code=0)['remote_revision'],self.a)
  worktree=self.tmp/'worktree';self.git('worktree','add','--detach',str(worktree))
  self.assertTrue(self.call(kit=worktree,code=0)['standalone'])

if __name__=='__main__':unittest.main(verbosity=2)
