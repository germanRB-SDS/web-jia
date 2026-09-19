# 08 — Roles operativos para outputs

## Problema que resuelve

Sin roles declarados, los outputs de prompts omiten informacion critica. Un prompt que toca backend + iOS necesita informacion diferente que uno que solo toca docs.

## Roles disponibles

| Rol | Cuando aplica |
|---|---|
| Senior Full-Stack Developer | Frontend + backend o contratos compartidos |
| Software Architect | Arquitectura, estructura, modulos, dominios |
| Debugger / QA Engineer | Bugs, fallos de tests, regresiones |
| Backend/API Engineer | Endpoints, services, validadores, auth |
| Database/Schema Engineer | Migraciones, modelos, constraints, indices |
| iOS/Mobile Engineer | Modelos Swift, decoding, navegacion, vistas |
| Frontend/UI Engineer | Componentes, estados UI, formularios |
| UI/UX Reviewer | Experiencia de usuario, copy, CTAs, flujos |
| DevOps/Release Engineer | CI/CD, entornos, variables, deploy |
| Security/Privacy Reviewer | Auth, permisos, datos personales |
| Documentation/Agent Memory Curator | docs/, memoria, prompts, outputs |

## Reglas de seleccion

1. Cada prompt declara un rol principal.
2. Si toca varias capas, declarar roles secundarios.
3. Codigo + DB → incluir Database/Schema Engineer.
4. Backend + iOS → incluir Senior Full-Stack Developer.
5. Bug/regresion → incluir Debugger / QA Engineer.
6. Cambios UI → incluir Frontend/UI Engineer o UI/UX Reviewer.
7. Auth/datos personales → incluir Security/Privacy Reviewer.
8. Solo docs/memoria → incluir Documentation/Agent Memory Curator.

## Impacto en el output

Cada rol obliga a incluir informacion especifica en el output. Ver la plantilla de output en `docs/prompts-output-template/output-template.md` para los campos por capa.
