# 09 — Estructura de docs/

## Problema que resuelve

Sin estructura predecible, la documentacion se dispersa, se duplica o se pierde. Cada agente y cada humano busca en sitios diferentes.

## Estructura base

```
docs/
├── check-governance.sh             ← validador automatico de gobernanza
├── <project-name>-policies/        ← politicas publicas base del proyecto
│   ├── <project-name>-cookies-policy.md
│   ├── <project-name>-privacy-policy.md
│   └── <project-name>-terms-of-service.md
├── prompts/                       ← instrucciones a agentes
├── prompts-output/                ← resultados trazables
│   └── README.md                  ← puede contener [NN-R]tmp/ y [NN-R]evidence/ por prompt
├── prompts-output-template/       ← plantilla de output
│   └── output-template.md
├── governance/                    ← cambios de gobernanza del proyecto
│   └── README.md
├── memory/                        ← memorias tematicas compactas
│   ├── README.md
│   ├── <area>.md                  ← memoria plana o stub deprecado tras migrar
│   ├── index-<area>.md            ← entrypoint unico cuando el area usa arbol
│   ├── <area>-N.md                ← shards de ambito cerrado bajo demanda
│   ├── api-openapi.md
│   └── deployment.md
├── features/                      ← tracking de funcionalidades
│   └── features-index.md
├── contracts/                     ← contratos API y schemas compartidos
│   └── README.md
├── runbooks/                      ← procedimientos por entorno
│   └── README.md
├── architecture/                  ← arquitectura transversal
│   └── README.md
├── decisions/                     ← decisiones tecnicas (ADR)
│   ├── README.md
│   └── DEC-000-template.md
├── operations/                    ← notas operativas generales
│   └── README.md
├── security/                      ← revisiones de seguridad
│   └── README.md
└── repositories/                  ← mapa de repos (si multi-repo)
    └── README.md
```

## Carpetas opcionales (segun dominio)

- `docs/ui-ux/` — si hay specs de UI/UX por plataforma.
- `docs/azure/` o `docs/infra/` — si hay infraestructura cloud documentada.

Las memorias tecnicas estandar no se crean como carpetas opcionales por dominio; viven en
`docs/memory/*.md`. Una memoria plana sigue siendo valida mientras no exista su
`index-<area>.md`; tras migrar, el indice es el unico entrypoint y `<area>.md` solo puede quedar como
stub deprecado.

## Recursos opcionales del kit SDS

`sds-dev-governance/resources/` puede contener material de referencia portable que no pertenece a
la carga normal de contexto. Ejemplo actual:

- `sds-dev-governance/resources/frontend-patterns/` — componentes, animaciones y paletas UI
  exportables.

Regla de carga: estos recursos se leen solo si el usuario o el prompt activo los pide
explicitamente. No son practicas, skills, adapters ni memoria tematica.

## Reglas

1. `docs/` es contenido del hub; todo lo demas es submodulo o ignorado.
2. Cada proyecto debe tener `docs/<project-name>-policies/` con, al menos, estas politicas base:
   `<project-name>-cookies-policy.md`, `<project-name>-privacy-policy.md` y
   `<project-name>-terms-of-service.md`. Pueden nacer vacias en el bootstrap y completarse antes
   de publicacion.
3. Cada subcarpeta tiene un README.md minimo que explica su proposito, salvo carpetas de politicas
   publicas cuyo proposito queda definido por los nombres canonicos de fichero.
4. No duplicar informacion entre carpetas — referenciar.
5. No guardar secretos en docs/.
6. Los contratos API van en `docs/contracts/`, no mezclados con memorias tematicas.
7. Las decisiones tecnicas usan la plantilla ADR en `docs/decisions/DEC-000-template.md`.
8. Los cambios de gobernanza se registran en `docs/governance/README.md` y se sincronizan con las carpetas afectadas.
9. Las memorias tematicas viven en `docs/memory/` y no duplican reglas de `CLAUDE.md`.
10. Los checkpoints temporales de prompts viven bajo `docs/prompts-output/<PROMPT_ID>/tmp/`; la
    evidencia pesada vive bajo `docs/prompts-output/<PROMPT_ID>/evidence/`; nunca bajo `docs/prompts/`.
