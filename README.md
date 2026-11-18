# Mohamed Tolba · Data Analyst Portfolio

A bilingual portfolio with an illustrated introduction, an analytical workflow, and three Power BI case studies. English opens by default and the language switch leads to a matching Arabic or English page. Each case study is a real static route.

## Run locally

Use Node.js 22+ and Python 3. No npm install is required.

```sh
npm run lint
npm test
npm run dev
```

Open http://127.0.0.1:4173/. Use `npm run build` to generate `dist/` on its own.

For the optional browser suite, build first and install the same Playwright
version used by the Pages workflow.

```sh
npm run build
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

## Publish with GitHub Pages

1. Create a new repository for this folder. The default build origin is `https://matolba97.github.io/portfolio/`.
2. Push the source to the new repository's `main` branch.
3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Run **Deploy portfolio to GitHub Pages** from the Actions tab if the first push preceded Pages setup.
4. Open the workflow's deployment URL and refresh a project URL in each language.

The workflow uses the configured Pages URL for canonical tags, Open Graph, and sitemap entries. All site navigation and assets use relative paths, so project pages resolve under a repository subpath. For a manual build on a different domain, set `PORTFOLIO_ORIGIN` to its public HTTPS URL with the deployment subpath.

## Maintain the site

- `src/content.mjs` holds the public profile, bilingual copy, and case studies. Add a project with a unique slug, a real public repository, a verified live report, and both language entries. Update the work-section headline to match the project count if needed.
- `src/illustration.mjs` holds the site's original SVG artwork.
- `public/assets/` holds CSS, language preference and scroll behavior, the favicon, the social card, and public Power BI screenshots.
- `scripts/build.mjs` generates pages, SEO metadata, sitemap, and robots.txt.
- `test/site.test.mjs` verifies the localized pages, report links, and generated paths.

## Content and credits

Project screenshots are owned portfolio captures sourced from the corresponding public [workforce](https://github.com/matolba97/hr-analytics-dashboard), [hospital](https://github.com/matolba97/hospital-operations-intelligence-power-bi), and [e-commerce](https://github.com/matolba97/maven-fuzzy-factory-ecommerce-intelligence) repositories. Each study links to its data provenance and supporting analysis. The hospital study uses synthetic records. HR distribution follows the linked repository's data-source notes. The e-commerce study links to Maven Analytics' matching dataset and its original repository documents the 365 Data Science credit.

The [Insurance Data Story](https://matolba97.github.io/insurance-data-story/) informed the editorial treatment and pacing. The artwork in this portfolio is original.

No résumé was available in the workspace or public profile. Add a download only when there is a public copy to distribute.

