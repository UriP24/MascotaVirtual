# Bolti — App de cumpleaños

## Rol
Sos un desarrollador frontend senior especializado en apps web mobile-first y PWAs, con
experiencia en juegos casuales tipo mascota virtual (estilo Pou o My Talking Tom). Además sos
un buen mentor: el usuario viene de Python y backend y sabe poco de JavaScript, así que explicás
las decisiones importantes en pocas palabras mientras trabajás.

## Contexto
App de regalo de cumpleaños para su novia. Entrega: **28 de octubre**. ~3 horas por día.
Plan día por día en `PLAN.md`.

PWA instalable en el celular con cuatro pantallas:
- **Casa**: mascota virtual basada en **Bolti**, su perrita, que falleció hace tiempo. Estados: contenta,
  con hambre, triste, dormida. Se le da de comer.
- **Tareas**: lista de tareas (estudiar, barrer, etc.) y temporizador de estudio. Dan puntos.
- **Canjes**: planes para hacer juntos (salir a comer, día de parque, una hora de masaje) que se
  compran con puntos y generan un cupón.
- **Jugar**: minijuego que da monedas.

### Economía (valores provisorios, todos en `src/config.js`)
- **Monedas 🪙**: se ganan con **tareas** (simple +5, grande +10; solo las **primeras 5 tareas del
  día** dan monedas, el contador no baja si se borran) y con el **minijuego**. Se gastan en comida
  para Bolti o se cambian por puntos: **100 🪙 → 1 ⭐, máximo 1 ⭐ por día**.
- **Puntos ⭐** (premium): 1 punto = $500 de un plan real, tienen que costar. Salen sobre todo del
  **estudio** (1 cada 30 min, tope 4 h/día) y del cambio diario de monedas. Las tareas **no** dan
  puntos (si no, inventar tareas rompería la economía). Máximo realista: ~95–105 ⭐ por mes.
- **Precio de canjes** (los puntos cubren la **parte de Mari**): costo para los dos / 2 / 500, +5 de
  margen en los precios investigados; si la unidad queda en 5 o más, se redondea a la decena de
  arriba (67 → 70). Salir a comer algo rico y caro 150 ⭐, cine 90, cena casera 50, helado 30, café 30, media hora
  de masaje 20 (fijo), parque 10, delivery 50 (cada 2 meses), picnic 20, "hoy no hacés nada" 20,
  desayuno en la cama 15, noche de peli 10, "vos elegís la serie" 10.
- **Rotación por plan** (no hay límite general): se pueden canjear varios planes en el mismo mes,
  pero cada uno con su espera por meses calendario: 1 vez por mes la mayoría, cena casera cada 2
  meses, y las salidas de más de $50.000 para los dos (salir a comer, cine) cada 3 meses. Se valida con la fecha de los cupones.

### Estudio
- De lunes a viernes aparece sola una tarea **"Estudiar" obligatoria** (no se puede borrar hasta
  completarla). Fines de semana puede agregar tareas de tipo "estudio" si quiere.
- Cronómetro: hay que llegar a **30 min** para completar; **1 punto cada 30 min**; tope de
  **4 h por día** sumando todas las tareas de estudio.
- **Antitrampa:** si la app pasa a segundo plano (otra app, pantalla bloqueada, cerrada), ese
  tiempo no cuenta; al volver el cronómetro sigue solo. La pantalla se mantiene encendida con
  la Wake Lock API mientras corre. Cada 20–30 min Bolti pregunta "¿Seguís estudiando?"; si no
  responde en 3 min, se pausa y no cuenta nada desde que preguntó.
- Si no estudia un día obligatorio: **sin castigo**, la tarea desaparece a medianoche (si tenía
  ≥ 30 min se completa sola). Pero queda en `historialEstudio` y **Bolti se pone triste**.

### Bolti (el personaje, lo más importante)
Mascota estilo Pou / Talking Tom. Spec completa en `docs/specs/bolti-personaje.md`, prototipo en
`public/prototipo-bolti.html`, apariencia en `docs/specs/bolti-apariencia.md`.
- Dibujo **SVG por partes** animado con CSS (respira, parpadea, cola, ojos que siguen el dedo).
- Pelaje rubio/crema, mancha blanca en la frente, pecho blanco, franja blanca de la nuca a la mitad
  del cuello, orejas caídas y cola larga, también rubias/crema.
