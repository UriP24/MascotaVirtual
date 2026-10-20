---
name: playtest-report
description: "Plantilla y análisis de una prueba de la app en el celular (antes de la entrega)."
argument-hint: "[nuevo|analizar ruta-a-notas]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write
---

# Playtest Report

- `nuevo`: creá `docs/playtests/[fecha].md` con la plantilla de abajo, vacía.
- `analizar [ruta]`: leé las notas sueltas del usuario y completá la plantilla, ordenando los
  problemas por severidad y proponiendo un arreglo por cada uno.

```
# Prueba — [fecha]
- Versión (commit):
- Celular / navegador:
- ¿Primera vez o ya la usó?:

## Primeros 5 minutos
- ¿Entendió qué hacer? Sí / No / Más o menos
- ¿Qué sintió?:

## Lo que anduvo bien
## Lo que molestó (Alta / Media / Baja)
## Dónde se confundió
## Momentos lindos
## Bugs (pasos para reproducir)
## Por pantalla: Casa / Tareas / Canjes / Jugar
## Arreglos para hoy (máximo 5, por prioridad)
```

Ojo: si la prueba es con ella antes del cumple, se arruina la sorpresa. Probá vos o alguien
de confianza haciendo de ella.
