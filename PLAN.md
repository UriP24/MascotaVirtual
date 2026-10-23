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
- [x] Canjes de jueguitos (chico 20 ⭐ / 3 meses, mediano 50 / 6, grande 100 / 8, enorme 190 / 12),
      en una sola tarjeta "Un jueguito" que abre un selector
- [x] **Mochila 🎒** en vez de la bandeja: tocar una comida la hace volar a la boca, o arrastrarla
- [x] Decisiones de balance tomadas (pomodoro de 25 min, tareas a 10 🪙, premios festejados, sin blindaje de fecha)

## Dom 25 — Jugar ✅
- [x] `logic/juegos.js`: se juega despierta y con energía ≥ 10; cuesta 10 ⚡ al empezar; da 🪙 (tope 40)
      y +8 💗 al terminar; Bolti festeja en Casa ("¡Qué lindo jugar con vos! 🦴")
- [x] `logic/huesitos.js`: simulación pura con pruebas (aparición, caída, atrapar, vidas, dificultad)
- [x] Minijuego **"Atrapá los huesitos"**: 45 s, cuenta regresiva, Bolti sigue el dedo, 🦴 +1, 🍖 dorado +3,
      🍫 chocolate saca una de 3 vidas (nunca resta monedas), pausa manual y automática, resultado
- [x] Pantalla Jugar con la energía de Bolti y por qué no se puede jugar (dormida o cansada)
- [x] La cola se mueve con mimos en cualquier estado de ánimo (también al tocarla)
- [x] Modo prueba: "Energía llena". 69 pruebas automáticas
- [x] Huesitos más difícil: 40 s, más cantidad y dorados; velocidad por escalones (lenta 5 s, sube a
      los 5 y a los 15 s, "¡Más rápido! 🔥" en los últimos 15 s); área de atrape solo cabeza y boca
- [x] Minijuego **"Memoria de Bolti"**: cartas tapadas desde el principio, límite por tiempo con bonus
      por nivel (3 → 4 → 6 → 8 pares), equivocarse no resta tiempo
- [x] Huesitos: el doble de cosas cayendo (~160 por partida), a veces dos a la vez
- [x] **Estudio pomodoro:** bloques de 25 min (1 ⭐ cada uno), máximo 8 por día; al terminar cada
      bloque Bolti pregunta "¿Querés seguir estudiando?" con un mensaje de ánimo (seguir / descansar /
      terminar)
- [x] **Racha 🔥 y estadísticas de estudio** (tiempo total, pomodoros, días, promedio, gráfico de 7 días)
- [x] Tareas de un solo tipo: +10 🪙 cada una (tope de 5 por día)
- [x] Bolti festeja cuando le dan galletita o queso
- [x] Decidido: no blindar el cambio de fecha del celular
- [x] Premio por récord según el puntaje: +10 🪙 cada 500 puntos (mínimo 5)
- [x] **Puntajes** en los dos juegos (racha ×2/×3, par a la primera, bonus por nivel y por corazones) →
      monedas con una tabla única **sin tope**; **récords** por juego (premio: +10 🪙 cada 500 puntos del récord, mínimo 5)

## Lun 26 — Pulido
- [ ] Bienvenida con mensaje de cumpleaños y 🎂 torta de regalo el 28/10
- [x] Comidas de Bolti: Mari dijo "comida de perro" → plato de croquetas (más premios que eligió Uri)
- [ ] Ícono definitivo con Bolti
- [ ] Aviso si falla el guardado; exportar/importar progreso (respaldo)
- [ ] `/ux-review` de toda la app a 360 px
- [ ] Borrar `public/prototipo-bolti.html`
- [ ] Revisar que el modo prueba no aparezca sin `?prueba` (y decidir si se deja)
- [ ] **Sonidos** (última fase, pulido): ladrido corto al tocarla, "ñam ñam" al comer, ronquidito
      dormida, sonido al atrapar huesitos / chocolate / récord, campanita al terminar un pomodoro,
      "cling" de monedas. Con Web Audio o archivos cortos (mp3/ogg chicos, que pesen poco offline).
      Botón para silenciar 🔇 y que arranque en volumen bajo. En iPhone el sonido solo arranca después
      del primer toque.

## Mar 27 — Prueba en el celular
- [ ] `/smoke-check` + prueba completa en un celular real (instalar, usar sin internet)
- [ ] `/playtest-report` y arreglos

## Mié 28 — Entrega 🎂

