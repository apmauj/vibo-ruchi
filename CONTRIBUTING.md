# Contribuir

Gracias por querer contribuir a `vibo-ruchi`, Snake de Sílabas 3D.

## Flujo de trabajo

- Hacé fork del repositorio y creá una rama descriptiva, por ejemplo `feat/descripcion` o `fix/descripcion`.
- Mantené los commits pequeños y enfocados.
- Abrí el PR contra `main` e incluí descripción, pasos de verificación y capturas cuando cambie la presentación visual.
- Revisá `worklog.md` antes de empezar para evitar reintroducir problemas ya resueltos.

## Arquitectura y estilo

- La aplicación contenedora usa Next.js y TypeScript en `src/`.
- El juego usa módulos JavaScript y Three.js en `public/game/assets/js/`.
- La UI y sus estilos viven actualmente en `public/game/index.html` y `ui3d.js`; la antigua hoja `public/game/assets/css/style.css` ya no existe.
- Conservá los tunables compartidos en `config.js` y evitá números mágicos nuevos.
- No edites archivos dentro de `public/game/assets/js/vendor/` salvo que estés actualizando deliberadamente la versión vendorizada de Three.js.
- No agregues pantallas, reglas o controles nuevos sin acordar primero el cambio de alcance.

## Verificación requerida

Antes de abrir un PR ejecutá:

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

Para cambios jugables o visuales, verificá además en navegador:

- menú e inicio de partida;
- controles, pausa y reanudación;
- viewport de escritorio y móvil;
- consola sin errores;
- flujo específico afectado por el cambio.

Los paths críticos todavía no tienen una suite automatizada completa. Si modificás reglas de movimiento, colisiones, puntuación, crecimiento o persistencia, agregá una prueba reproducible o documentá el caso exacto en el PR.

## GitHub Pages

Los cambios de despliegue estático deben pasar también:

```bash
bun run build:pages
```

El resultado debe quedar en `out/` y funcionar bajo el subpath `/vibo-ruchi/`. No introduzcas dependencias de servidor en el juego publicado por Pages.

## Licencia

Al contribuir aceptás que tu contribución se distribuya bajo la licencia MIT del repositorio.
