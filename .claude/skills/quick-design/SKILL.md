---
name: quick-design
description: "Especificación de diseño de una página para una mecánica chica (la perrita, el minijuego, un ajuste). Reemplaza al GDD completo."
argument-hint: "[nombre de la mecánica]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write
---

# Quick Design

1. **Clasificá** el cambio y confirmalo con el usuario:
   - *Ajuste*: solo cambian números de `config.js`.
   - *Retoque*: cambio chico de comportamiento.
   - *Sistema chico nuevo*: mecánica nueva e independiente.
2. **Contexto.** Leé `CLAUDE.md`, `PLAN.md`, `src/config.js` y specs previas en `docs/specs/`.
3. **Borrador** (mostralo en el chat antes de escribirlo):

```
# Spec: [Título]
## Resumen (2-3 líneas)
## Reglas (lista numerada, sin ambigüedad)
## Valores ajustables (van a config.js: nombre, valor inicial, rango razonable)
## Estados y transiciones (si aplica)
## Casos borde (app cerrada días, cambio de mes, sin monedas, etc.)
## Criterios de aceptación
- [ ] funcional: hace lo correcto
- [ ] caso borde: …
- [ ] sensación: se siente bien (lo valida una prueba en el celular)
- [ ] no rompe: …
```

4. Con el OK, guardalo en `docs/specs/[nombre].md`. Las reglas fijas del juego de `CLAUDE.md`
   nunca se contradicen.
