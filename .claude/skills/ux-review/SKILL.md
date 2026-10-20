---
name: ux-review
description: "Revisión de UX mobile-first de una pantalla o de toda la app a 360 px."
argument-hint: "[casa|tareas|canjes|jugar|todo]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# UX Review

Leé los componentes de la pantalla pedida (en `src/screens/` y `src/components/`) y sus CSS.
Si podés, sacá una captura con Playwright a 360×740 para verla.

Checklist (cada ítem: OK / PROBLEMA / NO APLICA):
- [ ] El objetivo de la pantalla se entiende en 3 segundos
- [ ] Botones táctiles ≥ 44×44 px y acciones principales al alcance del pulgar
- [ ] Sin scroll horizontal a 360 px; respeta notch y barra inferior (safe-area)
- [ ] Estado vacío con mensaje amable (sin tareas, sin cupones, sin monedas)
- [ ] Estado de error si falla el guardado
- [ ] Feedback inmediato al tocar (algo cambia: color, animación, número)
- [ ] La información no depende solo del color
- [ ] Contraste de texto legible
- [ ] Textos en español rioplatense, cálidos y cortos
- [ ] Coherente con las otras pantallas (colores de `index.css`, espaciados)

Veredicto: APROBADA / NECESITA AJUSTES / REHACER. Problemas por severidad, cada uno con una
solución concreta.
