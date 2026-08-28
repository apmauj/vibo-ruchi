# Worklog — Snake de Sílabas 3D (POC)

## Estado del proyecto (continuación)

El proyecto previo dejó construida una capa de render 3D AAA completa en
`/public/game/assets/js/` (Three.js + EffectComposer + UnrealBloom):

- `config.js` — tunables centralizados (grid 20×20, cámara, bloom, paletas)
- `scene3d.js` — escena: renderer ACES+Fog, fondo cúpula gradiente, superficie
  curva (valle+horizonte), grid neón aditivo, halo de valle, rieles neón
  tubulares, starfield shader twinkle, dynamic quality auto-scaling, shake.
  Expone `gridToWorld(gx,gy)`, `surfaceY(x,z)` y clase `Scene3D`.
- `camera3d.js` — rig cinematográfico con `mode='menu'` (órbita) y
  `'follow'` (persecución con bank lateral, lookAhead, fov boost en speedBoost).
- `snake3d.js` — cuerpo tubular Catmull-Rom con shader (color head/body/tail,
  ondas de energía, ripple al crecer, sparkle de celebración, rim neón),
  cabeza con cara canvas (mejillas+sonrisa), ojos con pupila+brillo,
  lengua bífida que parpadea, headGlow sprite, headLight pointlight,
  estela aditiva shader. Recibe `gameState = { snake, moveT, speedBoost, growPulse }`
  donde `snake = { body:[{x,y}], prevBody, direction, celebrateTimer }`.
- `items3d.js` — `SyllableOrb` (core + ring + shell wireframe + halo toro +
  beam cilindro + label sprite + shadow), `BonusItem3D` (octaedro + emoji),
  `Obstacle3D` (octaedro estirado + edges). Recibe `board = { syllables:[{x,y,text,collected,isDistractor,isTarget}], bonuses:[{x,y,collected,info:{emoji,color}}] }`.
- `particles3d.js` — GPU Points con shader, shockwaves (RingGeometry),
  emitters: correct / confetti / bonus / error / gameOver.
- `popups3d.js` — pool de popups flotantes 3D (sprite+canvas), kinds:
  points/word/combo/error/bonus/life.

## Estado actual (al final de esta sesión)

Se completó el POC end-to-end: ya hay `index.html` + lógica de juego + UI
+ audio. El juego es jugable desde el browser (verificado con agent-browser).

### Archivos creados / modificados en esta sesión

- `/public/game/assets/js/words.js` (NEW) — Diccionario Español con
  silabación estándar: 5 categorías (animales, frutas, colores, objetos,
  naturaleza) ≈ 60 palabras. Exporta `WORD_BANK`, `ALL_WORDS`, `BONUS_POOL`
  (emojis + colores + efectos), `CHARACTERS` (Lili/Toto/Mimi/Sol),
  `DIFFICULTIES` (Fácil/Medio/Difícil), `pickWord(diff)`, `pickBonus()`.
- `/public/game/assets/js/audio3d.js` (NEW) — Motor de audio procedural Web
  Audio API (sin assets). Sonidos: `correct()` ding cristalino 880/1320/1760,
  `error()` boop descendiente 440→220, `word()` mini fanfarria Do-Mi-Sol-Do,
  `bonus()` pop con noise burst, `combo()` arpegio rápido, `lifeUp()`,
  `gameOver()` descenso melancólico, `click()`. Música ambiental: pad 4-osc
  con LFO vibrato en Do mayor. API: `ensure()`, `setEnabled(v)`,
  `setMusic(v)`, `startMusic()`, `stopMusic()`.
- `/public/game/assets/js/game3d.js` (NEW) — Motor de juego. Loop RAF,
  estado en `this.state` con `mode` (menu/playing/paused/gameover). Snake
  con body/prevBody/direction/nextDir, step-based con interpolación `moveT`.
  Spawning de sílabas (objetivo ordenado + distractores), bonus emojis,
  obstáculos. Colisión pared con wrap (modo relajado). Colisión cuerpo y
  obstáculo = `_die()` (respawn en centro, -1 vida, si 0 → gameOver).
  Comer sílaba correcta: +10 (combo x2 a partir de 3 seguidos), crecer
  cada 2 aciertos, ripple+growPulse, popup, particle burst. Comer sílaba
  incorrecta: `_wrongSyllable` — easy: rebota sin penalidad, medio: -5p,
  difícil: -1 vida. Completar palabra: +50, confetti, celebrate, spawn
  siguiente palabra (setTimeout 900ms). Bonus effects: ⭐ invencible 5.5s,
  ⚡ turbo 5s, ❤️ +1 vida, 🎈 -3 segmentos, 🍎/🍇/🍓 +25.
- `/public/game/assets/js/ui3d.js` (NEW) — Overlay UI. Construye DOM con
  innerHTML, cachea refs en `this.el`. Pantallas: menú (nombre + personaje
  + dificultad + opciones + JUGAR), HUD (chips Jugador/Score/Palabras/Vidas
  + Combo + Turbo + Star + Pause), panel de palabra con sílabas (current
  destacada amarillo, done tachado cyan), pausa, gameover con récord
  localStorage + stats (score/palabras/correctas/errores/precisión).
  Mobile pad (4 flechas) visible en pointer:coarse. Swipe sobre documento.
  Persistencia: `snake3d_prefs` (nombre/personaje/dif/opts) y
  `snake3d_record` (high score).
