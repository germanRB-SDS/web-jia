"""Classifier false-success and preservation regressions."""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
SHELL=sys.argv.pop(1) if len(sys.argv)>1 and sys.argv[1].startswith('/') else '/bin/bash'
KIT=Path(__file__).resolve().parent.parent

class Copies(unittest.TestCase):
 def setUp(self):
  self.tmp=Path(tempfile.mkdtemp(prefix='sds-copies-'))
  self.base=self.make('base','v2.0.0')
 def make(self,name,v):
  p=self.tmp/name;(p/'practices').mkdir(parents=True);(p/'skills').mkdir()
  for f,text in [('VERSION.md',v),('GOVERNANCE.md','governance'),('practices/INDEX.md','router'),('skills/README.md','skills'),('check-governance.sh','#!/bin/bash')]: (p/f).write_text(text)
  return p
 def run_copy(self,*args,code=0,data=None):
  p=subprocess.run([SHELL,str(KIT/'scripts/governance-copies.sh'),'--baseline',str(self.base),'--format','tsv',*map(str,args)],input=data,capture_output=True,text=True)
  self.assertEqual(p.returncode,code,p.stdout+p.stderr);return p
 def test_invalid_request_has_no_rows(self):
  for args in [[],['--path'],['--path',self.tmp/'absent'],['--root',self.tmp/'absent'],['--baseline',self.tmp/'absent','--path',self.base],['--depth','-1','--root',self.tmp],['--format','wat','--path',self.base]]:
   p=self.run_copy(*args,code=2);self.assertEqual(p.stdout,'')
 def test_empty_discovery_and_manifest_tail(self):
  p=self.tmp/'empty';p.mkdir();self.assertEqual(len(self.run_copy('--root',p).stdout.splitlines()),1)
  out=self.run_copy('--stdin',data=str(self.base)).stdout;self.assertIn('CANONICAL_MATCH',out)
  out=self.run_copy('--path',self.base,'--stdin',data=str(self.base)+'\n'+str(self.base)).stdout;self.assertEqual(len(out.splitlines()),2)
 def test_old_known_file_edit_never_safe(self):
  original=self.make('original','v1.0.0');copy=self.tmp/'copy';shutil.copytree(original,copy)
  out=self.run_copy('--path',copy).stdout;self.assertIn('INSPECT_BASELINE',out);self.assertNotIn('SAFE_UPGRADE',out)
  self.assertIn('SAFE_UPGRADE',self.run_copy('--path',copy,'--original-baseline',original).stdout)
  (copy/'GOVERNANCE.md').write_text('legitimate local fix')
  out=self.run_copy('--path',copy,'--original-baseline',original).stdout;self.assertIn('LOCAL_GOVERNANCE_DELTA',out);self.assertNotIn('SAFE_UPGRADE',out)
 def test_symlink_and_executable_identity(self):
  copy=self.tmp/'copy';shutil.copytree(self.base,copy);(copy/'link').symlink_to('/nonexistent')
  self.assertIn('SPLIT_VERSION',self.run_copy('--path',copy,code=1).stderr)
  (copy/'link').unlink();(copy/'check-governance.sh').chmod(0o755)
  self.assertIn('SPLIT_VERSION',self.run_copy('--path',copy,code=1).stderr)
 def test_transport_path_rejection_and_complete_validation(self):
  p=self.tmp/'bad\tpath';shutil.copytree(self.base,p)
  out=self.run_copy('--path',self.base,'--path',p,code=2);self.assertEqual(out.stdout,'')
 def test_missing_and_split_across_old_versions(self):
  a=self.make('a','v1.0.0');b=self.make('b','v1.0.0');(b/'GOVERNANCE.md').write_text('local')
  self.assertIn('SPLIT_VERSION',self.run_copy('--path',a,'--path',b,code=1).stderr)

if __name__=='__main__':unittest.main(verbosity=2)
