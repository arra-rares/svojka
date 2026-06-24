# ARRA Website — Hosting Requirements

## Planned provider

- **Webhouse** (Slovakia) — documented in `battle-plan.md`
- Domain + hosting already available per `client.md`
- **Current plan:** 3-domain multihosting (128 GB, Apache, PHP 5.2–8.5, MySQL/MariaDB, FTP/FTPs, free SSL, `.htaccess`, WebCron, PHP mail)

This is **classic shared PHP hosting**, not Node.js app hosting.

---

## What this site is

The deployable app lives in `website/`.

- **Frontend:** static React build (`npm run build` → `website/dist/`)
- **Backend (v1):** lightweight API in Vite dev middleware (`website/vite.config.ts`)

That API powers:

- Admin gallery management (`/manage-events-9xk2`)
- Gallery event list + password check (`/api/gallery/*`)
- Future lead form email endpoint (`/api/lead` — planned)

---

## Hosting types

### A) Full features (recommended for current code)

**Needs a server runtime** (Node.js), not FTP-only static hosting.

| Feature | Requires server |
|--------|------------------|
| Public landing page | No (static OK) |
| Gallery from `gallery.json` | Yes (today: `/api/gallery/events`) |
| Gallery password → Fotoshare redirect | Yes (`/api/gallery/access`) |
| Admin page + uploads | Yes (`/api/admin/*`) |
| `ADMIN_PASSWORD` / `.env` | Yes — read by server at runtime |
| Lead form email (planned) | Yes |

**Environment variables (production):**

```env
ADMIN_PASSWORD=your-strong-password
```

Set in hosting panel / process manager — **not** in Git.

`.env.local` is for local dev only (`website/.gitignore` ignores `*.local`).

**Deploy shape:**

1. Build on your machine or CI: `cd website && npm run build`
2. Run Node process that serves `dist/` **and** the API layer  
   (today this is bundled with Vite middleware — production needs equivalent Node hosting or a small adapter)

---

### B) Webhouse 3-domain plan (what you actually have)

**Good for:**

| Need | Fit |
|------|-----|
| One production domain (+ 2 spare) | Yes |
| Static React site via FTP | Yes — upload `dist/` |
| Free SSL, `.htaccess`, SPA routing | Yes |
| Company email mailboxes | Yes |
| Lead form email (future) | Yes — via **PHP** + `mail()` or SMTP, not Node |
| WebCron for scheduled tasks | Yes |
| Gallery/admin as built today | **No** — APIs are Node-only |

**Not included:** Node.js runtime. The feature list has PHP + Apache only.

---

### C) FTP-only static hosting (same plan, static deploy)

**What works:**

- Landing page UI, legal pages, contact links, images
- Testimonials from `public/data/testimonials.json`
- Content baked into build at compile time

**What does NOT work without code changes:**

- Admin page (no API, no password check server-side)
- Runtime gallery edits
- `.env` on FTP — **nothing reads it** (no server process)
- Uploading `gallery.json` alone is not enough until gallery reads static JSON instead of `/api/...`

**FTP workflow (if staying static):**

1. Edit `website/data/gallery.json` and images locally
2. `npm run build`
3. Upload `website/dist/` via FTP
4. Upload `public/images/gallery/` assets as needed

Admin becomes a **local tool**, not a live URL.

---

## Security notes (admin)

- Admin route: `/manage-events-9xk2` (not linked on public site)
- Password: server env var `ADMIN_PASSWORD`
- Session: HTTP-only cookie, 24h
- **Obscure URL is not encryption** — password is the real gate
- Optional: `robots.txt` `Disallow: /manage-events-9xk2` (reduces search indexing, not access control)

---

## Current gap (important)

Battle plan assumes **Webhouse deploy**. Implementation assumes **Node-capable hosting** for gallery admin and API.

On **Webhouse 3-domain**, pick one path:

1. **Static deploy (minimal change to hosting)** — build locally, FTP `dist/`, edit `gallery.json` locally, drop live admin on server
2. **PHP API rewrite** — reimplement `/api/gallery/*`, `/api/admin/*`, `/api/lead` in PHP; passwords in config outside web root; gallery data in JSON file or MySQL
3. **Hybrid** — static site on Webhouse + tiny API elsewhere (overkill for this project)

**Recommendation for this plan:** path 1 now (ship landing + legal + static gallery), path 2 only if live admin on production is required.

---

## Quick decision table

| You have | Admin on live site | Gallery passwords | `.env` on server |
|----------|-------------------|-------------------|------------------|
| Node / app hosting | Yes | Yes | Yes |
| Webhouse PHP (current plan) | No (unless PHP rewrite) | No (unless PHP rewrite) | Config file / DB, not Node `.env` |
| FTP static only | No | No (as built today) | No |
| FTP + static refactor | Local only | Possible (weaker client-side) | No |

---

## Who maintains

- Internal (brother) per `client.md`
- **Windows:** double-click `start-arra.bat` — see [`site-manager.md`](site-manager.md)
- Local dev: `cd website && npm run dev`
- Secrets: never commit `.env.local`