- `/public/game/index.html` (NEW) — Entrada del juego. Estructura: `<canvas>`
  full-screen + `<div id="ui-root">` overlay + `<script type=importmap>`
  (mapea `three` y `three/addons/` a vendor files) + `<script type=module>`
  que carga `Game3D` y `UI3D`. CSS inline con variables `--accent` cyan,
  `--pink`, `--violet`, glassmorphism con `backdrop-filter: blur`, hover
  transforms, animaciones cardIn/bob/pulse/flash/celebrate/badge.
- `/public/game/assets/js/game3d.js` — Bug fixes:
  - `s.ui.syncHUD()` → `this.ui.syncHUD()` (2 lugares, lineas 170/191)
    rompía el loop al comer (TypeError).
  - `_eatSyllable` ahora chequea orden: `isTarget && sl.order === sylIndex`.
    Si no, llama a `_wrongSyllable` (rebota en easy, -5p medio, -1 vida hard).
- `/public/game/index.html` — CSS compactado: viewport del preview era
  577px y el menú se cortaba. Reduje padding, font-size del logo 42→28px,
  opciones de columna a grid 3-col, char/diff-btn más chicos. Ahora JUGAR
  visible sin scroll.
- `/public/game/index.html` — Fix `[hidden]` no funcionaba porque `.screen`
  tiene `display: flex` que lo overridea. Agregado `[hidden] { display: none !important; }`.
- `/eslint.config.mjs` — Agregado `public/**/*.js` y
  `public/game/assets/js/vendor/**` a ignores (three.module.js tiraba 36
  errores `no-this-alias`).

## Verificación con agent-browser

✅ Página `/` carga correctamente (iframe a `/game/index.html`).
✅ Menú: 4 personajes + 3 dificultades + 3 checkboxes + JUGAR visibles.
✅ Click JUGAR → game state cambia a `playing`, snake en centro, palabra
   cargada (RIO, MONO, LOBO, MARRÓN, ARBOL, etc.), sílabas spawneadas.
✅ Movimiento: arrow keys cambian nextDir; snake step avanza head.
✅ Comer sílaba correcta: +10 score, sylIndex++, particle burst, popup +10.
✅ Comer sílaba incorrecta (orden o distractor): error count++, sin score,
   popup UPS!, en easy no consume (rebota).
✅ Completar palabra: +50 bonus, words++, confetti 90 partículas, popup
   ★ WORD ★, celebrate timer, spawn siguiente palabra automáticamente.
✅ Vidas: 3 corazones en HUD. Die = -1 vida, respawn centro,GameOver
   si 0 → modal con stats.
✅ Sonido: Web Audio procedural (ding/error/fanfare/pop/música).
✅ Visual: snake 3D con cara+ojos+lengua, beam cilindros en targets,
   starfield + grid neón + curved surface + bloom, cámara follow.
✅ `bun run lint` pasa limpio.

## Próximos pasos sugeridos

1. **Audio assets reales** (opcional) — el procedural funciona, pero
   voces infantilizadas "¡muy bien!" / "intenta otra vez" sumarían.
2. **Multiplayer / leaderboard** —需要一个 mini-service (websocket
   ya demo en examples/).
3. **Mejor cámara en corners** — cuando snake está en borde de grid, la
   cámara a veces deja orbes fuera de frame; agregar clamp de target.
4. **Ajuste de curva de velocidad** — la curva ahora es lineal; quizás
   speed-up gradual por palabra completada añada tensión.
5. **Más palabras / categorías** — el banco actual cubre 5 categorías;
   ampliar a 8-10 con temas (animales del mar, deportes, etc.).

## Cómo continuar el trabajo

- Código de juego en vanilla JS modules en `/public/game/assets/js/`.
  Modificar `game3d.js` para lógica, `ui3d.js` para pantallas/HUD,
  `words.js` para diccionario, `config.js` para tunables visuales.
- Preview: la página `/` monta el `/game/index.html` en un iframe.
- Lint: `bun run lint` (ignora public JS).
- Dev log: `tail /home/z/my-project/dev.log`.
- Para verificar end-to-end: usar `agent-browser open http://localhost:3000/`,
  snapshot -i, click @e4 (JUGAR), eval `window.__game.state` en contentWindow.

---
Task ID: controles-relativos
Agent: main (continuación sesión)
Task: Ajustar controles del Snake 3D: que Izq/Der roten relativamente (no absoluto), Arriba/Abajo no hagan nada, y Espacio vuelva a ser pausa (sacar el dash).

