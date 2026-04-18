# Bundle Baseline (2026-04-18)

## Goals

- Keep `pnpm run build` stable without large-route regression.
- Track top chunks on every performance iteration.
- Keep analyzer output in static report mode for reproducible review.

## Commands

```bash
pnpm run build
pnpm run analyze
pnpm run analyze:report
```

Artifacts:

- `bundle-stats.html` (from `vite-bundle-analyzer`, static report)
- `dist/reports/bundle-top-chunks.md` (generated top chunk table)

## Current Top Chunks

Measured on 2026-04-18 with `pnpm run build`:

| Chunk | Size |
| --- | --- |
| `vendor-echarts-lt8BRoV1.js` | 356.53 kB |
| `vendor-aws-DGDNjOsH.js` | 338.96 kB |
| `vendor-lunar-Chzur7NX.js` | 307.65 kB |
| `index-BdHbYRQc.js` | 207.85 kB |
| `route-Bt2swwxj.js` | 187.39 kB |
| `vendor-zrender-CvAEMHHO.js` | 173.76 kB |
| `vendor-radix-B-B6pm1D.js` | 151.68 kB |
| `vendor-motion-nZG9qQ1o.js` | 127.87 kB |
| `wedding-date-picker-Bz9xRaqj.js` | 114.24 kB |
| `vendor-date-Ej8Oe7TT.js` | 112.18 kB |

## Ownership Hints (for next round)

- `vendor-echarts` / `vendor-zrender` / `vendor-wordcloud`: statistics page and charts.
- `vendor-aws`: cloud sync/storage SDK path.
- `vendor-lunar`: lunar calendar and date conversion utilities.
- `vendor-radix`: dialog/select/popover and other UI primitives.
- `route-*` / `index-*`: route-level app code split results.
