# openvoxel-modloader.github.io

Documentation site of the **OpenVoxel ModLoader** (English / Español), published with GitHub
Pages at https://openvoxel-modloader.github.io/ — docs, tutorials and the mods/plugins catalogue.

Repositories: [ModLoader](https://github.com/OpenVoxel-ModLoader/ModLoader) (overview) ·
[ModLoader-Client](https://github.com/OpenVoxel-ModLoader/ModLoader-Client) ·
[ModLoader-Server](https://github.com/OpenVoxel-ModLoader/ModLoader-Server) ·
[ModLoader-ModsExamples](https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples) ·
[ModLoader-Server-Example](https://github.com/OpenVoxel-ModLoader/ModLoader-Server-Example)

## Content

- `content/docs/<slug>.<lang>.md` — reference docs (front matter: `title`, `summary`, `order`).
- `content/tutorials/<slug>.<lang>.md` — step-by-step tutorials.
- `public/mods.json` — catalogue shown under *Mods* (links to releases / repos).

Write both `.en.md` and `.es.md`; a missing translation falls back to English.

## Develop

```
pnpm install
pnpm dev        # http://localhost:5174
pnpm build      # dist/
```

Vite + React + i18next with a hash router (no server rewrites needed on Pages).
`.github/workflows/pages.yml` deploys on every push to `master`; enable
*Settings → Pages → Source: GitHub Actions* once.
