# Bloodwood Bowmen: True Draw

Public mobile-first archer duel game.

- Live: https://brunomanti.github.io/bloodwood-bowmen/
- Build: `bloodwood-bowmen-v20260620-0017-true-draw`
- Full-screen landscape canvas with only a Menu button visible during play.
- Realistic human archer silhouettes, drag-to-draw bow physics, wind, zoom, open levels, opponent duel levels, and exploding targets.
- PWA/iOS installation support: manifest, service worker, Apple touch icon, and in-game Add to Home Screen instructions.
- Telemetry: client events include build id, session id, level, turn, viewport, pointer/shot/hit/explosion/menu/fullscreen/install/log-download events; static Pages stores locally and the included Node backend can receive `/api/log`.

## Develop

```bash
npm test
python3 -m http.server 4177
```

## Backend logger

```bash
npm run backend
```

Then POST client telemetry to `/api/log`; daily NDJSON logs are written under `logs/`.
