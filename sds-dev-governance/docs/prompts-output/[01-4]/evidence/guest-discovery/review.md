# Revisión independiente — discovery

Revisor /root/review_vm, solo lectura. UID501 con grupoadmin no es UID0, pero no acredita
sujeto sin privilegios ni capacidad de elevación. Mount table sin shares no demuestra
custodia; autofs/montaje temporal requieren identificación si afectan el perímetro.
IPv6 utun/defaults no prueban egress ni aislamiento. command-v no fija versiones/configuración.
S0 sigue NO_VERIFICADO. Preparación de sondas sintéticas sin sudo/instalación es viable;
requiere perfil/objetos/canales exactos y revisión antes de efectos.