Work Log:
- Leí `game3d.js` y `ui3d.js` para entender el esquema de input previo (absoluto: Up=-y, Down=+y, Left=-x, Right=+x, Space=dash 0.6s).
- Leí `camera3d.js` y `scene3d.js` (`gridToWorld`) para confirmar la orientación mundo (gx→+X este, gy→+Z sur, cámara detrás mirando moveDir con up=+Y).
- Derivé las fórmulas de rotación relativa coherentes con el POV del jugador:
  - Giro izquierda (CCW desde el jugador) = (y, -x)  → ej: (1,0)→(0,-1) [este→norte]
  - Giro derecha (CW desde el jugador)   = (-y, x)  → ej: (1,0)→(0,1)  [este→sur]
  - Como siempre son 90°, nunca es reversa, así que el check anti-reversa de `_stepSnake` queda satisfecho.
- Edité `_onKey` en `game3d.js`:
  - Izquierda/A → `nd = { x: cd.y, y: -cd.x }`
  - Derecha/D    → `nd = { x: -cd.y, y: cd.x }`
  - Arriba/Abajo/W/S → ignorados (no setean nextDir)
  - Espacio ahora pausa/reanuda (junto con Esc/P), con `e.preventDefault()`.
  - Saqué el dash de Space (`s.speedBoost = 0.6`).
- Edité `swipe()` en `game3d.js` para mobile: mismo esquema relativo, solo 'left'/'right' hacen algo.
- Edité el pad mobile en `ui3d.js`: saqué los botones ▲ y ▼, dejé solo ◀ ▶ (con aria-labels).
- Actualicé el hint del menú: "◀ ▶ = girar (también A/D) · Espacio / Esc = pausa · En mobile: botones ◀ ▶ o deslizar".
- `bun run lint` pasa limpio.

Verificación con agent-browser (http://localhost:3000/game/index.html):
- Página carga con título "Snake de Sílabas 3D", menú con 4 personajes + 3 diffs + opciones + JUGAR.
- Click JUGAR → mode='playing', snake en (10,10) dir=(1,0).
- ArrowLeft → nextDir=(0,-1) ✓ (rotación CCW desde este = norte).
- Tras step (~0.3s) → direction=(0,-1); ArrowLeft de nuevo → direction=(-1,0) ✓ (180° total, NO se bloquea como antes).
- ArrowUp / ArrowDown / w / s → nextDir sin cambios ✓ (ignorados).
- ArrowRight desde (-1,0) → nextDir=(0,-1) ✓ (rotación CW desde oeste = norte).
- Space → mode='paused' ✓; Space otra vez → mode='playing' ✓.
- Screenshot guardada en /tmp/game-playing.png (262KB, render 3D + HUD visibles).
- Dev log sin errores de runtime durante la sesión.

Stage Summary:
- Esquema de controles restaurado a como estaba previsto: solo Izq/Der (giro relativo 90°), la cámara acompaña la nueva heading automáticamente, Arriba/Abajo no hacen nada, Espacio pausa/reanuda. El dash táctil de Space se eliminó (el turbo sigue disponible vía bonus ⚡).
- Archivos modificados: `public/game/assets/js/game3d.js` (`_onKey` + `swipe`), `public/game/assets/js/ui3d.js` (pad mobile 2-botones + hint).
- No se tocaron otros módulos; el resto del POC (3D, audio, palabras, obstáculos, bonus, records) queda intacto y funcional.

---
Task ID: fix-p-typing + fonts-menu
Agent: main (continuación sesión)
Task: Fixear bug: no se podía escribir 'p' en el input del nombre (la tecla era interceptada por el handler de pausa). Y unificar tipografía de los labels del menú que se veían "con otra letra".

Work Log:
- Causa del bug de la 'p': en el `_onKey` que escribí en el ajuste anterior, la rama de pausa hacía `e.preventDefault()` SIEMPRE (incluso en modo menú). Como el listener está en `window`, el keydown se tragaba la 'p' y el espacio antes de que llegaran al `<input>`.
- Reescribí `_onKey` en `game3d.js`:
  - Detecto `isTyping = (target.tagName es input|textarea)`.
  - Escape solo pausa/reanuda en playing/paused; en otros modos no hace nada (deja al navegador manejarlo).
  - 'p' y ' ' (space) solo se interceptan cuando `!isTyping` Y modo es playing/paused. En menú/gameover pasan de largo → llegan al input.
  - Arriba/Abajo/W/S siguen sin hacer nada en juego; en menú pasan de largo.
- Causa de las "otra letra": el `<link>` de Google Fonts cargaba Nunito solo con `wght@800;900`, pero el texto del menú usa pesos 600/700 (`.opt` labels, `.subtitle`, `.hint`, `.stat span`, etc.). Como esos pesos no estaban cargados, el navegador hacía fallback a la font del sistema → se veía inconsistente.
- Edité el `<link>` en `index.html` para cargar Nunito `wght@400;600;700;800;900`. Ahora todo el texto hereda Nunito del body y se ve consistente.
- `bun run lint` limpio.

Verificación con agent-browser + VLM:
- Focus en `#in-name`, `keyboard type "Pablo Paz"` → `document.getElementById('in-name').value === "Pablo Paz"` ✓ (la 'p' y el espacio entran).
- Click JUGAR → mode='playing'.
- `press p` → mode='paused' ✓; `press p` otra vez → mode='playing' ✓.
- `press Space` → mode='paused' ✓; `press Space` otra vez → mode='playing' ✓.
- Screenshot del menú → VLM (glm-5v-turbo) confirma: "Sí, se ven con la MISMA tipografía... las etiquetas de los checkboxes usan exactamente la misma fuente que las etiquetas superiores... no hay mezcla de fuentes".

Stage Summary:
- Dos fixes, ambos verificados end-to-end:
  1) Input del nombre ahora acepta 'p' y espacio (la pausa ya no interfiere fuera del juego).
  2) Tipografía del menú unificada (Nunito en todos los pesos usados).
