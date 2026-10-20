# Plan — Bolti 🐾

Entrega: **miércoles 28 de octubre**. ~3 horas por día.
Si un día no llego, se recorta primero el minijuego; el resto del plan se corre un día.

## Mar 20 — Base ✅
- [x] Crear proyecto Vite + React e inicializar git
- [x] Configurar vite-plugin-pwa (manifest, colores, íconos de prueba)
- [x] Barra de navegación inferior con Casa, Tareas, Canjes y Jugar (placeholders)
- [x] Monedas y puntos siempre visibles arriba
- [x] `storage.js`: cargar, guardar, exportar e importar progreso
- [x] `config.js` con todos los valores de la economía
- [x] `PLAN.md` y `CLAUDE.md`
- [x] Skills seleccionadas de claude-code-game-studios en `.claude/`
- [x] Nombre (Bolti), paleta rosa + turquesa e íconos en degradé
- [x] Referencia de apariencia de Bolti para los sprites
- [x] Subido a GitHub: https://github.com/UriP24/MascotaVirtual

## Mié 21 — Tareas + estudio ✅
- [x] Economía: 1 punto = $500, estudio 1 punto cada 30 min, tope 4 h/día
- [x] Agregar tarea (texto + tipo simple / grande / estudio)
- [x] Completar tarea y sumar puntos según `config.js` (no se puede deshacer)
- [x] Borrar tarea (sin restar puntos ya ganados)
- [x] Lista vacía con mensaje amable y aviso "+N ⭐"
- [x] Tarea "Estudiar" obligatoria de lunes a viernes (no se borra; vence sin castigo a medianoche)
- [x] Cronómetro: mínimo 30 min para completar, pausa en segundo plano (Page Visibility API),
      sigue solo al volver, sobrevive a cerrar la app
- [x] Bolti pregunta "¿Seguís estudiando?" cada 20–30 min; sin respuesta en 3 min se pausa
- [x] Pantalla encendida mientras corre (Wake Lock API)
- [x] `historialEstudio` guardado (para que Bolti se ponga triste si no estudió)
- [x] 13 pruebas de lógica (`npm test`) + prueba en navegador a 360 px
- [x] `/ux-review`: botones táctiles más grandes

## Jue 22 — Publicación temprana, conversión y respaldo
- [ ] Publicar ya en GitHub Pages (HTTPS, se actualiza solo con cada push) para probar en el
      celular la instalación y el Wake Lock, que solo andan con HTTPS
- [ ] Probar el cronómetro en el celular real: bloquear pantalla, cambiar de app, volver
- [ ] Botón para convertir 50 monedas en 1 punto
- [ ] Aviso si falla el guardado
- [ ] Botones de exportar/importar progreso (respaldo)

## Vie 23 — Canjes
- [ ] Tarjetas de planes con precio en puntos
- [ ] Comprar plan → genera cupón con fecha
- [ ] Lista de cupones y marcar cupón como cumplido
- [ ] Límite de 1 canje por mes calendario (validado con la fecha de los cupones)
- [ ] Mostrar si el canje del mes está disponible o desde qué fecha vuelve a estarlo
- [ ] `/balance-check` de la economía

## Sáb 24 — Perrita
- [ ] `/quick-design` de la perrita (estados y reglas)
- [ ] Sprites en pixel art (contenta, con hambre, triste, dormida) según `docs/specs/bolti-apariencia.md`
- [ ] Pantalla Casa con la perrita y barra de hambre
- [ ] Estados calculados según saciedad, hora y última visita (nunca se enferma ni muere)
- [ ] Triste si el último día de semana no estudió (`estudioElDia` en `logic/tareas.js`); se le pasa al estudiar

## Dom 25 — Comida y minijuego
- [ ] Tienda de comida (se paga con monedas)
- [ ] Darle de comer a la perrita
- [ ] Minijuego: atrapar huesitos que caen (da monedas) — *se recorta primero si falta tiempo*

## Lun 26 — Pulido y publicación
- [ ] Bienvenida con mensaje de cumpleaños
- [ ] Ícono definitivo y colores
- [ ] `/ux-review` a 360 px
- [ ] Revisar la publicación final

## Mar 27 — Prueba en el celular
- [ ] `/smoke-check` + prueba completa en un celular real (instalar, usar sin internet)
- [ ] `/playtest-report` y arreglos

## Mié 28 — Entrega 🎂

## Después del cumple
- [ ] Tala y Lucky
- [ ] Gacha de ropa con puntos
- [ ] Más minijuegos
- [ ] Sincronización en la nube

---

## Próxima sesión — Jue 22: Publicación temprana, conversión y respaldo

Tareas concretas:
1. Workflow de GitHub Actions que publique en GitHub Pages con cada push (ajustar `base` en
   `vite.config.js` a `/MascotaVirtual/`). El repo tiene que ser público, o tener GitHub Pro.
2. Uri prueba en su celular: instalar la app, estudiar unos minutos, bloquear pantalla y cambiar
   de app (el tiempo no tiene que contar), y ver que la pantalla no se apague sola.
3. Convertir monedas en puntos (`logic/economia.js` + botón; por ahora no hay fuente de monedas).
4. Aviso si `guardarEstado` falla, y botones de exportar/importar progreso.

Prompt para arrancar:

> Leé `CLAUDE.md` y `PLAN.md`. Hoy toca el día Jue 22: publicación temprana en GitHub Pages, convertir monedas en puntos y respaldo del progreso. Mostrame el plan antes de codear, hacé un commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
