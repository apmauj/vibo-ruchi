# Snake de Sílabas

Juego educativo infantil (HTML/CSS/JS) para practicar lectura y formación de palabras.

Resumen rápido
- Implementa la mayoría de las funcionalidades del spec: menú, selección de personaje, dificultad, HUD, tablero en canvas, sistema de palabras por categorías, gestiona sílabas distractoras, audio (WebAudio), narración (SpeechSynthesis), efectos (particles), almacenamiento en `localStorage`, pantalla de pausa y game over.
- Añadido un botón flotante que genera un QR para compartir la URL del juego (`/public/game/index.html`).

Cómo probar localmente
1. Desde la raíz del repo sirve la carpeta `public` (ejemplo con Python):

```bash
cd public
python -m http.server 8000
# luego abrir http://localhost:8000/game/index.html
```

2. Alternativa con `npx serve`:

```bash
npx serve public
# o desde la raíz: npx serve .
```

Estructura relevante
- `public/game/index.html` – juego estático, assets y el nuevo modal QR
- `public/game/assets/js/game.js` – lógica principal (palabras, juego, audio, almacenamiento)
- `public/game/assets/css/style.css` – estilos del juego
- `docs/original-spec.md` – especificación original (fuente de verdad)

Estado vs spec (resumen)
- Hecho: Menú, HUD, panel de palabra, sistema de palabras y categorías, dificultad, almacenamiento, sonidos, música, narración por voz, partículas, mobile controls básicos, overlay de pausa y game over, boton QR.
- Parcial: Sistema de crecimiento (ajustable pero presente), power-ups básicos y bonus visuales (partículas), desbloqueo de skins (almacenamiento implícito), performance y tests automatizados no incluidos.
- Faltante/No implementado: Multijugador, editor de palabras, integración contínua de tests, internacionalización multi-idioma, empaquetado como componente React/Next.js.

Licencia
Este repositorio incluye una licencia MIT en `LICENSE`.

Contribuir
Lee `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md` para normas rápidas de contribución.

Contacto
Abre issues o PRs en el repositorio para discutir cambios.
