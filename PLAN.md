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

## Sáb 24 — Canjes + economía nueva ✅
- [x] Economía anti-trampas: las tareas dan **monedas** (simple +5, grande +10, solo las 5 primeras
      del día, el tope no se reinicia borrando tareas); cambio **100 🪙 → 1 ⭐, máx. 1 por día**
- [x] 13 planes con descripción y **precios investigados**: los puntos cubren la parte de Mari
      (costo para dos / 2 / 500, +5 de margen, redondeo a la decena si la unidad es ≥ 5):
      salir a comer algo rico y caro 150 ⭐, cine 90, cena casera 50, pedir comida rica 40, helado 30, café 30, picnic 20,
      media hora de masaje 20, "hoy no hacés nada" 20, desayuno en la cama 15, parque 10, noche de peli 10,
      "vos elegís la serie" 10
- [x] **Rotación por plan** en vez de 1 canje por mes: varios planes en el mismo mes, cada uno
      con su frecuencia: sin plata 2 veces por mes, poca plata 1 vez por mes, cena y comida pedida
      cada 2 meses, salir a comer y cine cada 3 meses
- [x] Historial de canjes con fecha y hora; "Mis cupones" muestra solo los pendientes
- [x] `logic/canjes.js`: cupones con fecha, rotación por plan, marcar cumplido;
      el saldo baja pero `puntosGanadosTotal` nunca
- [x] Pantalla Canjes: reglas, "🔒 Vuelve en enero" por plan, cambio de monedas,
      tarjetas de planes ("te faltan N ⭐"), confirmación en la app, "Mis cupones"
- [x] Bolti festeja el canje ("¡Que disfruten el plan! 💕")
- [x] Modo prueba: liberar canjes, liberar cambio de hoy, borrar cupones, +100 🪙
- [x] `/balance-check`: SANO (minijuego sin evaluar). 55 pruebas automáticas
- [x] Planes sin plata hasta 2 veces por mes; pedir comida rica 40 ⭐ cada 2 meses
- [x] Tristeza por estudio distinta de la de cariño: cara pensativa con nubecita 📚 (sin lagrimita) y
      recordatorio de unos segundos cada 7 min, con frases que van cambiando
- [x] Canjes de jueguitos (chico 16 ⭐ / 3 meses, mediano 48 / 6, grande 96 / 8, enorme 192 / 12),
      en una sola tarjeta "Un jueguito" que abre un selector
- [x] **Mochila 🎒** en vez de la bandeja: tocar una comida la hace volar a la boca, o arrastrarla
- [ ] Decidir recomendaciones del balance (igualar "grande", festejo para premios) — Uri
- [ ] Decidir: ¿estudio 1 ⭐ cada 30 o 45 min? (con 30, lo que pone Uri por Mari rinde ~$37–52 mil/mes máx.) — Uri
- [ ] Decidir: blindar los topes diarios contra cambiar la fecha del celular (fechas futuras cuentan como usadas) — Uri

## Dom 25 — Jugar
- [ ] Botón "Jugar" con lista de minijuegos (energía mínima, cuesta energía, da cariño)
- [ ] Minijuego "Atrapá los huesitos" (45 s, 1 🪙 por huesito) — *se recorta primero si falta tiempo*

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
- [ ] **Notificaciones** (pedido de Uri): si a cierta hora (ej. 19:00) no completó el estudio del día,
      una notificación suave de Bolti ("¿Estudiamos un ratito? 📚"), como mucho 1–2 por día.
      Necesita un servidor chico de push (web-push, p. ej. un Cloudflare Worker gratis con un cron) y
      pedir permiso; en iPhone solo anda con la app instalada (iOS 16.4+). Sin servidor no hay forma
      confiable de avisar con la app cerrada.

---

## Próxima sesión — Dom 25: Jugar

La app publicada: https://urip24.github.io/MascotaVirtual/ (se actualiza sola con cada push).

Tareas concretas:
1. Pantalla Jugar: lista de minijuegos (por ahora uno). Para jugar: Bolti despierta y energía ≥ 10;
   cada partida gasta 10 de energía y da +8 de cariño (`JUEGOS` en `config.js`).
2. Minijuego **"Atrapá los huesitos"** (45 s): caen huesitos (y alguna cosa que no hay que agarrar),
   Bolti abajo se mueve con el dedo, 1 🪙 por huesito. Objetivo del balance: **15–30 🪙 por partida**.
   Canvas o divs con `requestAnimationFrame`, sin librerías.
3. Pantalla de resultado: "¡Atrapaste 23 huesitos! +23 🪙", jugar de nuevo / volver.
4. Pausa si la app pasa a segundo plano.
5. Modo prueba: "Energía llena" para jugar seguido.
6. Si sobra tiempo: aplicar las recomendaciones del balance que elija Uri.

Prompt para arrancar:

> Leé `CLAUDE.md`, `PLAN.md` y `docs/specs/bolti-personaje.md`. Hoy toca el día Dom 25: Jugar (pantalla de minijuegos y "Atrapá los huesitos" que da monedas). Mostrame el plan antes de codear, hacé un commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
