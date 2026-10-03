# Opaque Arch

A small client/server app that uses [OPAQUE](https://github.com/serenity-kit/opaque) for password authentication. The password never leaves the browser as plaintext or as a conventional hash. The server stores an OPAQUE registration record and issues a session cookie after a successful login.


## Layout

```
.
├── client/    # React + Vite UI
├── server/    # Express API
└── README.md
```

- [client/README.md](client/README.md) — UI, routes, Vite env
- [server/README.md](server/README.md) — API, env, endpoints, git hooks

## Prerequisites

- Node.js 18+
- npm (or pnpm) in each package

## Quick start

1. **Server**

   ```bash
   cd server
   cp .env.example .env
   node src/utils/generate-setup.mjs
   ```

   Paste the printed value into `OPAQUE_SERVER_SETUP` in `server/.env`. Set `JWT_SECRET` to a long random string. Keep `ALLOWED_ORIGIN` aligned with the Vite origin (`http://localhost:5173` by default).

   ```bash
   npm install
   pnpm dev
   ```

   API: `http://localhost:4000`  
   Swagger: `http://localhost:4000/api-docs`

2. **Client** (second terminal)

   ```bash
   cd client
   cp .env.example .env
   pnpm install
   pnpm dev
   ```

   UI: `http://localhost:5173`

   `VITE_API_ENDPOINT` must point at the API (`http://localhost:4000`). Requests send cookies (`withCredentials`).

## How auth works here

Registration and login are two-step OPAQUE exchanges (`/start` then `/finish`). The client blinds the password locally with `@serenity-kit/opaque`. After login finish, the server sets an `opaque-sid` cookie. The dashboard loads the current user from `GET /api/v1/user/me`.

Generate `OPAQUE_SERVER_SETUP` **once** and keep it. Regenerating it invalidates every stored registration record.

## Git hooks

Husky lives in `server/.husky` because that is where the `prepare` script is. After `pnpm install` in `server/`, Git `core.hooksPath` points at `server/.husky`.

On commit, the hook type-checks and lints whichever of `client/` or `server/` has staged files. Server commits also run Prettier and a production build.

## License

MIT
