import { credentials } from './credentials.mjs';

/** @typedef {import('./credentials.mjs').Credential} Credential */

/** @type {Record<'en' | 'ar', {
 *   title: string, intro: string, featured: string, archive: (count: number) => string,
 *   collapse: string, view: string, preview: string, id: string, badge: (title: string) => string,
 *   types: Record<NonNullable<Credential['type']>, string>
 * }>} */
const copy = {
  en: {
    title: 'Certifications & Continuous Learning',
    intro: 'My qualifications in data analysis, SQL and business intelligence, alongside coursework in statistics, Python and AI.',
    featured: 'Featured Credentials',
    archive: count => `View All ${count} Certifications`,
    collapse: 'Show Less',
    view: 'View Credential',
    preview: 'Open Certificate Image',
    id: 'Credential ID',
    badge: title => `Official DataCamp ${title} badge`,
    types: {
      certification: 'Professional certification',
      professionalCertificate: 'Professional certificate',
      completion: 'Course completion',
      assessment: 'Skills assessment',
      nanodegree: 'Nanodegree',
    },
  },
  ar: {
    title: 'الشهادات والتعلّم المستمر',
    intro: 'شهاداتي في تحليل البيانات وSQL وذكاء الأعمال، إلى جانب دورات في الإحصاء وبايثون والذكاء الاصطناعي.',
    featured: 'أبرز الشهادات',
    archive: count => `عرض جميع الشهادات (${count})`,
    collapse: 'عرض أقل',
    view: 'عرض الشهادة',
    preview: 'فتح صورة الشهادة',
    id: 'معرّف الشهادة',
    badge: title => `شارة ${title} الرسمية من DataCamp`,
    types: {
      certification: 'اعتماد مهني',
      professionalCertificate: 'شهادة مهنية',
      completion: 'شهادة إتمام دورة',
      assessment: 'تقييم مهارات',
      nanodegree: 'برنامج Nanodegree',
    },
  },
};

const externalIcon = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7"/></svg>';
const disclosureIcon = '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10h12"/><path class="disclosure-plus" d="M10 4v12"/></svg>';

const featured = credentials
  .filter(/** @returns {item is Credential & {featuredOrder: number}} */ (item) => item.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder - b.featuredOrder);
const chronological = credentials.toSorted((a, b) => b.issuedAt.localeCompare(a.issuedAt));
const byYear = Map.groupBy(chronological, item => item.issuedAt.slice(0, 4));

/**
 * @param {'en' | 'ar'} lang
 * @param {string} root
 * @param {(value: string) => string} escape
 */
export function certifications(lang, root, escape) {
  const t = copy[lang];
  const dates = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  /** @param {Credential} item @param {'featured' | 'archive'} group */
  function credential(item, group) {
    const { id, title, issuer, issuedAt, credentialId, verificationUrl, documentUrl, type, image } = item;
    const key = `${group}-${id}`;
    const issued = dates.format(new Date(`${issuedAt}-01T00:00:00Z`));
    const isFeatured = group === 'featured';
    const badge = isFeatured && image;
    const actions = [
      { url: verificationUrl, label: t.view, action: 'verify' },
      { url: documentUrl, label: t.preview, action: 'preview' },
    ].flatMap(({ url, label, action }) => url ? [
      `<a class="text-link credential-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-labelledby="${key}-${action} ${key}"><span id="${key}-${action}">${label}</span>${externalIcon}</a>`
    ] : []);
    return `<li class="credential${badge ? ' credential-with-badge' : ''}" data-credential="${id}">
      <div class="credential-main">
        ${isFeatured && type ? `<p class="credential-type">${t.types[type]}</p>` : ''}
        <h4 id="${key}" class="credential-title"><bdi lang="en">${escape(title)}</bdi></h4>
        <p class="credential-meta"><bdi lang="en">${escape(issuer)}</bdi><span aria-hidden="true">·</span><time datetime="${issuedAt}">${issued}</time></p>
        ${credentialId ? `<p class="credential-id"><span>${t.id}</span> <bdi dir="ltr">${escape(credentialId)}</bdi></p>` : ''}
      </div>
      ${badge ? `<img class="credential-badge" src="${root}assets/credentials/${image.file}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" alt="${escape(t.badge(title))}">` : ''}
      ${actions.length ? `<div class="credential-actions">${actions.join('')}</div>` : ''}
    </li>`;
  }

  return `<section class="certifications" aria-labelledby="certifications-heading">
    <h2 id="certifications-heading">${t.title}</h2>
    <p class="certifications-intro">${t.intro}</p>
    <h3 id="featured-credentials">${t.featured}</h3>
    <ul class="featured-credentials" role="list" aria-labelledby="featured-credentials">
      ${featured.map(item => credential(item, 'featured')).join('')}
    </ul>
    <details class="credential-archive">
      <summary><span class="archive-open">${t.archive(credentials.length)}</span><span class="archive-close">${t.collapse}</span>${disclosureIcon}</summary>
      ${Array.from(byYear, ([year, items]) => `<section class="credential-year" aria-labelledby="credential-year-${year}">
        <h3 id="credential-year-${year}">${year}</h3>
        <ul role="list">${items.map(item => credential(item, 'archive')).join('')}</ul>
      </section>`).join('')}
    </details>
  </section>`;
}
