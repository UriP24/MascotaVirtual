---
name: balance-check
description: "Revisa el balance de la economía (monedas, puntos, canjes) contra los valores de config.js y busca estrategias rotas."
argument-hint: "[tareas|estudio|canjes|minijuego|todo]"
user-invocable: true
allowed-tools: Read, Glob, Grep
---

# Balance Check

1. **Datos.** Leé `src/config.js` y `CLAUDE.md`. Si falta un dato que el análisis necesita
   (por ejemplo, cuántas monedas da el minijuego todavía no está definido), esa parte va como
   `NO EVALUADO — FALTA DATO` y decís qué falta. No inventes números.
2. **Fuentes y sumideros.** Tabla con cada forma de ganar y gastar monedas y puntos.
3. **Proyección.** Con un uso "normal" (definilo y mostralo) calculá puntos por semana y días
   para llegar a cada plan de `PLANES`. Considerá el límite de canjes por mes.
4. **Estrategias degeneradas.** Loops sin sumidero, conversiones que convienen siempre,
   opciones que nunca conviene usar.
5. **Salida:**

```
## Balance: [área]
### Estado: SANO / CON DUDAS / PROBLEMA SERIO / NO EVALUADO
### Fuentes y sumideros (tabla)
### Proyección (tabla: plan, puntos, días estimados)
### Estrategias rotas
### Recomendaciones (prioridad, problema, valor nuevo para config.js)
```

No modifiques archivos: proponé y esperá el OK.