## Después del cumple
- [ ] Tala y Lucky
- [ ] Bolti repite lo que dice Mari con ladridos (como Tom)
- [ ] Habitaciones: cocina, baño (bañarla), patio
- [ ] **Más minijuegos** (contenido extra, a Uri le gustan todos):
  - [ ] 🐄 **Bolti vaquera:** vista desde arriba, las vacas se alejan de Bolti y hay que arrearlas al
        corral sin que se escapen por los bordes (como hacía Bolti de verdad). Rondas con más vacas
  - [ ] 🏃 ~~Bolti aventuras~~ → ahora es "Paseo con Bolti" (Próxima sesión, punto 18): corre de costado, tocar para saltar troncos, charcos y gatos; se van
        sumando amigos perros hasta encontrarse con todos (hay que dibujar a Bolti de perfil)
  - [ ] 🎾 **Tirale la pelota:** deslizar el dedo para tirar; Bolti la atrapa en el aire
  - [ ] 🕳️ **¿Dónde está el hueso?:** Bolti lo entierra en uno de 3 pozos, se mezclan y hay que adivinar
  - [ ] 🐦 **Bolti y las palomas:** tocar las palomas de la plaza antes de que se vuelen
- [ ] **Potenciadores para romper récords** (idea de Uri, a futuro): objetos que se compran con 🪙 en
      una tienda (o que aparecen dentro del juego) y se usan en una partida para tener más chances de
      superar el récord. Ideas:
  - [ ] ⏱️ **Reloj:** +10 s de partida (memoria o huesitos)
  - [ ] 🧊 **Hielo:** en huesitos, cámara lenta unos segundos para agarrar mejor huesitos y carne
  - [ ] 🛡️ **Escudo de hueso:** el primer chocolate no saca corazón
  - [ ] 🧲 **Imán:** en huesitos, los huesitos cercanos van solos a la boca de Bolti unos segundos
  - [ ] 🔍 **Lupa:** en memoria, muestra un par un segundo
  - [ ] ✨ **Puntos dobles:** ×2 los primeros 10 s
  - Decidir: precios (que no se coman todas las monedas de la comida), máximo 1 por partida, y si
    la partida con potenciador cuenta igual para el récord
- [ ] Sincronización en la nube
- [ ] **Notificaciones** (pedido de Uri): si a cierta hora (ej. 19:00) no completó el estudio del día,
      una notificación suave de Bolti ("¿Estudiamos un ratito? 📚"), como mucho 1–2 por día.
      Necesita un servidor chico de push (web-push, p. ej. un Cloudflare Worker gratis con un cron) y
      pedir permiso; en iPhone solo anda con la app instalada (iOS 16.4+). Sin servidor no hay forma
      confiable de avisar con la app cerrada.

---

## Próxima sesión — Lun 26: Bienvenida de cumpleaños y pulido

La app publicada: https://urip24.github.io/MascotaVirtual/ (se actualiza sola con cada push).
Mari tiene **Android**. Decisiones de Uri del 23/10 (todas cerradas):

1. **Bienvenida** (solo la primera vez, se guarda `bienvenidaVista`), pantallas en orden:
   1. El mensaje de Uri, textual:
      > Mi amor, feliz cumpleaños, esta vez decidí ser un poco mas creativo con tu regalo. Así q con
      > mi amigo Claudio (Claude Code), decidimos hacerte un regalo. Tu propia mascota virtual. Espero
      > que te guste, que lo disfrutes, que te entretengas y que te sirva sobre todas las cosas.
      >
      > Te Amo, Uri ❤️
   2. Botón para seguir → "¿Estás lista para empezar?" con botón **"Sí"**.
   3. Texto "¡Hola, Mari!, soy Bolti" (Bolti **todavía no se ve**, solo el mensaje).
   4. Botón **"Conocer a Bolti"** → Casa. El homenaje ya está en el mensaje, no hace falta más.
2. **Tutorial:** después de la bienvenida, preguntar si quiere verlo. Siempre accesible desde Configuración.
3. **Botón ⚙️ Configuración bien visible** (no escondido) con todo lo que no es central: ver tutorial,
   vacaciones y silenciar sonidos. Aviso si falla el guardado.
4. **Respaldo automático** (Mari no hace nada): `navigator.storage.persist()` al abrir, una copia diaria
   del progreso guardada aparte (las últimas 7) y si el guardado principal está roto, vuelve solo a la
   última copia buena. Copia en la nube: después del cumple (necesita un servicio con cuenta).