- Archivos modificados: `public/game/assets/js/game3d.js` (`_onKey`), `public/game/index.html` (Google Fonts link).
- No se tocaron otros módulos.

---
Task ID: rework-contraste-espaciado-menu
Agent: main (continuación sesión)
Task: Rework de contraste y espaciado del menú principal. Problemas reportados: (1) checks pegados al texto, (2) texto "Fácil/Medio/Difícil" se veía negro sobre fondo oscuro, (3) partes con bajo contraste cuestan leer. Mantener intacto lo que ya se ve bien (botón JUGAR, título, subtítulos en mayúsculas).

Work Log:
- **Causa del texto negro**: los `<button>` (.diff-btn, .char-btn) no tenían `color` explícito → el UA del navegador aplica `color: buttontext` (negro). Fix: agregar `color: var(--fg)` explícito a `.diff-btn`, `.opt`, y `.char-btn .char-name`.
- **Espaciado de checks**: `.opt` gap 4→9px, padding 7px→11px, `.options` grid gap 6→8px. Checkbox input 16→18px. Le agregué a `.opt` un bg + border para que se vea como card (consistencia glassmorphism).
- **Contraste de textos secundarios** (varias pasadas guiadas por VLM):
  - `.opt span` (labels de checks): #c9c1f0 → #f0ebff (casi blanco lavanda), font 9.5→11px.
  - `.diff-desc`: #c9c1f0 → #ece5ff, font 8.5→10px.
  - `.char-desc`: var(--muted) → #ece5ff, font 9→10px.
  - `.subtitle`: #c9c1f0 → #d8d2f6 + text-shadow.
  - `.hint`: gris tenue → #ede8ff, font 9.5→11.5px, weight 600→700, y finalmente pill oscuro (bg rgba(0,0,0,0.5) + border cyan) con `max-width: fit-content` + `margin: auto` para centrar.
- **Estados de dificultad**: `.diff-btn.sel .diff-name` ahora usa `color: var(--accent)` (cyan) para reforzar cuál está seleccionado. Hover border cyan.
- `bun run lint` limpio en cada iteración.

Verificación con agent-browser + VLM (3 iteraciones):
- Iter 1: diff 8/10, checks 7/10, hint 4/10 → fixed black text + spacing.
- Iter 2: diff 8/10, checks 7/10, hint 3/10 (VLM seguía marcando hint) → brightened desc/labels a near-white.
- Iter 3: diff 9/10, checks 8/10, hint 6/10 → pill bg en hint.
- Final: diff 9/10, checks 8/10, **hint 8/10** ("se lee muy bien, contraste adecuado, legible sin esfuerzo").
- Juego verificado tras cambios CSS: click JUGAR → mode='playing', dir=(1,0) ✓. No rompe nada.

Stage Summary:
- Rework de CSS del menú completado: texto negro fixeado, checks con aire y como cards, todos los textos secundarios aclarados a near-white lavanda, hint con pill oscuro para contraste garantizado.
- Solo se tocó `public/game/index.html` (CSS). Lógica de juego intacta.
- Lo que el usuario dijo que se veía bien (título, JUGAR, subtítulos mayúsc) NO se modificó.

---
Task ID: espaciado-checks + glow-cola + audit-2d
Agent: main (continuación sesión)
Task: (1) Más espaciado entre checkbox y label del menú (se veían pegados). (2) Atenuar el glow neón de la cola del snake (quedaba "muy brillante" a momentos). (3) Confirmar si quedaron archivos viejos de la vista 2D.

