# Spec: Bolti como personaje (estilo Pou / Talking Tom)

Acordado con Uri el 21/10. Prototipo jugable: `public/prototipo-bolti.html`
(con `npm run dev` → `/prototipo-bolti.html`). Valores en `src/config.js` (`PERRITA`, `COMIDAS`, `JUEGOS`).

## Resumen
Bolti vive en la pantalla Casa. Es un dibujo **SVG armado por partes** (cabeza, orejas, ojos, boca,
lengua, cola, cuerpo) animadas con CSS: respira, parpadea, ladea la cabeza, mueve la cola y sigue
el dedo con los ojos. Tiene tres necesidades (panza, energía, cariño) que cambian con el reloj
real, aunque la app esté cerrada. **Nunca se enferma ni muere.**

## Reglas
1. **Necesidades** de 0 a 100. Bajan por hora según `config.js`. Se recalculan al abrir la app con
   el tiempo que pasó desde la última vez (guardar `ultimaActualizacion`).
2. **Humor** (se calcula, no se guarda), primera regla que se cumpla:
   1. Dormida (si está durmiendo).
   2. Con hambre (panza < 30).
   3. Triste (cariño < 30 o energía < 30): lagrimita, orejas caídas, "¿Me hacés mimos? 🥺".
   4. Contenta.
   No estudiar **no** cambia su humor: Bolti lo recuerda en una burbujita que se va sola, como mucho
   3 veces por día y "Ayer te extrañé estudiando" como mucho una vez por semana.
3. **Mimos:** tocarla la hace saltar y hablar (+1 cariño). Frotarla con el dedo da corazones
   (+3 cariño cada tanto). **Dormida:** tocarla dice "zzz… 😴"; frotarla da corazones y cariño pero
   sigue durmiendo (ojos cerrados, mueve la cola despacito). Dormida no muestra hambre ni cansancio.
4. **Comer (como Pou):** la tienda vende comida por 🪙, que va a la **mochila 🎒**. En Casa, el botón
   Mochila la abre (Bolti se acomoda más arriba para que se le vea la boca); **tocar una comida** la
   hace volar sola hasta la boca, o **se arrastra la comida hasta la boca**: Bolti abre la boca
   cuando la comida se acerca. Si la suelta en la boca, come (masticando **sin lengua afuera**); si
   la suelta en otro lado, la comida vuelve a la bandeja. Si está llena: "¡Estoy llena! 😋" y no se
   gasta. El 28/10 se regala una 🎂 torta de cumple. **Galletita y queso son "premios":** después de
   comerlos Bolti festeja (salta, mueve la cola, corazones y "¡Gracias, Mari! ¡Te quiero!").
5. **Dormir:**
   - Desde las **22:00** se le puede apagar la luz. Antes dice "No tengo sueño todavía 🐶", salvo
     que tenga menos de 20 de energía (siesta).
   - **A las 00:00 se duerme sola** aunque la luz siga prendida, y le dice a Mari que vaya a dormir
     ("Vamos a dormir, Mari 💤"). Sin castigo.
   - **Cada vez que Mari abre la app entre las 00:00 y las 06:00**, Bolti (dormida) la recibe con
     "Vamos a dormir, Mari 💤".
   - Durmiendo recarga +12,5 de energía por hora; despierta baja −4 por hora.
   - Se despierta sola a las **10:00** o cuando se prende la luz (con la energía que haya juntado).
   - **Siesta:** con energía < 20 se le puede apagar la luz a cualquier hora; se despierta sola al
     llegar a 80 de energía (si la siesta llega a la noche, sigue durmiendo como de noche).
   - Botón 💡 "Apagar la luz" / ☀️ "Prender la luz" en Casa. Frases: "Buenas noches 💤",
     "Una siestita… 😴", "No tengo sueño todavía 🐶", "¡Buen día! ☀️" / "¿Ya es de día? 🥱".
