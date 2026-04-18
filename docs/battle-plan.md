# ARRA Landing Page — Battle Plan (v2)

---

## Roles

* **Product Owner:** decisions, validation
* **Figma Make:** structure + visual design
* **Cursor / Claude:** implementation

---

# Phase 0 — Locked Decisions (DO NOT CHANGE)

## Backend

* Form → **email + file log (.jsonl)**
* No attachments
* Failure fallback → log only (still return success)

## Spam protection

* honeypot + **reCAPTCHA v2**

## Availability

* accept all leads
* manual confirmation within 24h

## Pricing

* inline discounts:

  ```
  Extras: 120€ (60€ with Fotobox/360)
  ```
* highlight:

  * **3h = “Most popular”**

## Transport

* show rule only:

  ```
  +0.35€/km from Bratislava / Vienna
  ```

## Gallery

* locked state only
* message:

  > Access provided by event organizer
* redirect to fotoshare

## Language

* routes:

  * `/sk`, `/en`, `/de`
* auto-detect + cookie persistence

## Analytics

* Google Analytics
* events:

  * `cta_click`
  * `form_submit`
  * `form_error`

## Contact

* **single floating CTA → WhatsApp**
* prefilled message:

  ```
  Hi, I’m interested in your services for an event.
  ```

## Infra

* hosting: Webhouse
* **no CMS (v1)**

---

# Phase 1 — Wireframe (Figma Make)

## Goal

Structure only.

## Deliverable

* mobile-first wireframe
* all sections present

## Sections (fixed)

1. Hero
2. Social proof
3. Services
4. Pricing
5. How it works
6. Gallery
7. CTA
8. Contact

## Constraints

* CTA visible in first scroll
* pricing readable without interaction
* max 2–3 lines per block

---

# Phase 2 — Visual Design (Figma Make)

## Goal

Premium but accessible.

## Inputs

* real photos (mandatory)
* logo
* minimal color palette

## Output

* mobile + desktop
* reusable components

## Rules

* images dominate
* no animations
* no visual noise

---

# Phase 3 — Content Injection

## Goal

Final content, no placeholders.

## Required content

* headline + subheadline
* services (1–2 lines each)
* pricing labels
* testimonials (3–5)

## Mandatory UI texts

### Availability

```
Final availability confirmed after review.
```

### Form success

```
Request received. We will confirm availability within 24h (9:00–17:00).
```

### Gallery

```
Access provided by event organizer.
```

---

# Phase 4 — Development (Cursor / Claude)

## Stack

* static frontend
* minimal backend endpoint

---

## Implementation

### 1. Layout

* pixel match Figma
* responsive first

---

### 2. Form

#### Endpoint

* POST `/api/lead`

#### Behavior

* validate fields
* verify reCAPTCHA
* send email
* append to `.jsonl`

#### Log format

```json
{"date":"","event_date":"","location":"","type":"","people":""}
```

#### Response

* always return success (unless validation fails)

---

### 3. Gallery

* grid view
* click → password screen
* password submit → redirect

---

### 4. Language

* route-based (`/sk`, `/en`, `/de`)
* JSON translation files
* store selection in cookie

---

### 5. WhatsApp CTA

* floating button (always visible)
* link:

  ```
  https://wa.me/<number>?text=<encoded>
  ```

---

### 6. Performance

* image compression
* lazy loading
* <2s mobile load target

---

# Phase 5 — QA

## Functional

* form submit works
* invalid input shows error
* spam blocked

## UX

* CTA always reachable
* pricing clear without thinking

## Links

* gallery flow works
* language switch stable

## Mobile

* no broken layout

---

# Phase 6 — Launch

## Tasks

* deploy to Webhouse
* connect domain
* enable analytics

## SEO (minimum)

* title
* description
* OG image

---

# Phase 7 — Feedback Loop

## Track

* CTA clicks vs form submits
* drop before pricing
* mobile behavior

## First iteration targets

* hero clarity
* CTA placement
* pricing readability

---

# Execution Order (strict)

```
Decisions → Wireframe → Design → Content → Dev → QA → Launch
```

---

# Hard Constraints

* no CMS
* no booking system
* no animations
* no feature creep

---

# Success Criteria

* offer understood in <5 seconds
* pricing clear immediately
* form submission frictionless

---

# One final correction

Original plan said:

> “spam protection (basic)”

This is now wrong.
It is **explicitly defined (reCAPTCHA + honeypot)** and must stay that way.

