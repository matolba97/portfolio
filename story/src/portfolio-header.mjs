import { createElement as h } from 'react';

const labels = {
  en: {
    brand: 'THE DATA ANALYST STORY', edition: 'A story from insurance brokerage',
    story: 'Story', projects: 'Projects', about: 'About', contact: 'Contact',
    nav: 'Portfolio navigation', language: 'Presentation language',
    ar: 'Switch to Arabic', en: 'Switch to English',
  },
  ar: {
    brand: 'قصة محلل البيانات', edition: 'قصة من عالم التأمين',
    story: 'القصة', projects: 'المشاريع', about: 'نبذة عني', contact: 'تواصل',
    nav: 'التنقل في الموقع', language: 'لغة العرض',
    ar: 'التبديل إلى العربية', en: 'التبديل إلى الإنجليزية',
  },
};

export function PortfolioHeader({ language, links, active, languageLinks, onLanguageChange, headerRef }) {
  const text = labels[language];
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const languageOption = (locale) => {
    const attributes = { 'aria-label': text[locale] };
    return onLanguageChange
      ? h('button', { ...attributes, type: 'button', 'aria-pressed': locale === language, onClick: () => onLanguageChange(locale) }, locale.toUpperCase())
      : h('a', { ...attributes, href: languageLinks[locale], hrefLang: locale, 'aria-current': locale === language ? 'true' : undefined }, locale.toUpperCase());
  };

  return h('div', { className: 'story-header', lang: language, ref: headerRef },
    h('header', { className: 'masthead', dir: 'ltr' },
      h('div', { className: 'brand' },
        h('span', { className: 'monogram', 'aria-hidden': true }, 'mt', h('span', null, '.')),
        h('div', null, h('strong', { lang: 'en' }, 'MOHAMED TOLBA'), h('span', null, text.brand))),
      h('div', { className: 'edition', dir: direction }, h('span', { className: 'edition-dot' }), text.edition),
      h('nav', { className: 'story-links', dir: direction, 'aria-label': text.nav },
        Object.entries(links).map(([target, href]) =>
          h('a', { key: target, href, 'aria-current': active === target ? (target === 'about' ? 'page' : 'location') : undefined }, text[target]))),
      h('div', { className: 'language-control', role: 'group', 'aria-label': text.language },
        languageOption('ar'), h('span', { 'aria-hidden': true }, '|'), languageOption('en'))));
}
