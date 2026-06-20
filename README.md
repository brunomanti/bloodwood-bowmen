# Bloodwood Bowmen

Mobile-first landscape canvas game: competing bowmen, draggable bow force/direction, destructible targets, escalating AI opponents, playful splattery cartoon damage, and zoomable side-section view.

Public build id: `bloodwood-bowmen-v20260619-2059-bad-apple`

## Telemetry/logging

The browser records every significant interaction and simulation event with the unique `buildId` and session id:

- boot, resize, pointer down/drag/up
- arrows fired, hits, misses, target degradation/destruction
- opponent actions, level transitions, status messages
- errors and unhandled promise rejections

On GitHub Pages the log is retained locally in `localStorage` and downloadable from the **Logs** button. The repo also includes `backend/server.js`, a Fastify logger that writes all HTTP requests and `/api/log` client events to daily NDJSON files when deployed on any Node host. The client uses `navigator.sendBeacon('/api/log', ...)` automatically when a backend is present.

## Local

```bash
npm install
npm test
npm run backend
```

Then open `http://localhost:8080`.
