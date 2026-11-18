const languageLink = document.querySelector('[data-language]');
const preferenceKey = 'mt-portfolio-language';

try {
  const url = new URL(location.href);
  const explicit = url.searchParams.get('lang');
  if (explicit === 'en') {
    localStorage.setItem(preferenceKey, 'en');
    url.searchParams.delete('lang');
    history.replaceState(history.state, '', url);
  } else if (document.documentElement.lang === 'ar') {
    localStorage.setItem(preferenceKey, 'ar');
  } else if (document.body.hasAttribute('data-home') && !location.hash && localStorage.getItem(preferenceKey) === 'ar') {
    location.replace(languageLink.href);
  }
} catch {
  // Both locales also work as ordinary links when browser storage is restricted.
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