6. **Jugar:** abre la lista de minijuegos. Cada partida da 🪙 y +8 de cariño, y cuesta −10 de
   energía. No juega con menos de 10 de energía o dormida ("Estoy cansada… 🥱").
   - "Atrapá los huesitos": 40 s; velocidad por escalones (lenta 5 s, sube a los 5 y a los 15 s, mucho
     más rápida los últimos 15 s). Bolti sigue el dedo y solo atrapa con la cabeza o la boca. 🦴 +1 🪙, 🍖 dorado +3 🪙 (raro),
     🍫 chocolate saca una de las 3 vidas (nunca resta monedas). Cada vez cae más rápido y seguido.
     Se pausa sola si la app pasa a segundo plano.
   - "Memoria de Bolti": pares de cosas de su vida. Las cartas arrancan tapadas. Límite por tiempo
     (40 s), cada nivel superado suma tiempo; equivocarse no resta. Niveles de 3 a 8 pares.
   - **Puntajes → monedas** (sin tope): huesitos +10 / dorado +30, racha ×2 desde 10 seguidos y ×3
     desde 25 (el chocolate la corta), +100 por corazón que queda. Memoria +20 por par, +10 si es a la
     primera, +50 × nivel superado. Tabla: <200 → 5 🪙, 200 → 10, 400 → 15, 600 → 20, 800 → 25,
     1.000 → 30, 1.300 → 35, 1.600 → 40 y +5 cada 300 más. Récord por juego: al superarlo, +10 🪙 cada 500 puntos del récord (mínimo 5).
   - Después: más minijuegos.
7. **Ropa:** la mochila tiene pestañas Comida y Ropa. Tocar una prenda se la pone o se la saca
   (una por zona: cabeza, cara, cuello, cuerpo, patitas; un disfraz entero saca lo demás). La ropa
   sale del gacha, del regalo de cumple y de los secretos. Cada prenda está dibujada en SVG con el
   mismo estilo que Bolti, en tres capas (atrás: capas y alas; cuerpo; cabeza): formas base en
   `src/components/ropa/PiezaRopa.jsx` y qué usa cada prenda en `src/components/ropa/dibujos.js`.
8. **Frases** en una burbuja cuando cambia el humor, al tocarla y en momentos especiales
   (completó una tarea, terminó de estudiar, cumpleaños).

## Cara según cada necesidad (se combinan)
- **Cariño = cachetes sonrojados:** cuanto más cariño, más rosados; con poco cariño, sin rubor.
- **Boca y lengua:** despierta, boca cerrada. **Contenta jadea** cada 10–20 s durante ~3 s (boca un
  poco abierta, lengua afuera que se mueve, respiración rápida y la cola rápida). Con mimos saca la lengua.
  Dormida (y mientras come), lengua adentro.
- **Energía baja (< 30):** ojeras y párpados caídos.
- **Hambre (< 30):** cejas tristes y la panza gruñe ("grrr" con rayitas que tiemblan).
- **Respira** siempre de forma visible (más lento y profundo dormida). La cabeza acompaña.

## Ciclo del juego
Jugar → monedas 🪙 → comprar comida → darle de comer arrastrando → Bolti contenta.
Los puntos ⭐ van aparte (tareas y estudio → canjes).

## Casos borde
- App cerrada varios días: las necesidades bajan hasta 0 como mínimo, nunca negativo. Al abrir, la
  saluda ("¡Te extrañé! 🥺"), con hambre o triste, y se recupera rápido con mimos y comida.
- Si abre la app de madrugada con Bolti dormida, se puede prender la luz para despertarla; vuelve
  a dormirse sola si sigue siendo después de las 00:00 y antes de las 10:00 y no hay actividad
  en 1 minuto.
- Cambio de hora o reloj del celular adelantado: no se valida (es un regalo, no un juego competitivo).

## Pendiente
- Comidas favoritas reales de Bolti (Uri le pregunta a Mari) → agregarlas a `COMIDAS`.
- Más adelante (después del cumple): repetir lo que dice Mari con ladridos (como Tom), habitaciones
  (cocina, baño, patio), ropa y accesorios.

## Criterios de aceptación
- [ ] Bolti se ve en Casa con sus colores (rubia/crema, blanco en frente, pecho y nuca, cola larga)
- [ ] Respira, parpadea, mueve la cola y sigue el dedo con los ojos
- [ ] Tocar y frotar suben el cariño y muestran corazones
- [ ] Las necesidades bajan con el tiempo real aunque la app esté cerrada
- [ ] El humor cambia según las reglas (no estudiar no la pone triste)
- [ ] Arrastrar comida del inventario a la boca la alimenta; mientras come no saca la lengua
- [ ] A las 00:00 se duerme sola; desde las 22:00 se le puede apagar la luz; a las 10:00 se despierta
- [ ] Nunca muestra estado de enferma ni muerta
