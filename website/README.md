# Svojka website

## Development

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