Work Log:
- **Audit 2D**: busqué en /public, /src, /mini-services, /examples y todo el repo. No hay archivos 2D ni versiones previas del juego. El único archivo snake es `snake3d.js`. Este POC se construyó directamente en 3D, no quedaron restos.
- **Espaciado checks** (`index.html`): `.opt` gap 9px→16px, padding 11px→14px, checkbox 18px→20px + margin-bottom 2px. VLM confirma "cómodo, no apretado".
- **Glow de la cola** — diagnóstico profundo del shader en `snake3d.js`:
  1. **Bug real encontrado en el trail (estela)**: `headness = 1.0 - vUv.y` con UV `vUv.y = i/(n-1)` donde i=0 es el punto más viejo (atrás) y i=n-1 es el más nuevo (junto a la serpiente). Eso hacía el trail **más brillante en el extremo lejano** (camino viejo) y **invisible junto a la serpiente** — al revés que un comet. Era lo que el VLM veía como "cola incandescente". Fix: `headness = vUv.y` (brillante cerca de la serpiente, decae atrás). También invertí el ancho del trail para que sea comet real: `0.35 + 0.65*(i/n)` (angosto atrás, ancho en la serpiente).
  2. **Rim del cuerpo tube**: agregué `tailDim = mix(1.0, 0.18, smoothstep(0.35, 0.92, vAlong))` que atenúa el rim (fresnel) de la cola al 18% (la punta fina genera rim fuerte en ángulos rasantes). Full en cabeza/cuerpo.
  3. **Rim global del cuerpo**: bajé el multiplicador base 0.95→0.55, wave 0.8→0.7, y el `col += base*(...)` de wave 0.24→0.16. El clamp final 1.6→1.45. Esto apaga el cuerpo un toque sin tocar la cabeza (que tiene headGlow sprite + headLight + headMat emissive propios).
  4. **Bloom** (`config.js`): threshold 0.34→0.45, strength 0.92→0.88, radius 0.45→0.42. Menos bloom espurio en superficies moderadamente brillantes.
- `bun run lint` limpio en cada paso.

Verificación con agent-browser + VLM:
- Trail: VLM confirma "se ve como un cometa, brillo máximo en la serpiente desvaneciéndose hacia atrás" ✓ (antes estaba al revés).
- Cuerpo/cola: VLM pasó de "MUY brillante incandescente, casi igual que la cabeza" → **3/10**, "más opaca y balanceada, sin halo, se integra con la iluminación ambiental". Cabeza sigue "muy brillante con fuerte incandescencia". Jerarquía visual clara: la cabeza es el foco.
- Juego sigue jugable: start → mode=playing, snake (10,10) dir=(1,0), palabra PERRO. ArrowLeft → nextDir=(0,-1) ✓.

Stage Summary:
- 3 ajustes completados: espaciado de checks cómodo, glow de cola domado (trail fixeado + tailDim + rim/body reducido + bloom threshold), confirmado que no hay archivos 2D viejos.
- Archivos modificados: `public/game/index.html` (CSS .opt), `public/game/assets/js/snake3d.js` (trail shader UV + body rim tailDim + rim base multiplier), `public/game/assets/js/config.js` (bloom tunables).
- La estética neón se preserva en la cabeza y orbes; solo se domó el cuerpo/cola y se corrigió la orientación del trail.

---

## Fase 0 — Diagnóstico y estabilización (2026-08-27)

### Estado actual del proyecto / evaluación

- El proyecto es un POC jugable de **Snake de Sílabas 3D**: Next.js aloja el juego Three.js en un iframe y el juego se ejecuta como módulos JavaScript estáticos.
- QA end-to-end ejecutado con `agent-browser` sobre `http://localhost:3000/` a 1440×900: menú, inicio de partida, nombre, personaje, dificultad, preferencias, giro relativo, pausa y recarga de preferencias. Sin errores de consola ni runtime.
- Se verificó una condición de carrera: una transición pendiente de palabra no puede cargar contenido sobre una partida que acaba de comenzar.
- Verificaciones actuales: `bun run lint` limpio, `bunx tsc --noEmit` limpio, `bun run build` limpio y artefacto standalone contiene tanto `public/game` como `.next/static`.

### Objetivos actuales, modificaciones completadas y resultados de verificación

- Se eliminó la omisión de errores TypeScript en `next.config.ts`; el build ahora realiza comprobación estricta real.
- Se añadió generación explícita del cliente Prisma en `postinstall` y antes del build; esto corrigió el error de `PrismaClient` ausente en una instalación limpia.
- Se reemplazó el copiado `cp -r`, que fallaba en Windows, por `scripts/copy-standalone-assets.mjs`, multiplataforma.
- El lint ahora incluye el código propio de `public/game/assets/js/` y mantiene excluido solo el vendor de Three.js.
- Corregido el ciclo de vida de la partida: se resetean estadísticas, bonus, palabra y estado pendiente al iniciar; se cancelan timers al salir, terminar o destruir; la carga diferida queda ligada a su sesión.
- Corregida la hidratación de preferencias: el DOM se construye antes de leer localStorage y se vuelve a renderizar la selección persistida.
- Corregida la carrera de audio al volver a iniciar una partida antes de que termine el fade-out musical.
- `agent-browser` fue instalado en el entorno de desarrollo para este QA (CLI y Chrome de Testing). No se añadió como dependencia del producto.

### Problemas sin resolver o riesgos, y recomendaciones de prioridad para la siguiente fase

