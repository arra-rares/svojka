## ARRA Landing Page — Battle Plan

### Roles

* **Product Owner (you):** decisions, constraints, validation
* **Figma Make:** layout, visual system, assets integration
* **Cursor / Claude:** implementation, wiring, deployment

---

# Phase 0 — Lock Decisions (no design yet)

**Goal:** remove ambiguity before anyone builds anything

### Decisions to finalize

1. **Form backend**

   * → Email (simple, fast)
   * Format: structured (JSON-like in body)
   * Recipient: business email
   * Backup: store locally (DB or log)

2. **Discount logic (UI)**

   * Show inline:

     ```
     Extras: 120€ (60€ with Fotobox/360)
     ```
   * No hidden rules

3. **Transport**

   * Show rule only:

     ```
     +0.35€/km from Bratislava / Vienna
     ```
   * No calculator

4. **Language URLs**

   * `/sk`, `/en`, `/de`
   * Default redirect based on browser

5. **Analytics (minimum)**

   * `cta_click`
   * `form_submit`
   * `form_error`

---

# Phase 1 — Wireframe (Figma Make)

**Goal:** structure, not beauty

### Deliverable

* 1-page wireframe (all sections)
* Mobile-first
* No colors, no fancy visuals

### Sections (fixed)

1. Hero
2. Social proof
3. Services
4. Pricing
5. How it works
6. Gallery
7. CTA
8. Contact

### Constraints

* Max 2–3 text lines per block
* CTA always visible within 1 scroll
* Pricing readable without interaction

---

# Phase 2 — Visual Design (Figma Make)

**Goal:** make it feel “premium but accessible”

### Inputs

* real photos (critical)
* logo
* colors (limited palette)

### Output

* final desktop + mobile design
* components:

  * buttons
  * pricing cards
  * service cards
  * testimonial block

### Rules

* images dominate
* no animations in design phase
* avoid gradients/noise

---

# Phase 3 — Content Injection

**Goal:** replace placeholders with real content

### Tasks

* Write:

  * headline
  * subheadline
  * service descriptions (1–2 lines each)
  * testimonials (3–5)

* Verify:

  * pricing exact
  * extras + discount clarity

### Output

* final copy, ready for dev
* no lorem ipsum anywhere

---

# Phase 4 — Development (Cursor / Claude)

**Goal:** fast, clean implementation

### Stack (keep it simple)

* static + minimal backend
* no heavy frameworks unless needed

### Build steps

1. **Layout**

   * pixel match Figma
   * responsive first

2. **Form**

   * POST endpoint
   * send email
   * return immediate success message

3. **Gallery**

   * grid
   * click → password screen → redirect

4. **Language**

   * route-based (`/sk`, `/en`, `/de`)
   * simple i18n (JSON files)

5. **Performance**

   * compress images
   * lazy load gallery

---

# Phase 5 — QA (you + Cursor)

**Goal:** break it before users do

### Checklist

* Mobile:

  * all sections readable
  * CTA reachable fast

* Form:

  * valid submit works
  * invalid shows error
  * spam attempt blocked (basic)

* Links:

  * gallery redirect works
  * language switch works

* Speed:

  * loads <2s on mobile

---

# Phase 6 — Launch

**Goal:** get real traffic fast

### Tasks

* deploy
* connect domain
* enable analytics

### Minimum SEO

* title
* description
* OG image

---

# Phase 7 — Feedback Loop

**Goal:** iterate based on reality

### Watch

* CTA clicks vs form submits
* drop-off before pricing
* mobile behavior

### First improvements (likely)

* hero clarity
* pricing readability
* CTA placement

---

# Execution Order (strict)

```
Decisions → Wireframe → Design → Content → Dev → QA → Launch
```

No skipping. No parallel chaos.

---

# Critical Constraints (enforce hard)

* No feature creep
* No “nice to have”
* No animations before v2
* No booking system
* No backend complexity

---

# Success Definition

* User understands offer in <5s
* Pricing visible without thinking
* Form submitted without friction

---

If something blocks → cut it, don’t solve it.