5. **Cumpleaños todos los años el 28/10:** confeti, "¡Feliz cumple, Mari!" y aparece un **regalo que se
   sacude y brilla**; al tocarlo se abre y da el 🎩 **gorrito** (a la mochila → Ropa) y la 🎂 **torta**
   (a la mochila → Comida). Ese día **no hay estudio obligatorio**.
6. **Bolti se viste:** la mochila con pestañas Comida / Ropa; tocar una prenda se la pone o se la saca
   (una por zona: cabeza, cuello, cuerpo, patitas, cara). Base para el gacha.
7. **Estudio sin culpa:** sacar el humor "extraña el estudio" (tristeza + nubecita). Bolti **de vez en
   cuando** (no siempre) tira una burbuja recordando estudiar.
8. **Vacaciones:** si pasa una semana sin estudiar en días obligatorios, Bolti pregunta "¿Estás de
   vacaciones? 🏖️". Sí → elige desde (por defecto el día que dejó de estudiar) y hasta; en ese período
   no hay tarea obligatoria ni recordatorios y la racha no se corta. No → no vuelve a preguntar por una
   semana. También se cargan / terminan desde Configuración. (Reemplaza la regla especial de diciembre.)
9. **Arranque:** 100 🪙 y 30 ⭐, lista de tareas vacía.
10. **Sonidos antes del 28:** ladrido, ñam, ronquido, sonidos de los juegos, campanita del pomodoro,
    monedas. Volumen bajo, arrancan después del primer toque, botón para silenciar (en Configuración).
11. **QR** con el link de la app para imprimir en la tarjeta de cumpleaños.
12. Limpieza: borrar `public/prototipo-bolti.html`, `/ux-review` a 360 px. El modo prueba (`?prueba`)
    queda oculto para usarlo más adelante.
13. ~~Ícono~~ ✅ hecho el 23/10: modelo 9, fondo turquesa, huellita con almohadilla de corazón y corazón rosa.

**A medida que vayamos terminando lo anterior** (quedan 7 días):

14. **Gacha con ⭐** (pestaña nueva o dentro de Canjes):
    - Tirada de **10 ⭐** (confirmado). Sale sobre todo ropa: cabeza (gorritos, moño, corona, flor,
      vincha), cuello (bufanda, bandana, collar con chapita "Bolti"), cuerpo (pulover, buzo, impermeable,
      remera de Argentina), patitas (guantes, botitas, medias), cara (anteojos), disfraces enteros.
    - Rarezas: común ~70%, rara ~22%, épica ~7%, ultra rara ~1% (cupones que **solo** existen en el gacha,
      Uri elige cuáles; nunca planes sacados de Canjes). Premios de ⭐: 30 (5%), 50 (2%), 100 (0,5%).
    - **Repetidas → piezas** (idea de Uri): una prenda repetida da 1 pieza de su rareza. Con piezas se
      canjea una prenda **que no tenga** de esa misma rareza: 5 piezas comunes, 10 raras, 20 épicas,
      3 ultra raras (conjunto ultra raro).
    - **Garantías (pity):** rara o mejor cada 10 tiradas. Ultra rara: 1% base, desde la tirada 20 sube
      +5% por tirada y en la 30 sale segura. El contador vuelve a 0 al salir una ultra rara y no se pierde
      al cambiar de temporada.
    - **50-50 con garantía:** cuando sale ultra rara, 50% es el conjunto destacado de la temporada y 50%
      uno de la base; si "pierde", la próxima ultra rara es segura la destacada. Puede salir repetida:
      da 1 pieza ultra rara. Los cupones exclusivos ultra raros se pueden repetir (cada uno es un cupón).
    - **Temporada:** la ropa de temporada solo aparece (en el gacha y en el canje de piezas) mientras es
      su temporada; fuera de ella no se muestra. Las piezas no vencen.
    - Chances visibles y contador "faltan N para la ultra rara segura".
    - Rotación: base fija + colección de temporada que sale más seguido en su época (Navidad/verano dic–ene,
      San Valentín feb, otoño mar–may, invierno jun–ago, primavera sep–nov, Halloween y cumple en oct).
      Lo conseguido queda para siempre; lo de temporada vuelve al año siguiente.
15. **Colección:** álbum con todas las prendas (las que faltan, en silueta con "?"), por colección, con
    barra de progreso. Recompensas: tirada gratis en hitos (10, 20, 30 prendas), prenda exclusiva al
    completar una colección (no sale en el gacha) y un cupón especial al completar todo.