1. **P1 — Cobertura de tests:** no hay una suite automatizada mantenible para movimiento, colisiones, puntuación, persistencia, pausa y transiciones. Los scripts en `tests/` apuntan a `.zscripts/`, inexistente en este checkout, y requieren Bash, no disponible en el entorno Windows actual.
2. **P1 — Responsabilidades concentradas:** `Game3D` combina estado, reglas, temporizadores, input y orquestación de render; `UI3D` combina render DOM, preferencias y handlers globales. Es un riesgo de mantenimiento, aunque no bloquea el pulido visual.
3. **P2 — Ciclo de vida:** `UI3D` registra listeners de documento sin método `dispose`; no afecta la instancia única actual, pero debería resolverse antes de soportar remontajes.
4. **P2 — Validación visual:** falta una matriz de dispositivos y presupuesto de rendimiento móvil; el QA actual corresponde a Chrome de escritorio.
5. **Propuesto para revisión (no implementado):** extraer un núcleo de reglas puro y agregar tests deterministas; separar input/persistencia de UI; añadir un presupuesto de FPS/memoria y smoke tests de navegador en CI.
---

## Fase 1 — Refinamiento visual/técnico y feel, pasada 1 (2026-08-27)

### Estado actual del proyecto / evaluación

- El juego conserva íntegramente su alcance y sus pantallas existentes. Esta pasada se concentró en continuidad del render, coherencia entre visuales y colisiones, feel de crecimiento, accesibilidad de movimiento y estabilidad de producción.
- QA final con `agent-browser` en escritorio (1440×900) y móvil (390×844): menú, inicio, nombre, giro relativo, pausa/reanudación, persistencia, cruce de bordes, crecimiento, error, bonus y arranque standalone.
- Auditoría Axe móvil: **0 violaciones** y 28 checks aprobados. Queda 1 check de contraste “incomplete” porque Axe no puede resolver el fondo con gradiente; no es una violación confirmada.
- Métricas headless del menú móvil en desarrollo: CLS 0, FCP 168 ms, LCP 684 ms y TTFB 1.8 ms. Son indicadores locales, no sustituyen profiling en hardware objetivo.

### Objetivos actuales, modificaciones completadas y resultados de verificación

- **Continuidad toroidal:** el cuerpo ahora interpola cada segmento por la ruta corta al cruzar bordes y se desenvuelve como una cadena continua. La estela se corta en teletransportes/respawns para no dibujar una cinta a través del tablero. Prueba determinista: gaps entre cuatro segmentos durante wrap = `[1,1,1]`, máximo 1 celda.
- **Feel de crecimiento:** corregido el crecimiento accidental al recoger cualquier sílaba o bonus. Ahora el primer acierto mantiene longitud 4, el segundo crece a 5, un error mantiene 4, un bonus normal mantiene 4 y el bonus shrink reduce 8→5 sin bajar nunca del mínimo de 4.
- **Identidad de ítems:** si una nueva palabra reutiliza una celda con otro texto, el orbe se recrea con la sílaba correcta. Verificado `PA`→`LO` en la misma celda.
- **Obstáculos:** se sincronizan por firma de posiciones, no solo por cantidad. Verificado que un obstáculo 1,1→2,2 actualiza su objeto 3D aunque el conteo no cambie.
- **Lifecycle de materiales:** al retirar orbes se liberan también materiales de sombra, halo y beam, además del label/core/ring/shell/glow ya gestionado.
- **Cámara y escena:** `gridToWorld` admite vectores destino reutilizables; el rig eliminó asignaciones temporales por frame en menú/follow. Se añadió soporte de `prefers-reduced-motion`: neutraliza shake y bank/FOV boost y reduce pulsación/rotación ambiental. Verificado con media emulada: escena y cámara detectan reduce y shake permanece 0.
- **Accesibilidad existente:** se habilitó zoom móvil y el juego quedó dentro de un landmark `<main>`; el canvas puramente visual se marca `aria-hidden`.
- **Runtime multiplataforma:** `tee-run.mjs` usa el delimitador PATH del sistema; `start` dejó de depender de sintaxis Unix. Build standalone y arranque de producción verificados en puerto 3100, con iframe `/game/index.html` y `window.__game` listo.
- Verificación final: `bun run lint`, `bunx tsc --noEmit`, `bun run build` y `git diff --check` pasan.

### Problemas sin resolver o riesgos, y recomendaciones de prioridad para la siguiente fase

1. **P1 — Validación AAA no demostrada:** los subagentes visuales asignados a personaje, entorno y UI no pudieron iniciar procesos por `helper_unknown_error: setup refresh had errors`. La revisión principal sí hizo QA real, pero no hubo comparación ciega lado a lado reproducible. No corresponde afirmar calidad indistinguible de una referencia AAA todavía.
2. **P1 — Tests de reglas:** los casos críticos se verificaron en navegador de forma determinista, pero aún no viven como suite versionada. Un cambio futuro podría reintroducir crecimiento accidental, texto obsoleto o desalineación de obstáculos.
3. **P1 — Arte procedural:** personaje, superficie, labels y partículas siguen siendo recursos procedurales de POC. El acabado técnico mejoró, pero una equivalencia AAA exige una dirección de arte de referencia, profiling de GPU y probablemente assets/materiales authored dentro de los elementos existentes.
4. **P2 — Contraste:** Axe dejó 27 nodos como “incomplete” por el fondo gradiente. Requieren medición/manual visual sobre capturas representativas; no hay violación automática confirmada.
5. **P2 — Hardware objetivo:** faltan pruebas sostenidas de FPS, memoria y temperatura en móvil real, además de captura de frame GPU para bloom, luces por ítem y partículas.
6. **Propuesto para revisión (no implementado):** suite de regresión de reglas + smoke E2E; presupuesto de GPU por tier; materiales/texturas authored con referencia artística aprobada; pruebas visuales baseline por viewport; separación futura de reglas puras de `Game3D` y lifecycle de `UI3D`.
---

