import { MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { activeSection, sectionAnchors } from "./navigation";
import { LINKEDIN_URL, story } from "./story";
import type { SlideId } from "./story";
import { readLanguage, saveLanguage, translations } from "./localization";
import type { Language, SceneProps } from "./localization";
import { PortfolioHeader } from "./portfolio-header.mjs";
import ResponsibilitiesScene from "./scenes/ResponsibilitiesScene";
import ProblemScene from "./scenes/ProblemScene";
import InsightScene from "./scenes/InsightScene";
import WorkflowScene from "./scenes/WorkflowScene";
import HelloScene from "./scenes/HelloScene";

const scenes: Record<SlideId, ComponentType<SceneProps>> = {
  problem: ProblemScene,
  insight: InsightScene,
  workflow: WorkflowScene,
  responsibilities: ResponsibilitiesScene,
  hello: HelloScene,
};

function initialLanguage() {
  const specified = new URLSearchParams(window.location.search).get("lang");
  return specified === "ar" || specified === "en" ? specified : readLanguage();
}

const StorySection = memo(function StorySection({
  entry,
  index,
  language,
  reduced,
}: {
  entry: (typeof story)[number];
  index: number;
  language: Language;
  reduced: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { once: true });
  const slide = entry[language];
  const text = translations[language];
  const direction = language === "ar" ? "rtl" : "ltr";
  const Scene = scenes[entry.id];
  const Heading = index === 0 ? "h1" : "h2";
  const closing = entry.id === "hello";
  const showArt = index === 0 || inView;

  return (
    <section
      ref={section}
      className="story-section"
      id={sectionAnchors[index]}
      tabIndex={-1}
      aria-labelledby={`headline-${index}`}
      data-scene={entry.id}
    >
      <motion.div
        className={`slide slide-${entry.id}`}
        initial={index === 0 || reduced ? false : { opacity: 0.9, y: 10 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: reduced ? 0 : 0.32, ease: "easeOut" }}
      >
        <div className="scene-panel">
          <div
            className="scene-art"
            style={showArt ? undefined : { aspectRatio: entry.id === "responsibilities" ? "26 / 19" : "4 / 3" }}
          >
            {showArt && <Scene language={language} />}
          </div>
          <p className="scene-note" dir={direction} lang={language}>{slide.note}</p>
        </div>
        <div className="slide-copy" dir={direction}>
          <p className="chapter" dir={direction} lang={language}>
            <span className="chapter-line" />
            {slide.chapter}
            <span className="chapter-index">/ 0{index + 1}</span>
          </p>
          <p className="eyebrow">{slide.eyebrow}</p>
          <Heading className="scene-headline" id={`headline-${index}`}>{slide.headline}</Heading>
          {closing && (
            <p className="professional-title" dir={direction} lang={language}>{text.professionalTitle}</p>
          )}
          <p className="supporting-copy">{slide.copy}</p>
          {slide.responsibilities && (
            <ol className="responsibility-list">
              {slide.responsibilities.map((group, i) => (
                <motion.li
                  key={group.title}
                  initial={reduced ? false : { opacity: 0.9, y: 6 }}
                  animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.045 }}
                >
                  <span className="responsibility-number" aria-hidden="true">0{i + 1}</span>
                  <div>
                    <h2><bdi lang="en">{group.title}</bdi></h2>
                    <p>{group.copy}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
          {closing && (
            <a
              className="linkedin-cta"
              id="contact"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              dir={direction}
              lang={language}
            >
              <span className="linkedin-icon" aria-hidden="true">in</span>
              <span>{text.cta}</span>
              <span className="external-arrow" aria-hidden="true">↗</span>
              <span className="sr-only">{text.newTab}</span>
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
});

function Presentation() {
  const [language, setLanguage] = useState(initialLanguage);
  const [current, setCurrent] = useState(0);
  const [hash, setHash] = useState(() => window.location.hash);
  const header = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const footer = useRef<HTMLDivElement>(null);
  const localeAnchor = useRef<HTMLElement | null>(null);
  const text = translations[language];
  const direction = language === "ar" ? "rtl" : "ltr";
  const reduced = Boolean(useReducedMotion());
  const projectsHref = language === "ar" ? "./ar/projects/" : "./projects/";
  const aboutHref = language === "ar" ? "./ar/about/" : "./about/";
  const lastChapter = current === story.length - 1;
  const activeLink = lastChapter && hash === "#contact" ? "contact" : "story";

  useEffect(() => {
    if (hash === "#work") window.location.replace(projectsHref);
    if (hash === "#about") window.location.replace(aboutHref);
  }, [aboutHref, hash, projectsHref]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = direction;
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      window.history.replaceState(window.history.state, "", url);
    }
    document.title = text.title;
    for (const [selector, content] of [
      ['meta[name="description"]', text.description],
      ['meta[property="og:title"]', text.title],
      ['meta[property="og:description"]', text.description],
      ['meta[property="og:locale"]', language === "ar" ? "ar_EG" : "en_US"],
    ]) {
      document.querySelector(selector)?.setAttribute("content", content);
    }
    saveLanguage(language);
    localeAnchor.current?.scrollIntoView({ behavior: "instant" });
    localeAnchor.current = null;
  }, [language, direction, text]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(stage.current!.querySelectorAll<HTMLElement>(".story-section"));
    const headerElement = header.current!;
    const footerElement = footer.current!;
    let frame = 0;
    root.classList.add("story-scroll");

    function updateProgress() {
      frame = 0;
      const top = headerElement.getBoundingClientRect().bottom;
      const bottom = footerElement.getBoundingClientRect().top;
      const readingLine = top + Math.max(0, bottom - top) * 0.3;
      setCurrent(activeSection(elements.map((section) => section.getBoundingClientRect().top), readingLine));
    }

    function requestProgress() {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    }

    function measureChrome() {
      root.style.setProperty("--story-header-height", `${headerElement.offsetHeight}px`);
      root.style.setProperty("--story-progress-height", `${footerElement.offsetHeight}px`);
      requestProgress();
    }

    function syncHash() {
      setHash(window.location.hash);
      requestProgress();
    }

    measureChrome();
    const initialAnchor = document.getElementById(window.location.hash.slice(1));
    initialAnchor?.scrollIntoView({ behavior: "instant" });

    const observer = new ResizeObserver(measureChrome);
    observer.observe(headerElement);
    observer.observe(footerElement);
    observer.observe(stage.current!);
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);
    window.addEventListener("hashchange", syncHash);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", requestProgress);
      window.removeEventListener("hashchange", syncHash);
      root.classList.remove("story-scroll");
      root.style.removeProperty("--story-header-height");
      root.style.removeProperty("--story-progress-height");
    };
  }, []);

  return (
    <div className="presentation" data-reduced-motion={reduced} lang={language} dir={direction}>
      <PortfolioHeader
        language={language}
        links={{ story: "#story", projects: projectsHref, about: aboutHref, contact: "#contact" }}
        active={activeLink}
        onLanguageChange={(locale) => {
          if (locale === language) return;
          if (current > 0) {
            localeAnchor.current = document.getElementById(sectionAnchors[current]);
          }
          setLanguage(locale);
        }}
        headerRef={header}
      />
      <main className="story-stage" ref={stage} aria-label={text.presentation}>
        {story.map((entry, index) => (
          <StorySection key={entry.id} entry={entry} index={index} language={language} reduced={reduced} />
        ))}
      </main>
      <div className="story-progress" ref={footer}>
        <div className="story-progress-inner">
          <div className="progress" role="status" aria-atomic="true" data-active-chapter={current + 1}>
            <span className="sr-only">{text.slide} {current + 1} {text.of} {story.length} — </span>
            <span className="page-number" dir="ltr" aria-hidden="true">
              0{current + 1}<span> / {String(story.length).padStart(2, "0")}</span>
            </span>
            <span className="progress-bars" aria-hidden="true">
              {story.map((entry, index) => (
                <span key={entry.id} className={index === current ? "filled" : ""} />
              ))}
            </span>
            <span className="progress-chapter">{story[current][language].chapter}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Presentation />
    </MotionConfig>
  );
}
