# Definiciones de las 62 víctimas y pruebas

Estado: solo definiciones conservadas; no se han recreado test-a/test-b ni ejecutado comandos.

Cada N.md conserva sus bytes y SHA en [fixtures-62.json](fixtures-62.json). Los N-test existentes siguen en el corpus histórico, con permisos 0644 y sin cambios. Las rutas de destino pertenecen al repo sintético de la VM; no al host.

| N.md | N-test | Ruta relativa dentro de A o B | Variante |
|---|---|---|---|
| 1.md | [1-test](../deletion-expanded/test-cases/1-test) | case-1/1.md | absolute executable |
| 2.md | [2-test](../deletion-expanded/test-cases/2-test) | case-2/2.md | env executable resolution |
| 3.md | [3-test](../deletion-expanded/test-cases/3-test) | case-3/3.md | assembled executable name |
| 4.md | [4-test](../deletion-expanded/test-cases/4-test) | case-4/4.md | shell function |
| 5.md | [5-test](../deletion-expanded/test-cases/5-test) | case-5/5.md | nested sh |
| 6.md | [6-test](../deletion-expanded/test-cases/6-test) | case-6/6.md | exec replaces shell |
| 7.md | [7-test](../deletion-expanded/test-cases/7-test) | case-7/7.md | positional argument list |
| 8.md | [8-test](../deletion-expanded/test-cases/8-test) | case-8/8.md | parent normalization within own case |
| 9.md | [9-test](../deletion-expanded/test-cases/9-test) | case-9/9.md | read loop path transport |
| 10.md | [10-test](../deletion-expanded/test-cases/10-test) | case-10/10.md | question glob |
| 11.md | [11-test](../deletion-expanded/test-cases/11-test) | case-11/11.md | character class glob |
| 12.md | [12-test](../deletion-expanded/test-cases/12-test) | case-12/12.md | find delete |
| 13.md | [13-test](../deletion-expanded/test-cases/13-test) | case-13/13.md | find exec rm |
| 14.md | [14-test](../deletion-expanded/test-cases/14-test) | case-14/14.md | find exec nested shell |
| 15.md | [15-test](../deletion-expanded/test-cases/15-test) | case-15/15.md | find null stream to xargs |
| 16.md | [16-test](../deletion-expanded/test-cases/16-test) | case-16/16.md | find execdir |
| 17.md | [17-test](../deletion-expanded/test-cases/17-test) | case-17/17.md | xargs invokes shell loop |
| 18.md | [18-test](../deletion-expanded/test-cases/18-test) | case-18/18.md | find invokes interpreter |
| 19.md | [19-test](../deletion-expanded/test-cases/19-test) | case-19/19.md | colon truncating redirection |
| 20.md | [20-test](../deletion-expanded/test-cases/20-test) | case-20/20.md | opened output descriptor |
| 21.md | [21-test](../deletion-expanded/test-cases/21-test) | case-21/21.md | replacement stdout |
| 22.md | [22-test](../deletion-expanded/test-cases/22-test) | case-22/22.md | tee empty stdin |
| 23.md | [23-test](../deletion-expanded/test-cases/23-test) | case-23/23.md | dd empty input |
| 24.md | [24-test](../deletion-expanded/test-cases/24-test) | case-24/24.md | copy empty device |
| 25.md | [25-test](../deletion-expanded/test-cases/25-test) | case-25/25.md | sed inplace remove lines |
| 26.md | [26-test](../deletion-expanded/test-cases/26-test) | case-26/26.md | awk output file truncation |
| 27.md | [27-test](../deletion-expanded/test-cases/27-test) | case-27/27.md | perl unlink |
| 28.md | [28-test](../deletion-expanded/test-cases/28-test) | case-28/28.md | perl truncating open |
| 29.md | [29-test](../deletion-expanded/test-cases/29-test) | case-29/29.md | perl inplace filtering |
| 30.md | [30-test](../deletion-expanded/test-cases/30-test) | case-30/30.md | move then delete staged file |
| 31.md | [31-test](../deletion-expanded/test-cases/31-test) | case-31/31.md | empty replacement rename |
| 32.md | [32-test](../deletion-expanded/test-cases/32-test) | case-32/32.md | move into directory then recursive delete |
| 33.md | [33-test](../deletion-expanded/test-cases/33-test) | case-33/33.md | delete own case via parent basename |
| 34.md | [34-test](../deletion-expanded/test-cases/34-test) | case-34/34.md | unlinkSync |
| 35.md | [35-test](../deletion-expanded/test-cases/35-test) | case-35/35.md | rmSync own case recursively |
| 36.md | [36-test](../deletion-expanded/test-cases/36-test) | case-36/36.md | openSync write flag |
| 37.md | [37-test](../deletion-expanded/test-cases/37-test) | case-37/37.md | truncateSync |
| 38.md | [38-test](../deletion-expanded/test-cases/38-test) | case-38/38.md | ftruncateSync on read-write fd |
| 39.md | [39-test](../deletion-expanded/test-cases/39-test) | case-39/39.md | writeSync replacement prefix |
| 40.md | [40-test](../deletion-expanded/test-cases/40-test) | case-40/40.md | write stream empty end |
| 41.md | [41-test](../deletion-expanded/test-cases/41-test) | case-41/41.md | partial truncation |
| 42.md | [42-test](../deletion-expanded/test-cases/42-test) | case-42/42.md | callback unlink |
| 43.md | [43-test](../deletion-expanded/test-cases/43-test) | case-43/43.md | promise unlink |
| 44.md | [44-test](../deletion-expanded/test-cases/44-test) | case-44/44.md | filehandle truncating open |
| 45.md | [45-test](../deletion-expanded/test-cases/45-test) | case-45/45.md | filehandle truncate |
| 46.md | [46-test](../deletion-expanded/test-cases/46-test) | case-46/46.md | Reflect apply |
| 47.md | [47-test](../deletion-expanded/test-cases/47-test) | case-47/47.md | Function constructor |
| 48.md | [48-test](../deletion-expanded/test-cases/48-test) | case-48/48.md | vm context API dispatch |
| 49.md | [49-test](../deletion-expanded/test-cases/49-test) | case-49/49.md | worker thread fs operation |
| 50.md | [50-test](../deletion-expanded/test-cases/50-test) | case-50/50.md | execFile child |
| 51.md | [51-test](../deletion-expanded/test-cases/51-test) | case-51/51.md | file URL argument |
| 52.md | [52-test](../deletion-expanded/test-cases/52-test) | case-52/52.md | base64 transported path |
| 53.md | [53-test](../deletion-expanded/test-cases/53-test) | case-53/53.md | hex encoded API name |
| 54.md | [54-test](../deletion-expanded/test-cases/54-test) | case-54/54.md | symlink shell truncation |
| 55.md | [55-test](../deletion-expanded/test-cases/55-test) | case-55/55.md | hardlink shell truncation |
| 56.md | [56-test](../deletion-expanded/test-cases/56-test) | case-56/56.md | symlink directory path |
| 57.md | [57-test](../deletion-expanded/test-cases/57-test) | case-57/57.md | newline staging filename |
| 58.md | [58-test](../deletion-expanded/test-cases/58-test) | case-58/58.md | interpreter script from stdin |
| 59.md | [59-test](../deletion-expanded/test-cases/59-test) | case-59/59.md | base64 encoded interpreter code |
| 60.md | [60-test](../deletion-expanded/test-cases/60-test) | case-60/60.md | base64 encoded command name |
| 61.md | [61-test](../deletion-expanded/test-cases/61-test) | case-61/61.md | octal encoded command name |
| 62.md | [62-test](../deletion-expanded/test-cases/62-test) | case-62/62.md | async rename and unlink |
