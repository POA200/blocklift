# React + TypeScript + Vite

## Metrics API (Vercel + Postgres)

This app exposes `/api/metrics` (Vercel Serverless Function) and reads from Vercel Postgres via `@vercel/postgres`.

Local options:

- Static fallback works out of the box.
- To seed a Postgres database and serve real values:

```bash
cd web
npm install
# Set POSTGRES_URL in .env.local (see .env.example)
npm run db:seed
npm run dev
```

Deployment:

- Deploy the `web` directory to Vercel. Add a Vercel Postgres database and link it to the project.
- The function `/api/metrics` will use Postgres automatically via Vercel-provided env vars.
- The frontend will attempt, in order: `VITE_METRICS_URL` (absolute), `window.__METRICS_URL__` (absolute), `/api/metrics` (prod), mock (dev opt-in), then static fallback.

### Admin updates

Securely update metrics via `POST /api/metrics` with a token.

1. Set `METRICS_ADMIN_TOKEN` in Vercel Project → Settings → Environment Variables (and in `.env.local` for local testing).
2. Send updates:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $METRICS_ADMIN_TOKEN" \
  https://<your-vercel-deployment>/api/metrics \
  -d '{
    "updates": [
      {"key": "children_equipped", "value": 5200},
      {"key": "verified_donations", "value": 13000, "prefix": "$"}
    ]
  }'
```

Notes:

- Creating a new key requires `label`, `desc`, and `value`.
- Updating an existing key accepts any subset of fields: `label`, `desc`, `value`, `prefix`, `suffix`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
