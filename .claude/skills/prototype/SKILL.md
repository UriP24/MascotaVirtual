---
name: prototype
description: "Prototipo rápido y descartable para validar si una mecánica (ej.: el minijuego) es divertida antes de hacerla bien."
argument-hint: "[mecánica]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Prototype

1. **Pregunta.** Definí en una frase qué se quiere validar ("¿atrapar huesitos con el dedo es
   divertido 60 segundos?").
2. **Plan mínimo.** Una sola mecánica. Sin menús, sin sonido, sin pulido.
3. **Implementá** en `src/prototypes/[nombre]/`. El código de producción no importa nada de
   ahí, y el prototipo solo puede leer `config.js`.
4. **Probá** en el celular y anotá: ¿se entiende?, ¿es divertido?, ¿anda fluido?
5. **Decisión:** SEGUIR (se reescribe limpio en `src/`), AJUSTAR (máximo 2 vueltas más) o
   DESCARTAR.

Límite duro: 1 sesión (≈3 h). Si se pasa, se simplifica la pregunta. Recordá que el minijuego
es lo primero que se recorta si falta tiempo.
