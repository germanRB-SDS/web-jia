# Reproducción acotada

Ejecutada el 2026-09-10 con Python 3.14.6 y código MCP coincidente con el manifiesto
de v1.27.0. Estos son diagnósticos del código existente, no nuevos tests del producto.
El bloque reproduce las causas de los hallazgos; `observations.json` conserva además
el conteo de bytes y la observación de persistencia obtenidos en la ejecución original.

Desde la raíz del kit canónico, ejecutar sólo si se desea repetir el diagnóstico:

```sh
python3 -B - <<'PY'
from pathlib import Path
import contextlib, io, json, sys, tempfile
from unittest.mock import patch
sys.path.insert(0, str(Path('mcp').resolve()))
import cli, inventory
from configure import expected

with tempfile.TemporaryDirectory(prefix='sds-mcp-repro-') as d:
    root = Path(d).resolve()
    home, project = root / 'home', root / 'project'
    home.mkdir(); project.mkdir()
    state = home / 'state'
    config = home / '.codex/config.toml'
    config.parent.mkdir()
    def put(entry):
        config.write_text('[mcp_servers.hostinger-vps]\n' + ''.join(
            k + '=' + json.dumps(v) + '\n' for k, v in entry.items()))
    def run(*args):
        out = io.StringIO()
        argv = ['sds-mcp', *args, '--home', str(home), '--project', str(project),
                '--state', str(state)]
        with patch.object(sys, 'argv', argv), contextlib.redirect_stdout(out):
            code = cli.main()
        print(code, out.getvalue().strip())
    with patch('subprocess.Popen', side_effect=AssertionError('no subprocess')), \
         patch('socket.socket', side_effect=AssertionError('no network')):
        put(expected('hostinger-vps', 'codex'))
        run('check', '--server', 'hostinger-vps', '--client', 'codex')
        run('doctor', '--client', 'codex')
        ledger = project / 'docs/governance/capability-registry.md'
        ledger.parent.mkdir(parents=True)
        ledger.write_text('<!-- SDS_CAPABILITY_LEDGER_START -->\n'
                          '<!-- SDS_CAPABILITY_LEDGER_END -->\n')
        a = {'command': 'synthetic', 'args': ['relative.js'], 'cwd': '/synthetic/a'}
        b = {**a, 'cwd': '/synthetic/b'}
        print('equal fingerprint:', inventory.public_revision(a)[0] ==
              inventory.public_revision(b)[0])
        put(a); inventory.observe(home, project, state)
        put(b)
        print('revision_changed:', inventory.observe(home, project, state)
              ['entries'][0]['revision_changed'])
        put(expected('hostinger-vps', 'codex'))
        local = project / '.codex/config.toml'
        local.parent.mkdir(); local.write_text(config.read_text())
        print('inventory statuses:', sorted(set(r['status'] for r in
              inventory.observe(home, project, state)['entries'])))
        run('check', '--server', 'hostinger-vps', '--client', 'codex')
        with patch('inventory.atomic', wraps=inventory.atomic) as write:
            run('check', '--server', 'hostinger-vps', '--client', 'codex')
            print('inventory writes:', write.call_count)
PY
```

Esperado en la revisión analizada: `LEDGER_MISSING` en check y motivo fijo de aislamiento
en doctor; huellas iguales y `revision_changed: False` al cambiar sólo cwd;
`BLOCKED_CONFIG_AMBIGUITY` en inventario pero `NOT_EVALUATED` en check;
una escritura atómica de inventario por check. Todo check mantiene `allowed: false` y exit 3.

Los parches de subprocess/socket son comprobaciones locales, no una demostración de aislamiento
del sistema operativo. No se abre ninguna credencial, config personal ni conexión al proveedor.
