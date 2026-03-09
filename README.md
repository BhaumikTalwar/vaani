# Vaani

A vanilla JavaScript frontend template built from scratch.

## Features

- **Router** - SPA routing with guards, layouts, and params
- **State Management** - Reactive pub/sub state with computed values
- **API Client** - HTTP with interceptors, retries, CSRF, and typed errors
- **Type Safety** - JSDoc-powered type checking
- **TailwindCSS 4** - Utility-first styling with custom design tokens
- **Components** - Reusable UI: Input, Card, Modal, Alert, Badge, and more
- **Vite** - Fast dev server with HMR and optimized builds

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── main.js              # Entry point
├── core/
│   ├── router.js        # SPA Router
│   ├── state.js        # State manager
│   ├── codec.js        # JSON/MsgPack encoding
│   └── ApiClient/      # HTTP client
├── services/
│   ├── authService.js  # Auth & route guards
│   └── cacheService.js
├── components/          # UI components
├── pages/               # Page components
├── layouts/             # Layout wrappers
└── constants/           # App constants
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `15000` |

Copy `.env.example` to `.env` and configure as needed.

## Commands

```bash
npm run dev           # Dev server (localhost:5173)
npm run build         # Production build
npm run preview        # Preview production build
npm run docs:generate # Generate JSDoc
npm run docs:serve    # Serve JSDoc on port 4173
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
```

## License

MIT
