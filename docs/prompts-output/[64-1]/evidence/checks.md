# Comprobaciones de cierre

- npm ci aislado PASS (ignore-scripts); TypeScript PASS; contenido PASS (6 talleres/56 personas/2 experiencias/96 medios).
- next build --webpack PASS; npm run build (Turbopack, interfaz documentada) PASS.
- verify-package.py:1847 comprobaciones PASS;380 fuentes y14 capturas exactas, imports y links válidos.
- check-governance.sh: PASS. AI assurance: PASS.
- git diff --check del delta redactado: PASS. El snapshot conserva3 saltos Markdown con doble espacio
  en assets/style/JIA_IDENTIDAD_VISUAL.md y1 línea final vacía en lib/content/data/people.ts;
  son bytes preexistentes, no se reformatean para no falsear la huella del origen.
- Inventario de copias: SPLIT_VERSION v1.25 preexistente; no se declara upgrade seguro de kits.
  Solo overlay aditivo; ver distribution-scope.md.