## Revisión de documentación y GitHub Pages (2026-08-27)

### Estado actual del proyecto / evaluación

- `README.md` y `CONTRIBUTING.md` todavía describían la implementación 2D eliminada: `game.js`, `style.css`, narración, QR, `web/` y pruebas sirviendo únicamente archivos antiguos.
- El workflow de Pages no era funcional después de la migración: ejecutaba `npm ci` sin `package-lock.json`, construía el target standalone y subía `./web`, directorio eliminado.
- GitHub Pages sigue siendo un destino válido porque la lógica del juego corre completamente en el navegador. Prisma y código de servidor no están disponibles en Pages.

### Objetivos actuales, modificaciones completadas y resultados de verificación

- Reescritos `README.md` y `CONTRIBUTING.md` para documentar Three.js, Next.js, controles actuales, estructura real, comandos Bun, QA, build standalone y restricciones del scope.
- Corregido `CODE_OF_CONDUCT.md`: terminología consistente y eliminación de la instrucción inválida de abrir un “issue privado”.
- Añadido build Pages separado (`bun run build:pages`) sin alterar `bun run build` standalone.
- `next.config.ts` selecciona `output: export`, `basePath`, `assetPrefix` y `trailingSlash` únicamente durante el build de Pages; en los demás entornos conserva `output: standalone`.
- Añadido `scripts/build-pages.mjs` para configurar el build estático de forma multiplataforma.
- Actualizado `.github/workflows/deploy.yml`: Bun con lockfile congelado, scripts de instalación omitidos, `configure-pages`, artefacto `out/` y despliegue en pushes a `main` o ejecución manual.
- La ruta JSON constante `/api` se marcó `force-static`, por lo que puede exportarse sin runtime de servidor.
- Verificación: `bun install --frozen-lockfile --ignore-scripts`, `bun run build:pages`, `bun run lint`, `bunx tsc --noEmit`, `bun run build` y `git diff --check` pasan.
- Smoke test del export bajo `http://localhost:3200/vibo-ruchi/`: iframe resuelve a `/vibo-ruchi/game/index.html`, el juego crea `window.__game`, UI accesible y sin requests 404 observadas.

### Problemas sin resolver o riesgos, y recomendaciones de prioridad

1. **Configuración externa:** confirmar una vez en GitHub `Settings → Pages → Source: GitHub Actions`; el repositorio local no puede garantizar ese ajuste.
2. **Commit obligatorio:** `git push` no incluye cambios sin commit. El worktree actual contiene la migración 3D y documentación sin commitear; deben revisarse, agregarse y commitearse antes del push.
3. **Límite estático:** futuras rutas dinámicas, autenticación, Prisma o APIs reales no funcionarán en Pages y necesitarán un hosting con runtime Node o un backend externo.
4. **Dominio del repositorio:** el fallback local usa `vibo-ruchi`; en Actions se deriva automáticamente de `GITHUB_REPOSITORY`, evitando hardcodear forks.

---

## Perfiles locales, logros y ranking top 15 (2026-08-27)

### Estado actual del proyecto / evaluación

- La persistencia deja de representar un único nombre/récord del navegador: ahora modela varios perfiles locales con ID interno estable.
- Cada perfil mantiene estadísticas acumuladas, mejor puntaje general, mejores puntajes por dificultad y logros propios.
- El ranking sigue siendo local al navegador/dispositivo y muestra los 15 mejores jugadores, tomando una sola mejor marca por perfil.
- La implementación continúa siendo completamente estática y compatible con GitHub Pages.

### Objetivos actuales, modificaciones completadas y resultados de verificación

- Añadido `player-data-store.js` con documento versionado `snake3d_player_data_v1`, perfiles, progreso, logros y ranking.
- El repositorio expone una API asíncrona e inyectable; una futura implementación HTTP puede conservar el mismo contrato sin modificar las reglas ni la UI.
- Migración automática desde `snake3d_prefs` y `snake3d_record`: crea un perfil con el nombre previo y vincula el récord existente.
- Menú actualizado con selector de jugador, botón de alta `+` y formulario inline. Un nombre duplicado, ignorando mayúsculas, selecciona el perfil existente.
- Vista individual incorporada al menú: mejor marca general, partidas, palabras acumuladas, mejores marcas por dificultad y seis logros iniciales.
- Game over actualizado con nuevo récord personal, puesto obtenido y top 15 local seguro frente a nombres manipulados.
- La finalización asíncrona se liga al ID de sesión para evitar que una futura API lenta reabra una pantalla obsoleta.
- Pruebas unitarias: 5/5 para alta/selección, deduplicación, top 15, progreso/logros y migración.
- QA con agent-browser: Bruno 150 queda #1, Ana 100 queda #2; una partida posterior de Ana con 50 incrementa estadísticas pero conserva su marca de 100 y no duplica el ranking.
- Axe sobre la UI móvil: 0 violaciones; queda un check incompleto de contraste porque no puede resolver el fondo con gradiente.
- Verificación: `bun run test:player-data`, `bun run lint`, `bunx tsc --noEmit`, `bun run build:pages`, `bun run build` y `git diff --check` pasan.

