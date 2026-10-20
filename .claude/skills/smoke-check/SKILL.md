---
name: smoke-check
description: "Chequeo rápido de que la app compila, arranca y que los flujos críticos andan antes de publicar o probar en el celular."
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# Smoke Check

Corré y reportá cada punto como OK / FALLA / NO VERIFICADO (nunca asumas OK):

1. `npm run build` termina sin errores y genera `dist/sw.js` y `dist/manifest.webmanifest`.
2. `npx oxlint src` sin errores.
3. `npm run preview` levanta y la página responde.
4. Todo acceso a localStorage está solo en `src/storage.js` (buscalo con grep).
5. Los números de la economía están solo en `src/config.js` (buscá números sueltos en pantallas).
6. Checklist manual para el usuario en el celular (dejásela escrita):
   - [ ] Se instala ("Agregar a pantalla de inicio")
   - [ ] Abre sin internet
   - [ ] Las 4 pestañas funcionan
   - [ ] El progreso sigue ahí al cerrar y volver a abrir
   - [ ] Se ve bien a 360 px, sin scroll horizontal

Veredicto final: LISTO / LISTO CON DETALLES / NO LISTO.
