# Opaque Arch Server

Express + TypeScript API for Opaque Arch. It runs the server half of OPAQUE registration and login, stores registration records in SQLite, and authenticates later requests with an `opaque-sid` cookie.

Git root is the parent folder. See the [root README](../README.md) for running client and server together.

## Stack

- Node.js, TypeScript, Express 5
- `@serenity-kit/opaque`
- better-sqlite3
- JWT session cookie (`opaque-sid`)
- CORS (credentials), cookie-parser, Morgan, request IDs
- Swagger UI at `/api-docs`

Default port: **4000**

## Setup

```bash
cd server
cp .env.example .env
node src/utils/generate-setup.mjs
pnpm install
```

Put the setup string into `OPAQUE_SERVER_SETUP`. Do not regenerate it in production unless you intend to wipe users.

```bash
pnpm dev
```

Production:

```bash
pnpm build
pnpm start
```

## Environment

| Variable | Description |
| --- | --- |
| `PORT` | Listen port (`4000`) |
| `NODE_ENV` | `development` / `production` |
| `ALLOWED_ORIGIN` | Browser origin allowed by CORS (`http://localhost:5173`) |
| `OPAQUE_SERVER_SETUP` | Long-lived OPAQUE server setup string |
| `JWT_SECRET` | Secret used to sign the session cookie |

Startup fails if any of these are missing.

## Endpoints

Base URL: `http://localhost:4000`

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/` | API info |
| GET | `/api/v1/health` | Health check |
| GET | `/api-docs` | Swagger UI |
| POST | `/api/v1/auth/signup/start` | Body: `email`, `registrationRequest` |
| POST | `/api/v1/auth/signup/finish` | Body: `email`, `registrationRecord` |
| POST | `/api/v1/auth/login/start` | Body: `email`, `startLoginRequest` |
| POST | `/api/v1/auth/login/finish` | Body: `email`, `finishLoginRequest`. Sets `opaque-sid` |
| GET | `/api/v1/user/me` | Current user (cookie required) |
| GET | `/api/v1/user` | All users (cookie required) |

Example:

```bash
curl http://localhost:4000/api/v1/health
```

## Scripts

- `npm run dev` — ts-node-dev
- `npm run build` / `npm start` — compile and run `dist/`
- `npm run lint` — ESLint on `src/`
- `npm run format` / `npm run check-format` — Prettier
- `npm run prepare` — install Husky at the **git root** (`cd .. && husky server/.husky`)

## Pre-commit

`server/.husky/pre-commit` runs from the repo root. Staged `server/` files trigger format, `tsc --noEmit`, lint (`--max-warnings=0`), and build. Staged `client/` files trigger client type-check and lint. Re-run `npm install` in this directory after cloning so `core.hooksPath` is set.

## Layout

```
server/
├── .husky/pre-commit
├── src/
│   ├── config/          # env, db, OPAQUE setup
│   ├── middlewares/
│   ├── modules/v1/      # health, auth, user
│   ├── utils/           # logger, JWT, generate-setup.mjs
│   ├── app.ts
│   ├── routes.ts
│   └── server.ts
├── .env.example
└── package.json
```

## License

MIT
