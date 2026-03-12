# Galaretkarnia — server configuration

This file documents environment variables and quick local/deploy instructions for the `server` folder.

Important: never commit a live `.env` file with secrets. Use the included `.env.example` as a template.

Required / recommended environment variables

- `ADMIN_SECRET` — strong secret protecting admin endpoints (`X-Admin-Secret`).
- `APP_URL` — public URL where frontend is served (used for magic links), e.g. `https://galaretkarnia.example.com`.
- `MONGODB_URI` — MongoDB connection string.
- `ORDER_EMAIL` — email where order notifications are sent.

Optional (email sending)

- `RESEND_API_KEY` — API key for Resend email service. If not set, magic-link endpoint returns the link in development only.
- `RESEND_FROM_EMAIL` — sender address for Resend.

Token TTL configuration

- `ACCESS_TOKEN_TTL_DAYS` — TTL (days) for access tokens created at order time (default 30).
- `ACCESS_TOKEN_TTL_DAYS_CLAIM` — TTL (days) for tokens generated via claim flow (default 7).
- `MAGIC_LINK_TTL_HOURS` — TTL (hours) for magic links (default 2).

Local development

1. Copy `.env.example` to `.env` and adjust values for local testing (e.g. set `ADMIN_SECRET=dev`, `APP_URL=http://localhost:3001`).
2. Start server:

```powershell
cd server
npm install
npm run dev
```

Alternatively, run without creating `.env` by exporting env vars in your shell:

PowerShell:
```powershell
$Env:ADMIN_SECRET='dev'; Set-Location server; npm run dev
```

Bash (macOS / WSL):
```bash
ADMIN_SECRET=dev APP_URL=http://localhost:3001 npm run dev --prefix server
```

Deployment notes

- Configure `ADMIN_SECRET`, `MONGODB_URI`, and optionally `RESEND_API_KEY` via your host's secret management (Vercel/Render/Heroku environment variables). Do NOT commit these into git.
- Ensure the app runs under `NODE_ENV=production` in production.

Security

- Keep `ADMIN_SECRET` strong and rotate if leaked.
- Consider storing audit logs (`auth_audit`) in a separate collection and backing them up.
