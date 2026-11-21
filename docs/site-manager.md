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

### New computer / restore from live site

1. Clone/copy the project, install Node, create `website/.env.local` (same FTP + admin settings)
2. Start admin (`start-arra.bat`)
3. Click **Download from website**

That pulls live `gallery-events.json` + `gallery-access.json`, rebuilds local `data/gallery.json`, and downloads cover images into `public/images/gallery/`.

CLI alternative: `cd website` then `npm run pull-gallery`.

## What "Upload to website" does

1. Builds the production site (`npm run build`)
2. On the **live host**, backs up current gallery JSON into `data/backups/` with a timestamp
3. Uploads `website/dist/` to Webhouse via FTP (overwrites matching files)
4. Live site updates — gallery, images, text changes included

Upload can take a few minutes. Do not close the window during upload.

### Production gallery backups (rolling)

Stored **only on the server** (not kept on the PC):

`data/backups/`

| File pattern | Purpose |
|--------------|---------|
| `gallery-events.json.<stamp>.bak` | Public event list snapshot |
| `gallery-access.json.<stamp>.bak` | Passwords + Fotoshare URLs snapshot |

- Kept: last **5** of each (older deleted on upload)
- Folder blocked from the web (`.htaccess`)
- No empty-gallery guard — upload always publishes the current local gallery

**Restore via Total Commander:** copy a `.bak` from `data/backups/` over `data/gallery-events.json` / `data/gallery-access.json` (drop the timestamp suffix).

## Booking form (leads)

The **Check Availability** form POSTs to `/api/lead.php`. Spam protection: **honeypot** + **reCAPTCHA v2**.

- **Production (Webhouse):** PHP verifies reCAPTCHA, appends `api/logs/leads.jsonl`, sends email via **PHPMailer SMTP** (not `mail()`).
- **Local dev:** Vite saves to `website/data/leads.jsonl` (no SMTP email).

### reCAPTCHA setup

1. Create **reCAPTCHA v2 “I'm not a robot”** keys at [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin).
2. Add domains: `localhost`, `127.0.0.1`, and your production domain.
3. In `website/.env.local`:
   - `VITE_RECAPTCHA_SITE_KEY` — site key (frontend)
   - `RECAPTCHA_SECRET_KEY` — secret key (dev server)
4. On Upload, deploy writes `api/lead-config.local.php` when `RECAPTCHA_SECRET_KEY` is set.

### SMTP email setup (required — Webhouse disabled `mail()`)

1. In Webhouse panel, set PHP for the domain to **7.4+ or 8.x** if available (current code also works on 7.0 with vendored PHPMailer **6.9.3**).
2. Add to `website/.env.local` (never commit):

```env
SMTP_HOST=mail.webhouse.sk
SMTP_PORT=587
SMTP_USERNAME=arra@jstudio.sk
SMTP_PASSWORD=your-mailbox-password
SMTP_TO_EMAIL=arra@jstudio.sk
SMTP_FROM_EMAIL=arra@jstudio.sk
SMTP_FROM_NAME=ARRA Website
```

3. Click **Upload to website** — deploy writes `dist/api/smtp-config.local.php` (blocked from HTTP by `api/.htaccess`).

**Preferred (more secure) password placement:** copy `website/config/smtp-config.example.php` → `/www_root/smtp-config.local.php` (one level **above** the site folder, outside the web root) and set the real password there. `lead.php` loads that path first.

### Files that must be on production for email

| Path | Purpose |
|------|---------|
| `api/lead.php` | Handler (SMTP via PHPMailer) |
| `api/vendor/**` | PHPMailer 6.9.3 |
| `api/.htaccess` | Denies `*-config.local.php` + `/vendor` |
| `api/lead-config.php` (+ local) | reCAPTCHA + defaults |
| `api/smtp-config.local.php` **or** `/www_root/smtp-config.local.php` | SMTP password (never commit) |

### Verify

1. `https://svojka.com/api/lead-status.php` → `recaptcha_configured: true`, `smtp_configured: true`, `phpmailer_present: true`, `openssl_available: true`
2. Submit a test lead on the live site
3. Check inbox/spam for `arra@jstudio.sk`
4. FTP: `api/logs/leads.jsonl` (lead saved) and `api/logs/mail-delivery.jsonl` (`status: sent` or `smtp_failed`)

Lead save still succeeds if SMTP fails (`mail_sent: false`, `log_saved: true`).

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
