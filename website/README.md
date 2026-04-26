# Svojka website

## Development

From repository root:

```bash
npm run install:website
npm run dev
```

Or from `website/` directly:

```bash
npm install
npm run dev
```

## Troubleshooting: `Cannot find native binding` from `@tailwindcss/oxide`

If Vite fails with an error like:

- `Cannot find native binding`
- `npm has a bug related to optional dependencies`

run:

```bash
npm run clean-install
```

This forces a fresh install so npm re-resolves Tailwind's optional native package for your platform.
