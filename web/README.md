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

## On-Chain Metrics & Hiro / Stacks Integration

### Why 400 Errors Appeared
Requests in browser logs like:

```

https://api.mainnet.hiro.so/children-equipped
https://api.mainnet.hiro.so/verified-donations

````

return 400 because those paths do not exist on Hiro. They originated from a previously committed, stale production bundle (`web/dist/`). The current source code instead:

1. Uses `fetchCallReadOnlyFunction` (Stacks JS) to invoke read‑only Clarity functions.
2. Falls back to the Vercel serverless function `/api/metrics` for DB + static values.

Delete any committed build artifacts (`dist/`) so Vercel always rebuilds with the updated logic.

### Correct Pattern For Read‑Only Contract Metrics
Preferred (already used in hooks):

```ts
import { fetchCallReadOnlyFunction } from '@stacks/transactions'
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network'

const network = import.meta.env.VITE_NETWORK === 'testnet' ? STACKS_TESTNET : STACKS_MAINNET
const cv = await fetchCallReadOnlyFunction({
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'get-children-equipped', // map from key
  functionArgs: [],
  network,
  senderAddress: CONTRACT_ADDRESS,
})
````

Manual HTTP alternative (not needed if using stacks.js):

```
POST https://stacks-node-api.<network>.stacks.co/v2/contracts/call-read/<address>/<contract>/<fn>
Body: {"sender":"<address>","arguments":[]}
```

### Environment Variables (Vercel)

| Name                    | Value / Notes                                   |
| ----------------------- | ----------------------------------------------- |
| `VITE_NETWORK`          | `mainnet` or `testnet`                          |
| `VITE_CONTRACT_ADDRESS` | Deployed contract address for read‑only calls   |
| `VITE_CONTRACT_NAME`    | Contract name containing metric functions       |
| `VITE_METRICS_URL`      | Optional absolute override for metrics endpoint |
| `METRICS_ADMIN_TOKEN`   | Bearer token for POST /api/metrics updates      |

Optional: `POSTGRES_URL` (auto from Vercel Postgres binding).

### Metrics Resolution Order (Frontend)

1. Absolute `VITE_METRICS_URL`
2. `window.__METRICS_URL__` (if set before hydration)
3. `/api/metrics` in production
4. Local mock (`VITE_USE_MOCK=1`) during dev
5. Static fallback array

### Caching

`/api/metrics` sets `Cache-Control: s-maxage=300, stale-while-revalidate=600` for edge caching. On‑chain reads bypass this and are always fresh at page load.

### Troubleshooting

- 400/404 on Hiro: ensure you call valid endpoints (`/extended/v1/tx/<txid>` etc.) or use stacks.js helpers.
- Empty metrics: DB not seeded yet; fallback used.
- Read‑only call failure: verify contract address/name and function exists (naming `get-<key>` pattern unless overridden).

### Avoid Committing `dist/`

`dist/` is in `.gitignore`. If it becomes tracked, remove it (`git rm -r --cached web/dist`) and commit. Stale bundles can retain old API calls and produce misleading 400 errors after deploy.

```

```