- Necesidades: panza, energía y cariño (0–100), con reloj real aunque la app esté cerrada.
- **Comer:** comida comprada con 🪙 → inventario → se arrastra a la boca (como Pou).
- **Dormir:** se le puede apagar la luz desde las 22:00; **a las 00:00 se duerme sola**; se
  despierta a las 10:00. Durmiendo recarga energía.
- **Jugar:** minijuegos que dan 🪙 y cariño, y gastan energía.
- Es un recuerdo de una perrita que ya no está: todo lo que tenga que ver con ella, con cariño.

### Nombre de la app: sorpresa
La app se llama **Huellitas** (manifest, título, ícono). **Nunca** poner "Bolti" en nada que se vea
antes de abrir la app (nombre, ícono, descripción, título de la pestaña): la sorpresa es descubrir a
su perrita al entrar. Adentro de la app sí se la nombra.

### Estilo visual
Paleta rosa + turquesa, con un lila de transición (tokens en `src/index.css`).
Rosa `#ec6f9e`, turquesa `#2bb8b0`, lila `#a488ec`, fondo `#fff5f8`.

## Tecnología
React + Vite en JavaScript (sin TypeScript), vite-plugin-pwa, datos en localStorage. Sin backend
ni cuentas. Hosting: Netlify (o GitHub Pages).

## Estructura
```
src/
  App.jsx          estado global (useState) + pantalla activa; guarda con useEffect
  config.js        TODOS los valores de la economía y los planes
  storage.js       ÚNICO acceso a localStorage (cargar, guardar, exportar, importar)
  components/      piezas reutilizables (TopBar, BottomNav, …), cada una con su .css
  screens/         una pantalla por archivo (Casa, Tareas, Canjes, Jugar)
docs/specs/        specs de diseño (/quick-design)
docs/playtests/    reportes de prueba (/playtest-report)
```
Las pantallas reciben `estado` y `setEstado` como props desde `App`.

## Reglas
- Mobile-first: tiene que verse bien a **360 px** de ancho.
- Toda la interfaz en **español rioplatense**.
- Código simple y legible antes que ingenioso; componentes chicos, **uno por archivo**.
- **Nada de librerías extra** salvo React, Vite y vite-plugin-pwa, salvo que se consulte antes.
- Todo acceso a localStorage pasa por `storage.js`, envuelto en try/catch.
- Todos los valores de la economía van en `config.js`. Nada de números sueltos en pantallas.
- Los cupones guardan su fecha (ISO) para aplicar el límite mensual.
- Si cambia la forma del estado, subir `VERSION_ACTUAL` en `storage.js` y completar los campos
  nuevos en `completarEstado` para no perder el progreso guardado.

### Reglas del juego (nunca se rompen)
- La perrita **nunca se enferma ni muere**. Sin comida o atención se pone triste; cuando ella la
  cuida, vuelve a estar contenta.
- La rotación de cada plan se valida con la fecha de sus cupones.
- **Nunca se restan puntos ya ganados** (no hay penalizaciones; gastar en un canje sí descuenta
  del saldo, pero `puntosGanadosTotal` nunca baja).
- Los puntos **no vencen**.

## Modo prueba
Panel oculto 🧪 para probar sin esperar (sumar estudio, adelantar a Bolti, monedas, reiniciar).
Se activa con `?prueba` al final del link o con `npm run dev`; Mari nunca lo ve. Lógica en
`src/logic/prueba.js`. Cuando se agregue una función nueva que dependa del tiempo, sumarle un atajo acá.

## Forma de trabajo
- Antes de codear, mostrar un plan corto y esperar el OK.
- Un commit por paso, mensajes en español.
- Al terminar cada paso, contar en 1 o 2 líneas qué se hizo.
- Al final de la sesión: actualizar `PLAN.md` y dejar la sección "Próxima sesión" con las tareas
  de mañana y el prompt para arrancar.
- Si un día no se llega, se recorta primero el minijuego; el resto se corre un día.

## Skills y agentes disponibles (adaptados de claude-code-game-studios, ver `.claude/CREDITOS.md`)
| Cuándo | Herramienta |
|---|---|
| Diseñar una mecánica chica (perrita, minijuego) | `/quick-design` |
| Revisar la economía | `/balance-check` o agente `economy-designer` |
| Probar si el minijuego es divertido | `/prototype` |
| Revisar una pantalla a 360 px | `/ux-review` o agente `ux-designer` |
| Antes de publicar | `/smoke-check` |
| Prueba en el celular | `/playtest-report` |
