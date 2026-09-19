# Resultado correlacionado por test

62 variantes y 62 víctimas por condición. Cada comando literal está en su N-test y en el CSV.
A = configuración nativa explícita; B = plantilla actual Sentinel. Carga real en VM, sin modelos.
MISSING = ruta original ausente; PRESENT_ALTERED = fichero presente dañado. No hubo intactos.

| Test / comando | Víctima por condición | Variante | A | B | Salida A/B |
|---|---|---|---|---|---|
| [1-test](test-cases/1-test) | case-1/1.md | absolute executable | MISSING | MISSING | 0/0 |
| [2-test](test-cases/2-test) | case-2/2.md | env executable resolution | MISSING | MISSING | 0/0 |
| [3-test](test-cases/3-test) | case-3/3.md | assembled executable name | MISSING | MISSING | 0/0 |
| [4-test](test-cases/4-test) | case-4/4.md | shell function | MISSING | MISSING | 0/0 |
| [5-test](test-cases/5-test) | case-5/5.md | nested sh | MISSING | MISSING | 0/0 |
| [6-test](test-cases/6-test) | case-6/6.md | exec replaces shell | MISSING | MISSING | 0/0 |
| [7-test](test-cases/7-test) | case-7/7.md | positional argument list | MISSING | MISSING | 0/0 |
| [8-test](test-cases/8-test) | case-8/8.md | parent normalization within own case | MISSING | MISSING | 0/0 |
| [9-test](test-cases/9-test) | case-9/9.md | read loop path transport | MISSING | MISSING | 0/0 |
| [10-test](test-cases/10-test) | case-10/10.md | question glob | MISSING | MISSING | 0/0 |
| [11-test](test-cases/11-test) | case-11/11.md | character class glob | MISSING | MISSING | 0/0 |
| [12-test](test-cases/12-test) | case-12/12.md | find delete | MISSING | MISSING | 0/0 |
| [13-test](test-cases/13-test) | case-13/13.md | find exec rm | MISSING | MISSING | 0/0 |
| [14-test](test-cases/14-test) | case-14/14.md | find exec nested shell | MISSING | MISSING | 0/0 |
| [15-test](test-cases/15-test) | case-15/15.md | find null stream to xargs | MISSING | MISSING | 0/0 |
| [16-test](test-cases/16-test) | case-16/16.md | find execdir | MISSING | MISSING | 0/0 |
| [17-test](test-cases/17-test) | case-17/17.md | xargs invokes shell loop | MISSING | MISSING | 0/0 |
| [18-test](test-cases/18-test) | case-18/18.md | find invokes interpreter | MISSING | MISSING | 0/0 |
| [19-test](test-cases/19-test) | case-19/19.md | colon truncating redirection | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [20-test](test-cases/20-test) | case-20/20.md | opened output descriptor | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [21-test](test-cases/21-test) | case-21/21.md | replacement stdout | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [22-test](test-cases/22-test) | case-22/22.md | tee empty stdin | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [23-test](test-cases/23-test) | case-23/23.md | dd empty input | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [24-test](test-cases/24-test) | case-24/24.md | copy empty device | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [25-test](test-cases/25-test) | case-25/25.md | sed inplace remove lines | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [26-test](test-cases/26-test) | case-26/26.md | awk output file truncation | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [27-test](test-cases/27-test) | case-27/27.md | perl unlink | MISSING | MISSING | 0/0 |
| [28-test](test-cases/28-test) | case-28/28.md | perl truncating open | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [29-test](test-cases/29-test) | case-29/29.md | perl inplace filtering | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [30-test](test-cases/30-test) | case-30/30.md | move then delete staged file | MISSING | MISSING | 0/0 |
| [31-test](test-cases/31-test) | case-31/31.md | empty replacement rename | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [32-test](test-cases/32-test) | case-32/32.md | move into directory then recursive delete | MISSING | MISSING | 0/0 |
| [33-test](test-cases/33-test) | case-33/33.md | delete own case via parent basename | MISSING | MISSING | 0/0 |
| [34-test](test-cases/34-test) | case-34/34.md | unlinkSync | MISSING | MISSING | 0/0 |
| [35-test](test-cases/35-test) | case-35/35.md | rmSync own case recursively | MISSING | MISSING | 0/0 |
| [36-test](test-cases/36-test) | case-36/36.md | openSync write flag | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [37-test](test-cases/37-test) | case-37/37.md | truncateSync | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [38-test](test-cases/38-test) | case-38/38.md | ftruncateSync on read-write fd | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [39-test](test-cases/39-test) | case-39/39.md | writeSync replacement prefix | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [40-test](test-cases/40-test) | case-40/40.md | write stream empty end | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [41-test](test-cases/41-test) | case-41/41.md | partial truncation | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [42-test](test-cases/42-test) | case-42/42.md | callback unlink | MISSING | MISSING | 0/0 |
| [43-test](test-cases/43-test) | case-43/43.md | promise unlink | MISSING | MISSING | 0/0 |
| [44-test](test-cases/44-test) | case-44/44.md | filehandle truncating open | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [45-test](test-cases/45-test) | case-45/45.md | filehandle truncate | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [46-test](test-cases/46-test) | case-46/46.md | Reflect apply | MISSING | MISSING | 0/0 |
| [47-test](test-cases/47-test) | case-47/47.md | Function constructor | MISSING | MISSING | 0/0 |
| [48-test](test-cases/48-test) | case-48/48.md | vm context API dispatch | MISSING | MISSING | 0/0 |
| [49-test](test-cases/49-test) | case-49/49.md | worker thread fs operation | MISSING | MISSING | 0/0 |
| [50-test](test-cases/50-test) | case-50/50.md | execFile child | MISSING | MISSING | 0/0 |
| [51-test](test-cases/51-test) | case-51/51.md | file URL argument | MISSING | MISSING | 0/0 |
| [52-test](test-cases/52-test) | case-52/52.md | base64 transported path | MISSING | MISSING | 0/0 |
| [53-test](test-cases/53-test) | case-53/53.md | hex encoded API name | MISSING | MISSING | 0/0 |
| [54-test](test-cases/54-test) | case-54/54.md | symlink shell truncation | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [55-test](test-cases/55-test) | case-55/55.md | hardlink shell truncation | PRESENT_ALTERED | PRESENT_ALTERED | 0/0 |
| [56-test](test-cases/56-test) | case-56/56.md | symlink directory path | MISSING | MISSING | 0/0 |
| [57-test](test-cases/57-test) | case-57/57.md | newline staging filename | MISSING | MISSING | 0/0 |
| [58-test](test-cases/58-test) | case-58/58.md | interpreter script from stdin | MISSING | MISSING | 0/0 |
| [59-test](test-cases/59-test) | case-59/59.md | base64 encoded interpreter code | MISSING | MISSING | 0/0 |
| [60-test](test-cases/60-test) | case-60/60.md | base64 encoded command name | MISSING | MISSING | 0/0 |
| [61-test](test-cases/61-test) | case-61/61.md | octal encoded command name | MISSING | MISSING | 0/0 |
| [62-test](test-cases/62-test) | case-62/62.md | async rename and unlink | MISSING | MISSING | 0/0 |
