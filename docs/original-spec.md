# Spec — Juego Infantil Educativo “Snake de Sílabas”

## Concepto General

Juego educativo infantil inspirado en el clásico “Snake”, desarrollado en HTML, CSS y JavaScript, orientado a practicar lectura, reconocimiento de sílabas y formación de palabras.

El jugador controla una viborita amigable que debe “comer” sílabas en el orden correcto para completar palabras. Cada palabra completada suma puntos y genera una nueva.

El objetivo es combinar:

* aprendizaje de lenguaje,
* reflejos suaves,
* recompensa visual,
* accesibilidad para niños pequeños,
* partidas relativamente largas y relajadas.

---

# Objetivos Pedagógicos

* Reconocimiento de sílabas
* Formación de palabras
* Lectura progresiva
* Asociación visual y fonética
* Refuerzo positivo mediante animaciones y sonidos

---

# Público Objetivo

* Niños/as de 4 a 9 años
* Compatible con:

  * PC
  * tablets
  * notebooks
* Control:

  * teclado
  * touch/swipe opcional

---

# Stack Tecnológico

## Frontend

* HTML5
* CSS3
* JavaScript Vanilla

## Render

* Canvas 2D (recomendado)
  o
* DOM + CSS Grid (más simple)

## Assets

* SVG inline para personajes
* Emojis nativos para bonus
* Sonidos `.mp3/.ogg`

---

# Estructura General

## Pantallas

### 1. Pantalla de Inicio

Incluye:

* Logo del juego
* Nombre del jugador
* Selector de personaje
* Selector de dificultad
* Opciones adicionales
* Botón “Comenzar”

---

## 2. Pantalla de Juego

Elementos visibles:

### HUD Superior

* Nombre del jugador
* Score
* Palabras completadas
* Barra/progreso de palabra
* Tiempo opcional

### Área de Juego

* Tablero cuadrícula
* Viborita
* Sílabas distribuidas
* Bonus/frutas/emojis

### Panel de Palabra

Mostrar:

* palabra objetivo
* sílabas resaltadas
* progreso

Ejemplo:

CASA

* CA ✓
* SA ⬜

---

## 3. Pantalla Final

Mostrar:

* Score total
* Cantidad de palabras
* Récord personal (localStorage)
* Mensaje motivacional
* Botón “Jugar otra vez”

---

# Gameplay

## Mecánica Principal

1. Se selecciona una palabra aleatoria.
2. La palabra se divide en sílabas.
3. Las sílabas aparecen distribuidas en el tablero.
4. El jugador debe comerlas en orden.
5. Cada sílaba correcta:

   * suma puntos
   * reproduce animación
   * avanza progreso
6. Completar la palabra:

   * genera celebración
   * agrega bonus
   * aparece nueva palabra

---

# Sistema de Palabras

## Formato

```js
[
  {
    palabra: "CASA",
    silabas: ["CA", "SA"]
  },
  {
    palabra: "PELOTA",
    silabas: ["PE", "LO", "TA"]
  }
]
```

---

## Categorías sugeridas

* Animales
* Colores
* Objetos
* Frutas
* Transporte
* Verbos simples

---

## Dificultad progresiva

### Fácil

* palabras de 2 sílabas
* velocidad lenta
* tablero grande
* errores permitidos

### Medio

* 2–3 sílabas
* velocidad normal
* algunos obstáculos

### Difícil

* 3–5 sílabas
* velocidad mayor
* colisiones activas
* sílabas distractoras

---

# Mecánica de Error

## Modo Fácil

Si come sílaba incorrecta:

* NO pierde
* viborita se sacude
* sonido suave “oops”
* sílaba rebota
* breve pausa

Objetivo:
evitar frustración infantil.

---

## Modo Medio/Difícil

Opciones:

* perder puntos
* acortar viborita
* perder una vida
* game over opcional

---

# Movimiento

## Controles

### Desktop

* Flechas
  o
* WASD

### Mobile

* Swipe
* Botones táctiles opcionales

---

# Sistema de Crecimiento

Importante:
la serpiente NO debe crecer demasiado rápido.

## Regla recomendada

Crecer:

* +1 segmento cada 2 sílabas correctas
  o
* +1 por palabra completa

Esto permite:

* partidas más largas
* menos frustración
* mejor control

---

# Sistema de Score

## Puntos

### Correcto

+10

### Palabra completa

+50

### Bonus fruta

+25

### Combo rápido

multiplicador x2

---

# Bonus y Emojis

## Objetivo

Hacer el tablero más divertido y dinámico.

---

## Ejemplos

### Frutas

🍎 🍌 🍓 🍇

### Extras

