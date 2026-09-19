"""Location gate tests: mocked planning prevents all bootstrap writes, even on failure."""
import contextlib
import io
from pathlib import Path
import pwd
import os
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts'))
import bootstrap


class ReachedPlan(Exception):
    pass


class LocationGate(unittest.TestCase):
    def attempt(self, target, *, home=None, account=None, options=(), expected=ValueError):
        home = home or Path.home()
        account = account or Path(pwd.getpwuid(os.getuid()).pw_dir)
        argv = ['bootstrap', '--shell', '/bin/bash', 'Fixture', str(target), *options]
        with patch.object(sys, 'argv', argv), \
                patch.object(bootstrap.Path, 'home', return_value=home), \
                patch.object(bootstrap.pwd, 'getpwuid', return_value=SimpleNamespace(pw_dir=str(account))), \
                patch.object(bootstrap, 'snapshot', side_effect=ReachedPlan) as planning, \
                patch.object(bootstrap, 'exclusive_write') as writing, \
                patch.object(bootstrap.subprocess, 'run') as installers:
            with self.assertRaises(expected):
                bootstrap.main()
            self.assertEqual(planning.call_count, int(expected is ReachedPlan))
            writing.assert_not_called()
            installers.assert_not_called()

    def test_home_in_all_modes_before_planning(self):
        for options in [(), ('--dry-run',), ('--files-only',), ('--mode', 'hub'),
                        ('--mode', 'hub', '--dry-run'), ('--install-skills', '--install-plugins')]:
            with self.subTest(options=options):
                self.attempt(Path.home(), options=options)

    def test_account_home_still_rejected_when_environment_home_differs(self):
        self.attempt(Path(pwd.getpwuid(os.getuid()).pw_dir), home=Path('/synthetic-other-home'))

    def test_environment_home_also_rejected(self):
        self.attempt('/synthetic-environment-home', home=Path('/synthetic-environment-home'))

    def test_filesystem_root_rejected(self):
        self.attempt(Path(Path.cwd().anchor))

    def test_relative_dot_at_home_rejected(self):
        previous = Path.cwd()
        try:
            os.chdir(Path.home())
            self.attempt('.')
        finally:
            os.chdir(previous)

    def test_tilde_home_rejected(self):
        self.attempt('~')

    def test_symlink_and_parent_aliases_rejected(self):
        fixture = Path(tempfile.mkdtemp(prefix='sds-location-', dir='/private/tmp'
                                      if Path('/private/tmp').exists() else None))
        home = fixture / 'synthetic-home'
        home.mkdir()
        (home / 'child').mkdir()
        alias = fixture / 'alias'
        alias.symlink_to(home, target_is_directory=True)
        for target in [alias, home / 'child' / '..']:
            with self.subTest(target=target):
                self.attempt(target, home=home, account=home)
        # No teardown deletion. These synthetic fixtures are deliberately retained.
        print('Retained non-destructive location fixture:', fixture, file=sys.stderr)

    def test_project_subdirectory_and_similar_prefix_reach_planning(self):
        home = Path.home().resolve()
        for target in [home / 'projects' / 'example', home.with_name(home.name + '-project')]:
            with self.subTest(target=target):
                self.attempt(target, options=('--files-only', '--dry-run'), expected=ReachedPlan)

    def test_missing_account_identity_fails_before_planning(self):
        with patch.object(bootstrap.pwd, 'getpwuid', side_effect=KeyError('unresolved account')):
            with self.assertRaises(ValueError):
                bootstrap.validate_project_target(Path('/synthetic-project'))

    def test_help_explains_project_location(self):
        output = io.StringIO()
        with patch.object(sys, 'argv', ['bootstrap', '--help']), contextlib.redirect_stdout(output):
            with self.assertRaises(SystemExit) as result:
                bootstrap.main()
        self.assertEqual(result.exception.code, 0)
        self.assertIn('never directly in HOME', output.getvalue())


if __name__ == '__main__':
    unittest.main(verbosity=2)
