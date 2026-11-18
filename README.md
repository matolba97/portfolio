# Mohamed Tolba · Data Analyst Portfolio

[Open the portfolio](https://matolba97.github.io/portfolio/)

The homepage uses the original five-scene Insurance Data Story. The **Projects / المشاريع** link opens a separate project directory. Case study URLs under `/work/` and `/ar/work/` are shareable.

## Run locally

Use Node.js 22.12+ and Python 3.

```sh
npm ci --prefix story
npm test
npm run dev
```

Open http://127.0.0.1:4173/. Run `npm run build` to generate `dist/`. To test that build in Chromium:

```sh
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install --only-shell chromium
npm run test:browser
```

GitHub Actions validates the site and publishes it to GitHub Pages. Set `PORTFOLIO_ORIGIN` to the public site URL when building for a different domain or path.

## Maintain the site

- `story/` contains the five-scene presentation, including the original typography, illustrations, animation, and translations.
- `src/content.mjs` holds the bilingual project summaries and case studies. To add a project, provide a unique slug, the public repository and report links, both translations, and an actual screenshot in `public/assets/`.
- `scripts/build.mjs` generates the project directory and case study pages and packages them with the story.

The story comes from [Insurance Data Story](https://github.com/matolba97/insurance-data-story). Font licenses are in `story/public/licenses/`. Screenshots come from the [workforce](https://github.com/matolba97/hr-analytics-dashboard), [hospital](https://github.com/matolba97/hospital-operations-intelligence-power-bi), and [e-commerce](https://github.com/matolba97/maven-fuzzy-factory-ecommerce-intelligence) repositories. Each study links to its own data source and dashboard.

