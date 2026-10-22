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
   3. Triste (cariño < 30, energía < 30, o **no estudió el último día obligatorio**; esto último
      se le pasa en cuanto completa el estudio de hoy).
   4. Contenta.
3. **Mimos:** tocarla la hace saltar y hablar (+1 cariño). Frotarla con el dedo da corazones
   (+3 cariño cada tanto). **Dormida:** tocarla dice "zzz… 😴"; frotarla da corazones y cariño pero
   sigue durmiendo (ojos cerrados, mueve la cola despacito). Dormida no muestra hambre ni cansancio.
4. **Comer (como Pou):** la tienda vende comida por 🪙, que va al **inventario**. En Casa, una
   bandeja muestra el inventario y **se arrastra la comida hasta la boca**: Bolti abre la boca
   cuando la comida se acerca. Si la suelta en la boca, come (masticando **sin lengua afuera**); si
   la suelta en otro lado, la comida vuelve a la bandeja. Si está llena: "¡Estoy llena! 😋" y no se
   gasta. El 28/10 se regala una 🎂 torta de cumple.
5. **Dormir:**
   - Desde las **22:00** se le puede apagar la luz. Antes dice "No tengo sueño todavía 🐶", salvo
     que tenga menos de 20 de energía (siesta).
   - **A las 00:00 se duerme sola** aunque la luz siga prendida, y le dice a Mari que vaya a dormir
     ("Vamos a dormir, Mari 💤"). Sin castigo.
   - **Cada vez que Mari abre la app entre las 00:00 y las 06:00**, Bolti (dormida) la recibe con
     "Vamos a dormir, Mari 💤".
   - Durmiendo recarga +12,5 de energía por hora; despierta baja −4 por hora.
   - Se despierta sola a las **10:00** o cuando se prende la luz (con la energía que haya juntado).
6. **Jugar:** abre la lista de minijuegos. Cada partida da 🪙 y +8 de cariño, y cuesta −10 de
   energía. No juega con menos de 10 de energía o dormida ("Estoy cansada… 🥱").
   - Antes del cumple: "Atrapá los huesitos" (45 s, 1 🪙 por huesito).
   - Después: más minijuegos.
7. **Frases** en una burbuja cuando cambia el humor, al tocarla y en momentos especiales
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
- [ ] El humor cambia según las reglas, incluido triste si no estudió
- [ ] Arrastrar comida del inventario a la boca la alimenta; mientras come no saca la lengua
- [ ] A las 00:00 se duerme sola; desde las 22:00 se le puede apagar la luz; a las 10:00 se despierta
- [ ] Nunca muestra estado de enferma ni muerta
