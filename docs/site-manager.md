# ARRA site manager (Windows)

Simple workflow for managing gallery events and publishing the live website.

## One-time setup

1. Install [Node.js LTS](https://nodejs.org/) on Windows.
2. Copy `website/.env.example` to `website/.env.local`.
3. Fill in:
   - `ADMIN_PASSWORD` — password for the admin page
   - `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR` — from Webhouse panel
4. Double-click **`start-arra.bat`** in the project root (first run installs dependencies).

`FTP_REMOTE_DIR` is usually something like `/www/domains/your-domain.sk` — check Webhouse FTP details.

`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, and `FTP_REMOTE_DIR` should match your **Total Commander** FTP session (Webhouse SETUP → FTP).

Default is **plain FTP on port 21, no TLS** — same as Total Commander without “FTP over TLS” enabled. Do not set `FTP_SECURE_MODE=explicit` unless you use FTPS in Total Commander too.

## Daily use

1. Double-click **`start-arra.bat`**
2. Browser opens the admin page automatically
3. Log in with `ADMIN_PASSWORD`
4. Add, edit, or hide gallery events (upload cover images here)
5. Click **Upload to website** when ready to publish

Keep the black terminal window open while working. Closing it stops the local server.

## What "Upload to website" does

1. Builds the production site (`npm run build`)
2. Uploads `website/dist/` to Webhouse via FTP
3. Live site updates — gallery, images, text changes included

Upload can take a few minutes. Do not close the window during upload.

## Booking form (leads)

The **Check Availability** form POSTs to `/api/lead`. Spam protection: **honeypot** + **reCAPTCHA v2**.

- **Production (Webhouse):** PHP verifies reCAPTCHA, sends email to `arra@jstudio.sk`, appends `api/logs/leads.jsonl`.
- **Local dev:** same verification via Vite; saves to `website/data/leads.jsonl` (no email).

### reCAPTCHA setup

1. Create **reCAPTCHA v2 “I'm not a robot”** keys at [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin).
2. Add domains: `localhost`, `127.0.0.1`, and your production domain.
3. In `website/.env.local`:
   - `VITE_RECAPTCHA_SITE_KEY` — site key (frontend)
   - `RECAPTCHA_SECRET_KEY` — secret key (dev server)
4. On Webhouse after deploy: upload includes `api/lead-config.local.php` automatically when `RECAPTCHA_SECRET_KEY` is in `.env.local` (generated at deploy, not committed).

Optional manual override on server: `api/lead-config.local.php`.

**Debug live server:** open `https://your-domain/api/lead-status.php` — should show `recaptcha_configured: true` and `recaptcha_secret_length` > 0.

Domains in Google admin must include your **live domain** (e.g. `svojka.com` and `www.svojka.com`).

## Notes

- Admin runs **only on your PC**, not on the live website.
- Gallery passwords on the live site use static files (FTP hosting has no Node server). Event passwords are still required for guests; tech-savvy users could inspect network files — same tradeoff as most static gallery setups.
- If upload fails, check FTP credentials and `FTP_REMOTE_DIR` in `.env.local`.
- To publish without the admin UI: `cd website` then `npm run deploy`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Node.js is not installed" | Install Node.js, restart, run `start-arra.bat` again |
| "Missing .env.local" | Copy `.env.example` → `.env.local` and fill in values |
| Tailwind native binding error | Delete `website/node_modules`, run `npm install` inside `website/` |
| Upload fails | Match host/user/password/path to Total Commander; check Webhouse SETUP |
| `ENOTFOUND` / wrong host | Copy exact FTP server from Webhouse SETUP (same as Total Commander) |
| `530 Login incorrect` | Wrong user/password, or broken `.env.local` (one var per line). Match Total Commander exactly. Password with `#` or `&`? Wrap in quotes: `FTP_PASSWORD="..."` |
