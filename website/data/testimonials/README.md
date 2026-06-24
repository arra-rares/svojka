# Testimonials

Add one markdown file per testimonial in this folder.

## Format

Filename: anything descriptive, e.g. `martin-jana-wedding.md`

Content:

```md
# Martin & Jana | Wedding

Profesionálny prístup, hostia boli nadšení. Fotky z galérie sú skvelé!
```

Rules:
- First line must start with `# ` — this is the attribution (name + event type).
- Everything after the title is the quote text.
- Empty files are ignored.
- After saving, restart `npm run dev` (or rebuild) to refresh the site.

Generated file (do not edit by hand): `website/data/testimonials.json`
