#!/usr/bin/env python3
"""Add only the requested optional resource pack; never upgrade a project's governing kit.
Explicit JSON manifest: [{"path": "<existing-kit>", "project": "<label>"}]. Dry-run by default.
Reject links, pre-existing differing resource files and concurrent index changes before writing.
"""
import argparse,hashlib,json,os
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--manifest',type=Path,required=True);p.add_argument('--revision',required=True);p.add_argument('--report',type=Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
slugs=('collaborators-carousel','film-reel','cube-carousel')
paths=[f'resources/web-components/{slug}' for slug in slugs]
paths+=['knowledge/web-jia/portable-interactive-components.md']
hashof=lambda b:hashlib.sha256(b).hexdigest()
source={}
for rel in paths:
 entry=a.source/rel
 for f in ([entry] if entry.is_file() else sorted(entry.rglob('*'))):
  if f.is_symlink():raise SystemExit(f'Source link rejected: {f}')
  if f.is_file():
   if any(x in f.parts for x in ('node_modules','.next','out','.git')):raise SystemExit('Generated content rejected')
   source[str(f.relative_to(a.source))]=f.read_bytes()
index_source=(a.source/'resources/index-of-resources-and-working-patters.md').read_text()
rows=[line for line in index_source.splitlines() if any(line.startswith('| '+slug+' |') for slug in slugs)]
assert len(rows)==3
plans=[]
for item in json.loads(a.manifest.read_text()):
 root=Path(item['path']);assert root.is_dir() and (root/'GOVERNANCE.md').is_file(),root
 edits=[]
 def plan(rel,content,append=False):
  dest=root/rel
  if dest.is_symlink() or any(parent.is_symlink() for parent in dest.parents):raise SystemExit(f'Target link rejected: {dest}')
  old=dest.read_bytes() if dest.exists() else None
  if old==content:return
  if old is not None and not append:raise SystemExit(f'Preserve differing resource: {dest}')
  if old is not None and append and not content.startswith(old):raise SystemExit(f'Append-only boundary: {dest}')
  edits.append((rel,old,content))
 for rel,data in source.items():plan(rel,data)
 rel='resources/index-of-resources-and-working-patters.md';f=root/rel
 if not f.exists():raise SystemExit(f'Missing project resource index; inspect existing corpus first: {root}')
 old=f.read_text();missing=[row for row in rows if ('| '+row.split('|')[1].strip()+' |') not in old]
 if missing:plan(rel,(old+'\n## Portable interactive components (resource pack v1.31.0)\n\n| Resource | Path | What it is | How-to |\n|---|---|---|---|\n'+'\n'.join(missing)+'\n').encode(),True)
 for rel,title,link in [('knowledge/README.md','# Knowledge','- [Componentes interactivos portables](web-jia/portable-interactive-components.md).'),('knowledge/web-jia/README.md','# web-jia','- [Componentes interactivos portables](portable-interactive-components.md).')]:
  f=root/rel;old=f.read_text() if f.exists() else title+'\n'
  if 'portable-interactive-components.md' not in old:plan(rel,(old+'\n'+link+'\n').encode(),True)
 receipt={'resource_pack':'v1.31.0','canonical_revision':a.revision,'kind':'ADDITIVE_RESOURCE_OVERLAY','governing_VERSION_unchanged':True,'files':{rel:hashof(b) for rel,b in source.items()},'preservation':'No rules, adapters, runtime, branches, remotes or pre-existing resources changed.'}
 plan('resources/web-components/web-jia-resource-pack.json',(json.dumps(receipt,indent=2)+'\n').encode())
 plans.append((root,item['project'],edits))
# All conflicts are checked across all targets before the first write.
report=[]
for root,project,edits in plans:
 if a.apply:
  for rel,old,new in edits:
   dest=root/rel;current=dest.read_bytes() if dest.exists() else None
   if current!=old:raise SystemExit(f'Concurrent change preserved; stop: {dest}')
   dest.parent.mkdir(parents=True,exist_ok=True)
   if old is None:
    with dest.open('xb') as out:out.write(new)
   else:
    # Only append to existing indexes: no replacement of their previous bytes.
    assert new.startswith(old)
    with dest.open('ab') as out:out.write(new[len(old):])
  assert all((root/rel).read_bytes()==data for rel,data in source.items())
 report.append({'project':project,'status':'APPLIED' if a.apply else 'PLANNED','changed_files':len(edits),'preserved_existing_bytes':True})
a.report.parent.mkdir(parents=True,exist_ok=True);a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
