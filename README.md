# Bloodwood Bowmen: Night Orchard

Public mobile-first archer duel game.

- Live: https://brunomanti.github.io/bloodwood-bowmen/
- Build: `bloodwood-bowmen-v20260620-0132-night-orchard`
- Full-screen landscape canvas with only a Menu button visible during play.
- Visual direction: cinematic moonlit orchard, ember/gold target explosions, painterly silhouettes, dramatic silhouettes instead of toy/cartoon figures.
- Controls: robust pointer + touch + mouse drag-to-draw support for iOS standalone/PWA, Safari, Chrome, and desktop smoke tests.
- Menu: resilient touch/click open/close, fullscreen, iOS install help, zoom, and all levels open.
- No in-game log-download feature. Hermes/session logs document the app creation process; runtime telemetry is kept local only for debugging.
- PWA/iOS installation support: manifest, service worker, Apple touch icon, standalone/fullscreen settings, landscape orientation, and in-game Add to Home Screen instructions.

## Develop

```bash
npm test
python3 -m http.server 4177
```

## Backend logger

The backend logger remains available for a Node deployment target if needed:

```bash
npm run backend
```

GitHub Pages is static, so app-creation logging is handled by Hermes/session logs rather than a game UI button.
