# Opaque Arch Client

React + TypeScript + Vite UI for Opaque Arch. It runs the browser half of OPAQUE signup and login, then talks to the API with cookies.

Git root is the parent folder. See the [root README](../README.md) to start the API first.

## Stack

- React 19, React Router, Vite 8, Tailwind CSS 4
- `@serenity-kit/opaque`
- Axios with `withCredentials: true`

Dev server: **http://localhost:5173**

## Setup

```bash
cd client
cp .env.example .env
pnpm install
pnpm dev
```

## Environment

| Variable | Description |
| --- | --- |
| `VITE_API_ENDPOINT` | API origin (`http://localhost:4000`) |

Vite only exposes variables prefixed with `VITE_`. Restart the dev server after changing `.env`.

The API `ALLOWED_ORIGIN` must match this app’s origin or browser requests with cookies will fail.

## Routes

| Path | Page |
| --- | --- |
| `/` | Login |
| `/signup` | Sign up |
| `/app` | Dashboard (loads `GET /api/v1/user/me`) |
| `*` | Redirect to `/` |

`src/api.ts` owns the OPAQUE client steps and HTTP:

- Sign up: `startRegistration` → `POST /api/v1/auth/signup/start` → `finishRegistration` → `POST /api/v1/auth/signup/finish`
- Login: `startLogin` → `POST /api/v1/auth/login/start` → `finishLogin` → `POST /api/v1/auth/login/finish`
- Session: `GET /api/v1/user/me` (reads `opaque-sid`)

The password is used only inside the OPAQUE client calls. It is not posted as a field.

## Scripts

- `pnpm dev` — Vite
- `pnpm build` — `tsc -b` then Vite production build
- `pnpm preview` — serve the production build
- `pnpm lint` — ESLint

Pre-commit (installed from the server package) runs `npx tsc -b --noEmit` and `npm run lint -- --max-warnings=0` when `client/` files are staged.

## License

MIT
