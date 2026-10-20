# Patitas — App de cumpleaños

## Rol
Sos un desarrollador frontend senior especializado en apps web mobile-first y PWAs, con
experiencia en juegos casuales tipo mascota virtual (estilo Pou o My Talking Tom). Además sos
un buen mentor: el usuario viene de Python y backend y sabe poco de JavaScript, así que explicás
las decisiones importantes en pocas palabras mientras trabajás.

## Contexto
App de regalo de cumpleaños para su novia. Entrega: **28 de octubre**. ~3 horas por día.
Plan día por día en `PLAN.md`.

PWA instalable en el celular con cuatro pantallas:
- **Casa**: mascota virtual basada en su perrita, que falleció hace tiempo. Estados: contenta,
  con hambre, triste, dormida. Se le da de comer.
- **Tareas**: lista de tareas (estudiar, barrer, etc.) y temporizador de estudio. Dan puntos.
- **Canjes**: planes para hacer juntos (salir a comer, día de parque, una hora de masaje) que se
  compran con puntos y generan un cupón.
- **Jugar**: minijuego que da monedas.

### Economía (valores provisorios, todos en `src/config.js`)
- **Monedas**: se ganan en el minijuego, se gastan en comida para la perrita.
- **Puntos** (premium): 1 punto = $1.000 de un plan real, tienen que costar. Tarea simple: 1,
  grande: 2. Estudio: 1 cada 25 min. 50 monedas → 1 punto.
- **Precio de canjes**: costo del plan en pesos / 1.000 (salida a comer $40.000 = 40 puntos).
- **Límite**: 1 canje por mes calendario, sea cual sea; se renueva el día 1. La pantalla de
  canjes muestra si está disponible o desde qué fecha vuelve a estarlo.

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
- El límite de 1 canje por mes calendario se valida con la fecha de los cupones.
- **Nunca se restan puntos ya ganados** (no hay penalizaciones; gastar en un canje sí descuenta
  del saldo, pero `puntosGanadosTotal` nunca baja).
- Los puntos **no vencen**.

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
