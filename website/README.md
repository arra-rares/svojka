# Svojka website

## Development

```bash
npm install
npm run dev
```

## Windows site manager

Double-click `../start-arra.bat` from the repo root. See [`../docs/site-manager.md`](../docs/site-manager.md).

## Troubleshooting: `Cannot find native binding` from `@tailwindcss/oxide`

If Vite fails with an error like:

- `Cannot find native binding`
- `npm has a bug related to optional dependencies`

run:

```bash
npm run clean-install
```

This forces a fresh install so npm re-resolves Tailwind's optional native package for your platform.