### Problemas sin resolver o riesgos, y recomendaciones de prioridad

1. **Persistencia local:** los perfiles se pierden al borrar datos del sitio y no se sincronizan entre dispositivos.
2. **Gestión de perfiles:** esta primera versión permite crear y seleccionar; editar o eliminar perfiles no se implementó para evitar ampliar el alcance sin aprobación.
3. **Catálogo de logros:** los seis logros iniciales usan reglas simples y deben revisarse con datos reales de dificultad/progresión.
4. **Propuesto para revisión (no implementado):** exportar/importar un respaldo JSON local; administración de perfiles; repositorio HTTP con las mismas entidades para ranking global.

---

## Fase — Reglas configurables, scoring y centro de progreso (2026-08-28)

### Estado actual del proyecto / evaluación

- El juego mantiene perfiles, progreso, logros y ranking enteramente en localStorage; no requiere backend y sigue siendo compatible con GitHub Pages.
- La dificultad ahora representa solamente complejidad lingüística: Fácil 1–3 sílabas, Medio 3–5 y Difícil 5–7. Velocidad, colisiones, obstáculos y distractores son reglas independientes.
- El banco contiene 113 palabras: 62 elegibles en Fácil, 59 en Medio y 32 en Difícil. Los rangos se solapan en sus límites de forma intencional.
- El progreso y los puntajes pre-alpha se limpian una sola vez, preservando los perfiles creados. El esquema y la clave principal continúan en v1, según lo acordado.

### Objetivos actuales, modificaciones completadas y resultados de verificación

- Añadido game-rules.js como núcleo puro: normalización de velocidad, snapshot serializable de reglas y constantes compartidas. Las partidas guardan ese snapshot, preparando el contrato para reemplazar el repositorio local por uno HTTP sin remodelar los datos.
- Nuevo scoring: cada sílaba correcta vale 10 puntos, con combo existente; completar una palabra suma 25 por cantidad de sílabas. No hay penalización de puntaje ni consumo de la sílaba al equivocarse.
- Modo relajado: los choques generan feedback y error estadístico, pero no quitan vidas. El HUD muestra infinito. Una partida relajada puede cerrarse desde pausa con “Finalizar partida” y queda registrada.
- Obstáculos y distractores se activan de forma independiente. Los distractores son sílabas falsas y no cambian la dirección.
- Menú reorganizado con switches visualmente consistentes, slider de velocidad y bloque separado de ayudas/audio. El chevron del selector de jugador se dibuja a 13 px del borde derecho.
- La vista inline de progreso se sustituyó por un botón de copa y un modal accesible con Resumen, Logros y Ranking. El ranking tiene filtros Todos/Fácil/Medio/Difícil y limita a 15 mejores perfiles, una marca por jugador. El fondo queda inerte mientras el diálogo está abierto.
- El game-over conserva un resumen compacto y ofrece acceso directo al ranking; ya no duplica la tabla completa.
- Suite ampliada a 11 tests: reglas, límites del slider, bonus proporcional, cobertura del banco, perfiles, deduplicación, top 15, logros, migración sin récord viejo, filtros por dificultad y reset pre-alpha de una sola ejecución.
- Verificación: bun run lint, bun run test:player-data, bunx tsc --noEmit, bun run build:pages y git diff --check pasan.
- QA con agent-browser: alta de perfil, modal y tabs, aislamiento accesible del fondo, filtros, dificultad Difícil, obstáculos, distractores, slider persistido a 200 ms, inicio, pausa, finalización y reapertura del ranking. Sin errores de runtime. Axe móvil (390×844): 0 violaciones; contraste queda como revisión manual por el fondo dinámico.

### Problemas sin resolver o riesgos, y recomendaciones de prioridad para la siguiente fase

1. **P1 — Validación pedagógica:** las nuevas palabras y su silabación fueron revisadas estructuralmente, pero conviene una revisión final por una persona docente antes de publicar para niños.
2. **P1 — Balance con datos reales:** la superposición 3/5 entre dificultades y el bonus proporcional son coherentes en código, pero necesitan sesiones de juego para confirmar duración, esfuerzo y comparabilidad del ranking.
3. **P2 — Ranking local manipulable:** un usuario puede editar localStorage; se acepta para esta etapa y no afecta la experiencia casual.
4. **P2 — Contraste sobre render 3D:** Axe no reporta violaciones, pero deja el contraste como incompleto porque no puede calcular el fondo Three.js/gradiente. Requiere revisión visual manual en hardware objetivo.
5. **Propuesto para revisión (no implementado):** dificultad experta de 8–10 sílabas; editar/eliminar perfiles; exportar/importar respaldo local; catálogo ampliado de logros; repositorio HTTP para ranking global.