⭐ ❤️ ⚡ 🎈

---

## Efectos posibles

### 🍎

Más puntos

### ⭐

Invencibilidad breve

### ⚡

Velocidad temporal

### ❤️

Vida extra

### 🎈

Reduce tamaño de viborita

---

# Personajes

## Viboritas SVG

Cada personaje:

* colores diferentes
* expresiones amigables
* animaciones simples

---

## Ejemplos

### Verde

“Lili”

### Azul

“Toto”

### Rosa

“Mimi”

### Amarilla

“Sol”

---

# Animaciones

## Recomendación

CSS animations + pequeñas transiciones JS.

---

## Eventos importantes

### Comer sílaba correcta

* brillo
* partículas
* rebote
* sonido positivo

### Error

* shake
* color rojo breve

### Palabra completada

* confetti
* flash
* salto de viborita

### Game Over

* animación lenta
* pantalla amigable

---

# Sonidos

## Recomendados

### Correcto

“ding”

### Error

“boop”

### Completar palabra

mini fanfarria

### Bonus

pop divertido

### Música

loop suave infantil

---

# Opciones del Menú

## Checkbox importantes

### Mostrar palabra completa

✔ recomendado para niños pequeños

Si está desactivado:
solo se muestran guiones:

---

o sílabas vacías:

⬜ ⬜ ⬜

---

### Activar sonidos

### Música

### Modo relajado

Sin game over

---

# Diseño Visual

## Estilo

* Colorido
* Rounded UI
* Friendly
* Mucho espacio visual
* Alto contraste

---

## Paleta sugerida

* celeste pastel
* verde suave
* amarillo
* coral
* violeta suave

---

# Accesibilidad

## Muy importante

### Tipografía

* grande
* legible
* sans serif

### Botones

* grandes
* táctiles

### Feedback

* visual + auditivo

### Daltonismo

No depender solo del color.

---

# Arquitectura Técnica

## Estructura sugerida

```txt
/src
  /assets
  /audio
  /svg
  /words
  game.js
  snake.js
  board.js
  ui.js
  audio.js
  particles.js
  storage.js
```

---

# Sistema de Estados

```js
MENU
PLAYING
PAUSED
WORD_COMPLETE
GAME_OVER
```

---

# Persistencia

Usar `localStorage` para:

* récord
* personaje favorito
* dificultad elegida
* sonido activado

---

# Sistema de Palabras Inteligente (Muy Recomendado)

Evitar:

* repetir palabras recientes
* sílabas difíciles consecutivas
* palabras demasiado largas al inicio

---

# Sugerencias Extra (MUY recomendables)

## 1. Narración por Voz

Cuando aparece una palabra:

* pronunciarla
* pronunciar sílabas

Ejemplo:
“PE-LO-TA”

Esto suma muchísimo valor educativo.

---

## 2. Modo Cooperativo Local

2 jugadores:

* uno mueve
* otro lee

Ideal para padres e hijos.

---

## 3. Modo Letras

Variante avanzada:
en vez de sílabas → letras.

---

## 4. Sistema de Recompensas

Desbloquear:

* skins
* colores
* sombreros
* efectos

Mantiene motivación infantil.

---

## 5. Minijefes Educativos

Cada X palabras:
aparece un desafío:

* ordenar sílabas
* elegir palabra correcta
* memoria visual

---

# Recomendaciones Técnicas Importantes

## FPS

Mantener lógica desacoplada del render.

---

## Tamaño de Grid

Recomendado:

```txt
20 x 20
```

---

## Velocidades

### Fácil

120–150 ms

### Medio

90–110 ms

### Difícil

60–80 ms

---

# Roadmap de Desarrollo

## MVP

### Fase 1

* tablero
* movimiento
* sílabas
* score

### Fase 2

* menú
* personajes
* dificultad

### Fase 3

* animaciones
* sonidos
* bonus

### Fase 4

* mobile
* voz
* guardado

---

# Ideas Futuras

* Multiplayer online
* Ranking escolar
* Editor de palabras
* Modo inglés/español
* Integración educativa para docentes
* Niveles temáticos
* Eventos diarios

---

# Nombre Tentativos

* SilabiSnake
* VibraSílabas
* SnakePalabras
* Sílaba Quest
* La Viborita Lectora
* Snake de Letras
* Ssssílabas
* PalabraSnake

---

# Recomendación General de UX

La clave del juego debería ser:

* bajo castigo,
* feedback positivo constante,
* partidas largas,
* sensación de descubrimiento,
* animaciones tiernas,
* aprendizaje “sin sentirse tarea”.

Ese enfoque suele funcionar muchísimo mejor en juegos infantiles educativos.
