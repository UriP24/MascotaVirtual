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
- [x] Prototipo jugable de Bolti como personaje (`public/prototipo-bolti.html`)
- [x] Spec de Bolti: comer arrastrando (como Pou), dormir a las 00:00, minijuegos
      (`docs/specs/bolti-personaje.md`) y sus valores en `config.js`

## Jue 22 — Bolti en Casa
- [ ] Publicar en GitHub Pages (HTTPS, se actualiza solo con cada push)
- [ ] Componente `Bolti` (SVG por partes) a partir del prototipo, uno por archivo
- [ ] Estado de Bolti v3: panza, energía, cariño, durmiendo, `ultimaActualizacion` (migración)
- [ ] `logic/bolti.js`: necesidades con reloj real (aunque la app esté cerrada) y humor,
      incluido triste si no estudió el último día obligatorio. Con pruebas
- [ ] Mimos: tocar (salto + frase) y frotar (corazones, +cariño)
- [ ] Barras de necesidades y burbuja de frases en Casa

## Vie 23 — Comida y sueño
- [ ] Tienda: comprar comida con 🪙 → inventario
- [ ] Bandeja de inventario y **arrastrar la comida a la boca** (abre la boca al acercarse)
- [ ] Dormir: luz desde las 22:00, se duerme sola a las 00:00, se despierta a las 10:00
- [ ] Bolti festeja cuando completa una tarea o termina de estudiar
- [ ] Probar el cronómetro en un celular real con HTTPS (bloqueo de pantalla, cambiar de app)

## Sáb 24 — Canjes
- [ ] Tarjetas de planes con precio en puntos
- [ ] Comprar plan → genera cupón con fecha
- [ ] Lista de cupones y marcar cupón como cumplido
- [ ] Límite de 1 canje por mes calendario (validado con la fecha de los cupones)
- [ ] Mostrar si el canje del mes está disponible o desde qué fecha vuelve a estarlo
- [ ] `/balance-check` de la economía

## Dom 25 — Jugar
- [ ] Botón "Jugar" con lista de minijuegos (energía mínima, cuesta energía, da cariño)
- [ ] Minijuego "Atrapá los huesitos" (45 s, 1 🪙 por huesito) — *se recorta primero si falta tiempo*
- [ ] Botón para convertir 50 monedas en 1 punto

## Lun 26 — Pulido
- [ ] Bienvenida con mensaje de cumpleaños y 🎂 torta de regalo el 28/10
- [ ] Comidas favoritas reales de Bolti (Uri le pregunta a Mari)
- [ ] Ícono definitivo con Bolti
- [ ] Aviso si falla el guardado; exportar/importar progreso (respaldo)
- [ ] `/ux-review` de toda la app a 360 px
- [ ] Borrar `public/prototipo-bolti.html`

## Mar 27 — Prueba en el celular
- [ ] `/smoke-check` + prueba completa en un celular real (instalar, usar sin internet)
- [ ] `/playtest-report` y arreglos

## Mié 28 — Entrega 🎂

## Después del cumple
- [ ] Tala y Lucky
- [ ] Bolti repite lo que dice Mari con ladridos (como Tom)
- [ ] Habitaciones: cocina, baño (bañarla), patio
- [ ] Ropa y accesorios para Bolti (gacha con puntos)
- [ ] Más minijuegos
- [ ] Sincronización en la nube

---

## Próxima sesión — Jue 22: Bolti en Casa

Tareas concretas:
1. Workflow de GitHub Actions que publique en GitHub Pages con cada push (`base: '/MascotaVirtual/'`
   en `vite.config.js`). El repo tiene que ser público.
2. Pasar el SVG del prototipo a componentes React: `Bolti.jsx` (+ `Bolti.css`) con props `animo`
   y `accion` (salto, mimos, comiendo).
3. `logic/bolti.js` + pruebas: avanzar necesidades con el tiempo que pasó, humor según
   `docs/specs/bolti-personaje.md`. Estado v3 en `storage.js` con migración.
4. Pantalla Casa: barras de necesidades, Bolti, burbuja de frases, mimos (tocar y frotar).

Prompt para arrancar:

> Leé `CLAUDE.md`, `PLAN.md` y `docs/specs/bolti-personaje.md`. Hoy toca el día Jue 22: Bolti en Casa (personaje, necesidades con reloj real, humor y mimos) y publicar en GitHub Pages. Mostrame el plan antes de codear, hacé un commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
