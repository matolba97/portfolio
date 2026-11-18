import type { ReactElement, Ref } from 'react';
import type { Language } from './localization';

type Destination = 'story' | 'projects' | 'about' | 'contact';

export function PortfolioHeader(props: {
  language: Language;
  links: Record<Destination, string>;
  active: Destination;
  languageLinks?: Record<Language, string>;
  onLanguageChange?: (language: Language) => void;
  headerRef?: Ref<HTMLDivElement>;
}): ReactElement;
