# vis-intro-course · 《可视化导论》课程网站

Bilingual (ZH/EN) interactive course site for *Introduction to Visualization*.
Six chapters in reference-book style: prose + code + live rendering, with linked
parameters driving both code and charts.

- Live: https://wangling1206.github.io/vis-intro-course/#/
- Docs: `docs/ARCHITECTURE.md` (architecture), `docs/highlights.md` (亮点说明)

## Develop

```bash
cd web
npm ci
npm run dev     # http://localhost:5173/
npm run build   # outputs static dist/
```

## Deploy

Push to `main` — GitHub Actions builds `web/` and deploys `web/dist` to Pages.
HashRouter + relative `base` keep every route working under any sub-path.