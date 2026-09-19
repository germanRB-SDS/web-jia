"""Report local/remote governance freshness without changing refs, files or active context."""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import sys
from urllib.parse import urlsplit
from governance_tree import inventory, fingerprint, safe_name


def run_git(root, args, timeout):
    env = dict(os.environ, GIT_TERMINAL_PROMPT='0', GIT_OPTIONAL_LOCKS='0',
               GIT_ALLOW_PROTOCOL='https:ssh:file', GIT_SSH_COMMAND='ssh -oBatchMode=yes -oStrictHostKeyChecking=yes -oUpdateHostKeys=no -oControlMaster=no -oControlPath=none')
    process = subprocess.Popen(['git','--no-optional-locks','-C',str(root),*args],
                               env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
    try:
        out, err = process.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid,signal.SIGKILL)
        process.communicate()
        raise TimeoutError('Git query timed out; no state updated')
    return process.returncode, out.decode('utf-8',errors='replace')


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--kit',type=Path,default=Path(__file__).resolve().parent.parent)
    p.add_argument('--active-revision',required=True,help='full SHA chosen for this task, never auto-updated')
    p.add_argument('--expected-fingerprint',help='v2 tree fingerprint of adopted vendored files (stored outside the kit)')
    p.add_argument('--remote',default='origin',help='configured remote name, or explicit trusted URL/path')
    p.add_argument('--ref',default='refs/heads/main')
    p.add_argument('--offline',action='store_true')
    p.add_argument('--timeout',type=float,default=5)
    a=p.parse_args()
    if not re.fullmatch(r'[0-9a-f]{40}(?:[0-9a-f]{24})?',a.active_revision):
        raise ValueError('active-revision must be a full lowercase commit SHA')
    if a.expected_fingerprint and not re.fullmatch(r'[0-9a-f]{64}',a.expected_fingerprint):
        raise ValueError('expected-fingerprint must be a full v2 SHA-256')
    if not 0 < a.timeout <= 60:
        raise ValueError('timeout must be in (0,60] seconds')
    if not re.fullmatch(r'refs/(?:heads|tags)/[A-Za-z0-9_./-]+',a.ref) or '..' in a.ref:
        raise ValueError('ref must be one literal heads/tags ref')
    safe_name(str(a.kit));safe_name(a.remote)
    root=a.kit.expanduser().resolve(strict=True)
    if not root.is_dir() or not (root/'GOVERNANCE.md').is_file():
        raise ValueError('kit must contain GOVERNANCE.md')
    def git(*args):return run_git(root,list(args),a.timeout)
    rc, top=git('rev-parse','--show-toplevel')
    standalone=rc==0 and Path(top.strip()).resolve()==root
    local_revision=None;status=None;issues=[]
    if standalone:
        rc, local_revision=git('rev-parse','HEAD')
        if rc:raise ValueError('standalone kit has no valid HEAD')
        local_revision=local_revision.strip()
        rc,status=git('status','--porcelain','--untracked-files=all')
        if rc:raise ValueError('cannot inspect local dirty state')
        if status:issues.append('LOCAL_CHANGES_PRESERVED')
        if local_revision!=a.active_revision:issues.append('ACTIVE_REVISION_MISMATCH')
    tree_fp=None
    if a.expected_fingerprint:
        tree_fp=fingerprint(inventory(root))
        if tree_fp!=a.expected_fingerprint:issues.append('TREE_DELTA_OR_INCUBATION_PRESERVED')
    elif not standalone:
        issues.append('VENDORED_PROVENANCE_UNVERIFIED')
    info=dict(schema='sds-freshness-v1',observed_at=datetime.now(timezone.utc).isoformat(),
              active_revision=a.active_revision,local_revision=local_revision,standalone=standalone,
              dirty=bool(status) if standalone else None,tree_fingerprint=tree_fp,remote_ref=a.ref,
              issues=issues,remote_revision=None,relation='OFFLINE',updated=False)
    if not a.offline:
        remote=a.remote
        rc,url=git('remote','get-url',remote)
        if rc==0:remote=url.strip()
        parsed=urlsplit(remote)
        if remote.startswith('-') or '::' in remote or parsed.password or (parsed.scheme in ('http','https') and parsed.username):
            raise ValueError('unsafe/credential-bearing remote rejected')
        # Git protocol allowlist is also enforced by GIT_ALLOW_PROTOCOL. Never echo remote/errors.
        try:
            rc,out=git('ls-remote','--exit-code',remote,a.ref,a.ref+'^{}')
            refs={}
            if rc==0:
                for line in out.splitlines():
                    oid,ref=line.split('\t')
                    if not re.fullmatch(r'[0-9a-f]{40}(?:[0-9a-f]{24})?',oid):
                        raise ValueError('malformed remote object id')
                    refs[ref]=oid
            remote_oid=refs.get(a.ref+'^{}') or refs.get(a.ref)
            if rc or not remote_oid:
                info['relation']='REMOTE_UNAVAILABLE'
            else:
                info['remote_revision']=remote_oid
                if remote_oid==a.active_revision:
                    info['relation']='CURRENT'
                elif standalone and git('cat-file','-e',remote_oid+'^{commit}')[0]==0 and git('cat-file','-e',a.active_revision+'^{commit}')[0]==0:
                    if git('merge-base','--is-ancestor',a.active_revision,remote_oid)[0]==0:
                        info['relation']='REMOTE_AHEAD'
                    elif git('merge-base','--is-ancestor',remote_oid,a.active_revision)[0]==0:
                        info['relation']='LOCAL_AHEAD_OR_INCUBATION'
                    else:info['relation']='DIVERGED'
                else:info['relation']='REMOTE_DIFFERENT_ANCESTRY_UNKNOWN'
        except TimeoutError:
            info['relation']='REMOTE_TIMEOUT'
    if standalone:
        if git('rev-parse','HEAD')[1].strip()!=local_revision or git('status','--porcelain','--untracked-files=all')[1]!=status:
            issues.append('LOCAL_STATE_CHANGED_DURING_CHECK')
    if tree_fp and fingerprint(inventory(root))!=tree_fp:
        issues.append('TREE_CHANGED_DURING_CHECK')
    info['verified_current']=info['relation']=='CURRENT' and not issues
    print(json.dumps(info,indent=2))
    return 0 if info['verified_current'] else 1


if __name__=='__main__':
    try:sys.exit(main())
    except (OSError,ValueError,TimeoutError) as error:
        print('governance-freshness: '+str(error),file=sys.stderr)
        sys.exit(2)
