"""Adversarial integration matrix. All writes and installer doubles are in a temporary root."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import re
import subprocess
import sys
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parent.parent
SHELL = sys.argv.pop(1) if len(sys.argv)>1 and sys.argv[1].startswith('/') else '/bin/bash'
sys.path.insert(0,str(SOURCE/'scripts'))
from governance_tree import inventory


class Safety(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp(prefix='sds-safety-',dir='/private/tmp' if Path('/private/tmp').exists() else None))
        cls.kit = cls.tmp/'kit'
        shutil.copytree(SOURCE,cls.kit,ignore=shutil.ignore_patterns('.git','__pycache__','.build'))
        cls.bin = cls.tmp/'bin';cls.bin.mkdir();(cls.bin/'bash').symlink_to(SHELL)
        for tool in ['npm','npx','curl','pip','pipx','uv','claude','codex','graphify','rsync']:
            p=cls.bin/tool;p.write_text('#!/bin/sh\necho unexpected-command >> "$SDS_UNEXPECTED_LOG"\nexit 97\n');p.chmod(0o755)
        cls.env=dict(os.environ,PATH=str(cls.bin)+':'+os.environ['PATH'],SDS_UNEXPECTED_LOG=str(cls.tmp/'unexpected'),
                     SDS_INSTALL_SKILLS='1',SDS_INSTALL_PLUGINS='1',SDS_INSTALL_GRAPHIFY='1')

    def target(self,name):
        p=self.tmp/self.id().split('.')[-1]/name;p.parent.mkdir(parents=True,exist_ok=True);return p

    def run_init(self,target,*args,code=0,env=None,kit=None):
        p=subprocess.run([SHELL,str((kit or self.kit)/'init.sh'),'Fixture Ü',str(target),*args],
                         capture_output=True,text=True,env=env or self.env,timeout=60)
        self.assertEqual(p.returncode,code,p.stdout[-500:]+p.stderr)
        return p

    def test_new_project_rerun_and_dry_plan(self):
        target=self.target('new spaces Ü')
        self.run_init(target,'--files-only','--dry-run');self.assertFalse(target.exists())
        self.run_init(target,'--files-only');first=inventory(target)
        self.run_init(target,'--files-only');self.assertEqual(first,inventory(target))
        self.assertFalse((target/'sds-dev-governance/.git').exists())
        self.assertFalse((self.tmp/'unexpected').exists())

    def test_hub_git_children_worktree_and_custody(self):
        hub=self.target('hub');hub.mkdir()
        for n in ['a','b']:
            child=hub/n;child.mkdir();subprocess.run(['git','init','-q',str(child)],check=True)
            (child/'AGENTS.md').write_text('private child {{RUTA_LOCAL}} {{NOMBRE_PROYECTO}}\n')
        subprocess.run(['git','-C',str(hub/'a'),'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm','fixture'],check=True)
        subprocess.run(['git','-C',str(hub/'a'),'worktree','add','--detach',str(hub/'worktree')],check=True,capture_output=True)
        (hub/'custody').mkdir();(hub/'custody/sentinel').write_text('{{RUTA_LOCAL}}')
        before={n:inventory(hub/n) for n in ['a','b','worktree','custody']}
        git_index=(hub/'a/.git/index');index=git_index.read_bytes() if git_index.exists() else None
        subprocess.run(['git','init','-q',str(hub)],check=True)
        self.run_init(hub,'--mode','hub')
        for n,tree in before.items():self.assertEqual(tree,inventory(hub/n))
        self.assertEqual(index,git_index.read_bytes() if git_index.exists() else None)
        self.assertIn('Independent Repository Boundary',(hub/'AGENTS.md').read_text())
        ignored=subprocess.run(['git','-C',str(hub),'check-ignore','a','b','worktree','custody'],capture_output=True,text=True)
        self.assertEqual(ignored.returncode,0);self.assertEqual(len(ignored.stdout.splitlines()),4)

    def test_existing_files_and_sds_new(self):
        target=self.target('existing');target.mkdir();(target/'AGENTS.md').write_text('my {{NOMBRE_PROYECTO}}')
        self.run_init(target,'--files-only',code=3)
        self.assertEqual((target/'AGENTS.md').read_text(),'my {{NOMBRE_PROYECTO}}')
        first=inventory(target);self.run_init(target,'--files-only',code=3);self.assertEqual(first,inventory(target))
        (target/'AGENTS.md.sds-new').write_text('incubated');first=inventory(target)
        self.run_init(target,'--files-only',code=2);self.assertEqual(first,inventory(target))

    def test_invalid_modules_fail_before_writes(self):
        for i,spec in enumerate(['../escape|X','/absolute|X','a/../b|X','a//b|X','a|X;a|Y','a|X;a/b|Y','docs|X','a|X;']):
            target=self.target('invalid'+str(i));env=dict(self.env,SDS_NESTED_MODULES=spec)
            self.run_init(target,'--files-only',env=env,code=2);self.assertFalse(target.exists())
        target=self.target('independent');(target/'a').mkdir(parents=True)
        subprocess.run(['git','init','-q',str(target/'a')],check=True)
        self.run_init(target,'--files-only',env=dict(self.env,SDS_NESTED_MODULES='a|X'),code=2)
        self.assertFalse((target/'AGENTS.md').exists())

    def test_explicit_monorepo(self):
        target=self.target('mono');env=dict(self.env,SDS_NESTED_MODULES='backend/api|API|service|dev')
        self.run_init(target,'--files-only',env=env)
        text=(target/'backend/api/AGENTS.md').read_text()
        self.assertIn('../../sds-dev-governance',text);self.assertNotIn('{{MODULE',text)
        for p in (target/'backend/api').rglob('*'):
            if p.is_file():
                for ref in re.findall(r'`([^`]+)`',p.read_text()):
                    if 'sds-dev-governance/' in ref or ref.endswith('capability-registry.md'):
                        self.assertTrue((target/'backend/api'/ref.split(' ')[0]).exists(),ref)
        self.run_init(self.target('hub'),'--mode','hub',env=env,code=2)

    def test_symlinks_and_directory_conflicts(self):
        outside=self.target('outside');outside.mkdir();(outside/'sentinel.md').write_text('{{RUTA_LOCAL}}')
        for i,rel in enumerate(['docs','AGENTS.md','sds-dev-governance']):
            target=self.target('link'+str(i));target.mkdir();(target/rel).symlink_to(outside)
            before=inventory(outside);self.run_init(target,'--files-only',code=2);self.assertEqual(before,inventory(outside))
        target=self.target('directory');(target/'AGENTS.md').mkdir(parents=True)
        self.run_init(target,'--files-only',code=2);self.assertFalse((target/'CLAUDE.md').exists())

    def test_existing_different_kit_and_self(self):
        target=self.target('existing-kit');target.mkdir();shutil.copytree(self.kit,target/'sds-dev-governance')
        (target/'sds-dev-governance/GOVERNANCE.md').write_text('local incubation');before=inventory(target)
        self.run_init(target,'--files-only',code=2);self.assertEqual(before,inventory(target))
        target=self.target('self');target.mkdir();shutil.copytree(self.kit,target/'sds-dev-governance')
        self.run_init(target,'--files-only',kit=target/'sds-dev-governance')
        self.assertFalse((target/'sds-dev-governance/sds-dev-governance').exists())

    def test_permissions_missing_source_and_global_flags(self):
        target=self.target('readonly');target.mkdir();target.chmod(0o555)
        try:
            if os.geteuid()!=0:self.run_init(target,'--files-only',code=2)
        finally:target.chmod(0o755)
        kit=self.target('broken-kit');shutil.copytree(self.kit,kit);(kit/'practices/INDEX.md').unlink()
        self.run_init(self.target('missing-source'),'--files-only',kit=kit,code=2)
        self.run_init(self.target('conflicting'),'--files-only','--install-skills',code=2)
        self.run_init(self.target('bad-env'),'--files-only',env=dict(self.env,SDS_INSTALL_SKILLS='oops'),code=2)

    def test_interruption_and_concurrent_creation(self):
        sys.path.insert(0,str(self.kit/'scripts'));from bootstrap import exclusive_write
        target=self.target('race');target.mkdir();(target/'existing').write_text('retain')
        fd=os.open(target,os.O_RDONLY|os.O_DIRECTORY)
        try:
            with self.assertRaises(FileExistsError):exclusive_write(fd,Path('existing'),b'bad',0o644)
            self.assertEqual((target/'existing').read_text(),'retain')
            exclusive_write(fd,Path('partial/a'),b'first',0o644)
        finally:os.close(fd)
        self.assertEqual((target/'partial/a').read_bytes(),b'first')
        # A partial kit is preserved, refused and recoverable, never overwritten as a retry.
        (target/'sds-dev-governance').mkdir();(target/'sds-dev-governance/VERSION.md').write_text('partial')
        before=inventory(target);self.run_init(target,'--files-only',code=2);self.assertEqual(before,inventory(target))

    def test_physical_aliases_and_hub_without_git(self):
        target=self.target('physical Ü');target.mkdir()
        shutil.copytree(self.kit,target/'sds-dev-governance')
        (target/'child').mkdir();(target/'child/.git').write_text('gitdir: ../private-metadata')
        (target/'child/AGENTS.md').write_text('{{RUTA_LOCAL}}')
        before=inventory(target/'child')
        result=subprocess.run([SHELL,'sds-dev-governance/init.sh','Fixture Ü','.',
                               '--mode','hub','--files-only'],cwd=target,env=self.env,capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertFalse((target/'.git').exists());self.assertEqual(before,inventory(target/'child'))
        link=target.parent/'alias';link.symlink_to(target)
        first=inventory(target)
        self.run_init(str(link)+'/../'+target.name+'/', '--mode','hub','--files-only',kit=target/'sds-dev-governance')
        self.assertEqual(first,inventory(target))
        self.run_init(link,'--mode','hub','--files-only',kit=target/'sds-dev-governance')
        self.assertEqual(first,inventory(target))

    def test_missing_python_and_modified_skill_preservation(self):
        bin_dir=self.target('missing-python');bin_dir.mkdir()
        for tool in ['dirname','pwd']:
            real=shutil.which(tool)
            if real:(bin_dir/tool).symlink_to(real)
        result=subprocess.run([SHELL,str(self.kit/'init.sh'),'X',str(self.target('no-python')),
                               '--files-only'],env=dict(self.env,PATH=str(bin_dir)),capture_output=True,text=True)
        self.assertNotEqual(result.returncode,0)
        self.assertFalse(self.target('no-python').exists())
        source=self.target('skill-source');source.mkdir();(source/'SKILL.md').write_text('canonical')
        dest=self.target('skill-dest');dest.mkdir();(dest/'SKILL.md').write_text('local incubation')
        result=subprocess.run([sys.executable,str(self.kit/'scripts/copy-skill.py'),str(source),str(dest)],capture_output=True)
        self.assertNotEqual(result.returncode,0);self.assertEqual((dest/'SKILL.md').read_text(),'local incubation')

    def test_installer_failure_is_nonzero(self):
        # Real helpers, isolated dry-run catalogs: no network or global writes.
        env=dict(self.env,SDS_SKILLS_DRY_RUN='1',SDS_PLUGINS_DRY_RUN='1')
        self.run_init(self.target('defaults'),env=env)
        env=dict(env,SDS_SKILLS_CATALOG=str(self.tmp/'missing-catalog'))
        self.run_init(self.target('failure'),env=env,code=2)


if __name__=='__main__':
    unittest.main(verbosity=2)
