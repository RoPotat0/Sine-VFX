# SineVFX Docs

The documentation site for [SineVFX](https://sinevfx.xyz), served at
**docs.sinevfx.xyz**. Built with [VitePress](https://vitepress.dev).

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # output → docs/.vitepress/dist
npm run preview  # preview the production build
```

## Structure

```
docs/
  .vitepress/
    config.ts          # nav, sidebar, site meta
    theme/
      index.ts
      custom.css        # SineVFX palette + Cantora One / Nunito fonts
  public/
    CNAME               # docs.sinevfx.xyz
    logo.png, favicon.png, banner.png, sine.png
  guide/    windows/    tools/    effects/    shipping/    reference/
  index.md              # home / hero
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with VitePress and
publishes to GitHub Pages. Point the repo's Pages settings to **GitHub Actions** and add the
`docs.sinevfx.xyz` custom domain (the `CNAME` file is already in `docs/public`).

To edit content, change the Markdown files under `docs/` — no build tooling knowledge
needed.