16. **El puré de zapallo (secreto de cómplices):** de chica Mari no quería comer su puré de zapallo
    anco, los papás no la dejaban levantarse, se fueron a dormir, Bolti se lo comió y la felicitaron por
    el plato vacío. Aprobado: a la hora del **almuerzo (13 a 15 h)** aparece un platito de puré en la
    habitación (la primera vez unos días después del cumple, para que lo descubra; después ~1 vez por
    semana); si Mari se lo da, Bolti se lo come feliz, le **guiña un ojo** y dice "Shhh… nuestro
    secreto 🤫". La primera vez da la prenda exclusiva "Babero de cómplice" para la colección. Sin
    explicar la historia: Mari la va a reconocer.
17. **Secretos (easter eggs)** con un apartado en Colección "Secretos descubiertos N/13" (los que faltan
    tapados con "?" y una **pista discreta** tipo adivinanza). Además, Bolti suelta **pistas** cada
    tanto entre sus frases normales (~1 de cada 10, ej.: "Me pica la nariz… 🤧", "Me encantaría salir
    a pasear… si alguien lo anotara 📝"). Cada secreto da una **prenda exclusiva** (no sale en el
    gacha); si no hay prenda que le quede, una **multi gratis**.
    | Secreto | Premio |
    |---|---|
    | Tocarle la nariz 5 veces seguidas → estornuda y se sacude | Pañuelo "¡Salud!" |
    | Rascarle la panza un rato → patea con la patita trasera | Remerita corta "panza al aire" |
    | Mantener el dedo apretado → se tira panza arriba | Pijama de ositos |
    | Sacudir el celu → se sacude como después del baño | Bata de baño |
    | Un gato pasa por la ventana (de vez en cuando) y le ladra | Vincha con orejitas de gato |
    | Pasa una vaca por la ventana (de vez en cuando) | Sombrero de vaquera |
    | **Medias:** cada mañana (al despertarse) ~15% de chance de que traiga una media en la boca; al tocarla se la da. La 1ª queda como "Media suelta"; con la 2ª completa el conjunto **"Par de medias"** (en las patitas). Después sigue trayendo alguna cada tanto (+10 🪙) | Par de medias |
    | De noche, tocar la ventana: a veces estrella fugaz y Bolti pide un deseo | Multi gratis |
    | 14 de febrero: Bolti con moño rojo | Moño rojo |
    | **24 de marzo, aniversario de Uri y Mari** (todos los años): Bolti con corazones y una **cartita de Uri** que solo aparece ese día | Collar de corazón |
    | El puré de zapallo (punto 16) | Babero de cómplice |
    | Anotar "pasear a Bolti" → desbloquea el Paseo (punto 18) | Multi gratis |
    | INVENCIBLE en el Paseo (punto 18) | Traje de superhéroe |
18. **Minijuego "Paseo con Bolti"** (se desbloquea en secreto): si Mari anota una tarea que diga
    "pasear a Bolti" (sin importar mayúsculas ni tildes), Bolti se pone loca de contenta y aparece el
    juego nuevo en Jugar. Bolti camina de costado (hay que dibujarla de perfil), se toca para saltar
    charcos, pozos, gatos y bicis, y junta huesitos (reemplaza a "Bolti aventuras").
    - Con cierto puntaje: título **"Paseadora de perros"** y el **collar con chapita "Bolti"**
      (exclusivo, no sale en el gacha).
    - **INVENCIBLE** (anécdota real: un caballo la pateó, Bolti voló y se levantó como si nada): a veces
      aparece un caballo. Si la patea, Bolti sale volando en dibujito (estrellitas, rebota, sin
      lastimarse), se levanta moviendo la cola y dice "Soy…" → cartel **INVENCIBLE** en letras propias
      gruesas al estilo de la serie, pero en rosa y turquesa (guiño a la serie que vieron juntos; no se
      usa el logo oficial). Esa patada no saca vida: le da unos segundos de **modo invencible** (nada la
      frena). La primera vez desbloquea el secreto y el **traje de superhéroe** (capa + antifaz).
19. Bolti vaquera (último).

Mar 27: prueba en el celular Android de Uri y estado limpio para Mari. Mié 28: entrega.

Prompt para arrancar:

> Leé `CLAUDE.md`, `PLAN.md` y `docs/specs/bolti-personaje.md`. Seguimos con la "Próxima sesión" de
> `PLAN.md` en orden (bienvenida, Configuración, respaldo automático, regalo de cumple con ropa,
> vacaciones, sonidos, QR) y después el gacha y la colección. Mostrame el plan antes de codear, hacé un
> commit por paso y al final actualizá `PLAN.md` y dejame la sección "Próxima sesión".
