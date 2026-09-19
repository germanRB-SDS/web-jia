"""Deterministic contract tests, not an independent/blinded routing evaluation."""
import hashlib,json,os
from pathlib import Path
import subprocess,sys,tempfile,unittest
KIT=Path(__file__).resolve().parent.parent
SHELL=sys.argv.pop(1) if len(sys.argv)>1 and sys.argv[1].startswith('/') else '/bin/bash'
sys.path.insert(0,str(KIT/'scripts'))
from sds_text import Document,read_file

TEXT='''# Example Ü
Global invariant. Never execute the document.
<!-- sds-text:required CORE-00 -->
## [CORE-00] Invariants
Keep scopes.
## [A-10] Topic [brackets]
<!-- sds-text:depends CORE-00 -->
Topic A.
```md
## [FAKE-00] False header
```
## [B-20] Followup
<!-- sds-text:depends A-10 -->
Topic B.'''

class Selective(unittest.TestCase):
 def setUp(self):
  self.tmp=Path(tempfile.mkdtemp(prefix='sds-text-test-'));self.file=self.tmp/'text Ü.md';self.file.write_text(TEXT)
 def call(self,*args,code=0,file=None):
  p=subprocess.run([SHELL,str(KIT/'scripts/sds-text'),args[0],str(file or self.file),*args[1:]],capture_output=True,text=True)
  self.assertEqual(p.returncode,code,p.stderr)
  if code:self.assertEqual(p.stdout,'')
  return p.stdout
 def test_closure_and_preamble(self):
  out=self.call('get','B-20');info=json.loads(out.splitlines()[0][5:-4])
  self.assertEqual(info['selected'],['CORE-00','A-10','B-20'])
  self.assertIn('Global invariant.',out);self.assertEqual(out.count('## [CORE-00]'),1)
  self.assertNotIn('FAKE-00',json.dumps(json.loads(self.call('list'))['sections']))
 def test_errors_atomic(self):
  for args in [('get',),('get','A-10','MISSING'),('get','A-10','A-10'),('get','B-20','--max-bytes','20'),('get','A-10','--max-lines','1'),('get','A-10','--expect-sha256','0'*64),('check','A-10'),('index','--max-bytes','0')]:
   self.call(*args,code=2)
 def test_invalid_documents(self):
  for text in [TEXT+'\n## [A-10] Again',TEXT+'\n```',TEXT.replace('depends A-10','depends MISSING'),TEXT.replace('depends CORE-00','depends B-20'),TEXT.replace('## [B-20]','## Plain'),TEXT.replace('## [B-20]',' ## [B-20]'),TEXT.replace('sds-text:depends A-10','sds-text:wrong A-10'),'## [a] bad','no sections']:
   self.file.write_text(text);self.call('check',code=2)
 def test_crlf_unicode_and_fences(self):
  raw=TEXT.replace('\n','\r\n').encode();self.file.write_bytes(raw)
  d=Document(read_file(self.file));self.assertEqual(d.raw,raw);self.assertIn('\r\n',d.body('A-10'))
  self.assertTrue(d.body('B-20').endswith('Topic B.'))
  self.file.write_text(TEXT.replace('```md','   ~~~~md').replace('```\n','   ~~~~\n'))
  self.call('check')
 def test_index_and_repin_after_title_line_change(self):
  index=self.tmp/'index.md';index.write_text(self.call('index'));self.call('check','--index-file',str(index))
  old=hashlib.sha256(self.file.read_bytes()).hexdigest()
  self.file.write_text('\n'*20+TEXT.replace('Topic [brackets]','Renamed title'))
  self.call('check','--index-file',str(index),code=2)
  self.call('get','A-10','--expect-sha256',old,code=2)
  info=json.loads(self.call('list'));section=next(s for s in info['sections'] if s['code']=='A-10')
  self.assertEqual(section['lines'][0],26);self.assertEqual(section['title'],'Renamed title')
 def test_physical_line_ranges(self):
  self.file.write_text(TEXT.replace('Topic A.', 'Topic A.\u2028Still same physical line.'))
  data=json.loads(self.call('list'));self.assertEqual(data['sections'][-1]['lines'][0],12)
  self.file.write_bytes(b'## [CORE-00] Title\rBare carriage return')
  self.call('check',code=2)
 def test_preface_h2_is_always_retained(self):
  self.file.write_text('## PREFACE — NON-EXECUTABLE\nUniversal boundary.\n'+TEXT)
  self.assertIn('Universal boundary.',self.call('get','A-10'))
 def test_file_boundaries(self):
  link=self.tmp/'linked.md';link.symlink_to(self.file);self.call('check',code=2,file=link)
  self.call('check',code=2,file=self.tmp/'missing');self.call('check',code=2,file=self.tmp)
  self.file.write_bytes(b'\xff');self.call('check',code=2)
  self.file.write_bytes(b'x'*(2*1024*1024+1));self.call('check',code=2)
  fifo=self.tmp/'pipe';os.mkfifo(fifo);self.call('check',code=2,file=fifo)
 def test_declared_and_caller_dependencies(self):
  self.file.write_text(TEXT.replace('<!-- sds-text:required CORE-00 -->\n','').replace('<!-- sds-text:depends CORE-00 -->\n',''))
  out=self.call('get','A-10','--require','CORE-00');self.assertIn('Keep scopes.',out)
  self.call('get','A-10','--require','MISSING',code=2)

if __name__=='__main__':unittest.main(verbosity=2)
