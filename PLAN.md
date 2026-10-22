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

## Jue 22 — Bolti en Casa ✅
- [x] Workflow de GitHub Actions para publicar en Pages (pruebas + build + deploy)
- [x] Pages activo: https://urip24.github.io/MascotaVirtual/ (se actualiza solo con cada push)
- [x] Componente `Bolti` (SVG por partes) a partir del prototipo
- [x] Estado v3 de Bolti: panza, energía, cariño, durmiendo, `actualizadaEn`, `instaladaEn`
- [x] `logic/bolti.js`: necesidades con reloj real (aunque la app esté cerrada), se duerme a las 00:00,
      se despierta a las 10:00, humor (incluye triste si no estudió). 11 pruebas nuevas (24 en total)
- [x] Mimos: tocar (salto + frase, +1) y frotar (corazones, +3)
- [x] Barras de necesidades y globo de frases ("¡Te extrañé!", "Vamos a dormir, Mari 💤", hambre…)
- [x] Prueba en navegador con reloj adelantado + `/ux-review` de Casa
- [x] Nombre de la app: **Huellitas** (Bolti es sorpresa)
- [x] Modo prueba oculto (`?prueba`) para testear sin esperar
- [x] La app se actualiza sola cuando hay una versión nueva publicada
- [x] Modo prueba: forzar a Bolti despierta/dormida 1 h; arranca dormida si se instala de noche
- [x] "Vamos a dormir, Mari 💤" al abrir la app entre las 00:00 y las 06:00
- [x] Cara según cada necesidad: rubor = cariño, ojeras = cansancio, panza que gruñe = hambre;
      respiración visible
- [x] Jadeo cada 10–20 s cuando está contenta (boca abierta + lengua), después boca cerrada
- [x] Mimos mientras duerme (sube el cariño sin despertarla); dormida no muestra hambre ni cansancio

## Vie 23 — Comida y sueño ✅
- [x] Bolti mueve la cola mientras jadea (recordatorio de Uri) y verificado que la mueve con mimos
      (despierta rápido, dormida despacito)
- [x] Comidas: croquetas, galletita, queso, patita de pollo, carnecita con hueso, asadito (+ torta)
- [x] `logic/comida.js`: comprar con 🪙 (nunca puntos), dar de comer; llena o dormida no come.
      Estado v4 con inventario y 30 🪙 de bienvenida
- [x] Tienda (hoja que sube desde abajo)
- [x] Bandeja de inventario y **arrastrar la comida a la boca**: abre la boca al acercarse, mastica
      sin lengua, la rechaza si está llena
- [x] Botón de luz: apagar desde las 22:00, siesta si energía < 20 (hasta 80), prender la despierta
- [x] Barra de acciones: Tienda · Luz · Jugar
- [x] Bolti festeja tareas y estudio (+5 cariño y saludo especial al entrar a Casa)
- [x] Modo prueba: "Cansada" y "Llenar bandeja". 46 pruebas automáticas
- [ ] Probar el cronómetro en un celular real con HTTPS (bloqueo de pantalla, cambiar de app) — Uri

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
- [ ] Revisar que el modo prueba no aparezca sin `?prueba` (y decidir si se deja)

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

## Próxima sesión — Sáb 24: Canjes

La app publicada: https://urip24.github.io/MascotaVirtual/ (se actualiza sola con cada push).

Tareas concretas:
1. `logic/canjes.js` + pruebas: canjear un plan (resta puntos del saldo; `puntosGanadosTotal` nunca
   baja), genera cupón con fecha; **1 canje por mes calendario** validado con la fecha de los
   cupones; fecha desde la que vuelve a estar disponible (día 1 del mes siguiente).
2. Pantalla Canjes: tarjetas de planes (`PLANES` de `config.js`, precio = pesos / 500), cartel
   "Canje del mes disponible ✅" o "Vuelve a estar disponible el 1 de noviembre", confirmación
   dentro de la app antes de canjear.
3. Lista "Mis cupones": cupón con el plan y la fecha; marcar como cumplido (queda tachado).
4. Bolti festeja el canje (salto + frase al entrar a Casa).
5. Modo prueba: "Simular canje el mes pasado" y "Borrar cupones".
6. `/balance-check` de la economía: con 1 ⭐ = $500, ¿cuánto tarda cada plan?

Prompt para arrancar:

> Leé `CLAUDE.md`, `PLAN.md` y `docs/specs/bolti-personaje.md`. Hoy toca el día Sáb 24: Canjes (planes con puntos, cupones con fecha, marcar cumplido y límite de 1 canje por mes). Mostrame el plan antes de codear, hacé un commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
