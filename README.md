# Snake de Sílabas 3D

Juego educativo infantil para practicar lectura y formación de palabras mientras se controla una serpiente en un escenario 3D hecho con Three.js.

## Estado actual

El juego fue migrado por completo desde la implementación 2D original. La versión activa incluye:

- Render 3D con Three.js, cámara de seguimiento, iluminación, bloom, shaders y calidad dinámica.
- Cuatro personajes, tres dificultades y banco de palabras en español.
- Sílabas objetivo y distractoras, obstáculos, combos, vidas y bonus.
- Controles relativos por teclado, swipe y botones táctiles.
- Audio procedural con Web Audio API, música ambiental y preferencias persistidas en `localStorage`.
- Menú, HUD, pausa y pantalla de resultados adaptables a escritorio y móvil.

No quedan dependencias funcionales de la antigua vista 2D. `worklog.md` contiene el historial técnico y las verificaciones más recientes.

## Controles

- `←` / `A`: girar a la izquierda.
- `→` / `D`: girar a la derecha.
- `Espacio`, `P` o `Esc`: pausar o reanudar.
- Móvil: botones izquierda/derecha o swipe horizontal.

La serpiente avanza automáticamente. Arriba y abajo no cambian la dirección.

## Desarrollo local

Requisitos recomendados: Node.js 20+ y Bun.

```bash
bun install
bun run dev
```

Abrí `http://localhost:3000/`. También se puede servir `public/` directamente para probar únicamente el juego estático, pero la entrada oficial del proyecto es la aplicación Next.js.

## Verificación

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

`bun run build` genera el artefacto standalone de Next.js. Para probarlo:

```bash
bun run start
```

## GitHub Pages

El proyecto conserva un build estático específico para GitHub Pages:

```bash
bun run build:pages
```

Ese comando genera `out/` con el `basePath` del repositorio. El workflow `.github/workflows/deploy.yml` publica esa carpeta cuando se hace push a `main`.

Para el primer despliegue, en GitHub configurá **Settings → Pages → Build and deployment → Source: GitHub Actions**. La URL prevista es:

`https://apmauj.github.io/vibo-ruchi/`

GitHub Pages solo sirve contenido estático. El juego funciona allí porque toda su lógica corre en el navegador; una futura funcionalidad que necesite API, Prisma o procesamiento del lado servidor requerirá otro hosting.

## Estructura relevante

- `src/app/page.tsx`: entrada Next.js que monta el juego.
- `public/game/index.html`: canvas y estilos de la experiencia 3D.
- `public/game/assets/js/game3d.js`: reglas, estado y loop principal.
- `public/game/assets/js/scene3d.js`: escena, renderer y postprocesado.
- `public/game/assets/js/snake3d.js`: personaje, cuerpo, shaders y estela.
- `public/game/assets/js/items3d.js`: sílabas, bonus y obstáculos.
- `public/game/assets/js/ui3d.js`: menú, HUD y pantallas.
- `worklog.md`: estado técnico, verificaciones y riesgos conocidos.

## Contribuir y licencia

Consultá `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md` antes de abrir un PR. El proyecto se distribuye bajo la licencia MIT incluida en `LICENSE`.
