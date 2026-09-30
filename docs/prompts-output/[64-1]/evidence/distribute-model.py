import argparse,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--manifest',type=Path,required=True);p.add_argument('--revision',required=True);p.add_argument('--report',type=Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
hashof=lambda b:hashlib.sha256(b).hexdigest()
source={}
for rel in ['built-projects/INDEX.md','built-projects/web-jia','knowledge/web-jia/modular-editorial-web-model.md']:
 entry=a.source/rel
 for f in ([entry] if entry.is_file() else sorted(entry.rglob('*'))):
  if f.is_symlink():raise SystemExit('Source symlink: '+str(f))
  if f.is_file():source[str(f.relative_to(a.source))]=f.read_bytes()
append={
 'resources/index-of-resources-and-working-patters.md':('\n## Built projects — modelos completos opcionales\n\n| Modelo | Qué conserva | Entrada |\n|---|---|---|\n| web-jia | Guía editorial modular, skill manual inactiva, skeleton reconstruible, interacciones, 14 capturas y configuración técnica. | [Catálogo de proyectos](../built-projects/INDEX.md) · [Índice visual web-jia](../built-projects/web-jia/INDEX.md) |\n','../built-projects/web-jia/INDEX.md'),
 'knowledge/README.md':('\n- [Modelo editorial modular web-jia](web-jia/modular-editorial-web-model.md): cómo conservar y recomponer una web terminada.\n','web-jia/modular-editorial-web-model.md'),
 'knowledge/web-jia/README.md':('\n- [Modelo editorial modular](modular-editorial-web-model.md): guía, skeleton, skill manual y galería de 14 capturas.\n','modular-editorial-web-model.md')}
plans=[]
for item in json.loads(a.manifest.read_text()):
 root=Path(item['path']);assert (root/'GOVERNANCE.md').is_file()
 changes=[]
 def plan(rel,new,append_only=False):
  target=root/rel
  if target.is_symlink() or any(x.is_symlink() for x in target.parents):raise SystemExit('Target symlink: '+str(target))
  old=target.read_bytes() if target.exists() else None
  if old==new:return
  if old is not None and not append_only:raise SystemExit('Preserve differing target: '+str(target))
  if old is not None and not new.startswith(old):raise SystemExit('Not append-only: '+str(target))
  changes.append((rel,old,new))
 for rel,data in source.items():plan(rel,data)
 for rel,(addition,marker) in append.items():
  target=root/rel;old=target.read_text() if target.exists() else ''
  if marker not in old:plan(rel,(old+addition).encode(),True)
 receipt={'catalog_pack':'web-jia-v1.32.0','canonical_revision':a.revision,'kind':'ADDITIVE_REFERENCE_OVERLAY','governing_rules_and_VERSION_preserved':True,'files':{r:hashof(v) for r,v in source.items()}}
 plan('built-projects/web-jia-pack.json',(json.dumps(receipt,indent=2)+'\n').encode())
 plans.append((root,item['project'],changes))
report=[]
for root,project,changes in plans:
 if a.apply:
  for rel,old,new in changes:
   target=root/rel
   if (target.read_bytes() if target.exists() else None)!=old:raise SystemExit('Concurrent change preserved: '+str(target))
   target.parent.mkdir(parents=True,exist_ok=True)
   with target.open('xb' if old is None else 'ab') as out:out.write(new if old is None else new[len(old):])
  assert all((root/r).read_bytes()==data for r,data in source.items())
 report.append({'project':project,'changed_files':len(changes),'status':'APPLIED' if a.apply else 'PLANNED','preserved_existing_bytes':True})
a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
