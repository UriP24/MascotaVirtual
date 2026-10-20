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
- [ ] Pushear a GitHub (`UriP24/MascotaVirtual`) — falta dar acceso a Claude al repo

## Mié 21 — Tareas
- [ ] Agregar tarea (texto + tipo simple/grande)
- [ ] Completar tarea y sumar puntos según `config.js`
- [ ] Borrar tarea (sin restar puntos ya ganados)
- [ ] Lista vacía con mensaje amable

## Jue 22 — Temporizador de estudio
- [ ] Temporizador de 25 min (inicio, pausa, reiniciar)
- [ ] Pausa automática al salir de la app (Page Visibility API)
- [ ] Sumar puntos al terminar una sesión
- [ ] Botón para convertir 50 monedas en 1 punto

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

## Dom 25 — Comida y minijuego
- [ ] Tienda de comida (se paga con monedas)
- [ ] Darle de comer a la perrita
- [ ] Minijuego: atrapar huesitos que caen (da monedas) — *se recorta primero si falta tiempo*

## Lun 26 — Pulido y publicación
- [ ] Bienvenida con mensaje de cumpleaños
- [ ] Ícono definitivo y colores
- [ ] Botones de exportar/importar progreso (respaldo)
- [ ] `/ux-review` a 360 px
- [ ] Publicar en Netlify

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

## Próxima sesión — Mié 21: Tareas

Tareas concretas:
1. Componente `TaskForm` (texto + simple/grande) en la pantalla Tareas.
2. Componente `TaskItem` con botones completar y borrar.
3. Funciones de tareas que actualicen el estado (sumar puntos y `puntosGanadosTotal`).
4. Probar en el celular que se guarda al cerrar y abrir la app.

Prompt para arrancar:

> Leé `CLAUDE.md` y `PLAN.md`. Hoy toca el día Mié 21: Tareas — agregar, completar y borrar tareas; sumar puntos. Mostrame el plan antes de codear, hacé un commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
