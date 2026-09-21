import React, { useEffect, useState } from 'react';
import { translations, icons, names, gameLinks } from './content.js';

const STORAGE_KEY = 'seven-lizards-language';

function isUsable(url) {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function ResourceCard({ id, t }) {
  const url = gameLinks[id];
  const enabled = isUsable(url);
  const Tag = enabled ? 'a' : 'div';
  const props = enabled
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : { 'aria-disabled': 'true', title: t.unavailable };

  return (
    <Tag className="resource" {...props}>
      <span className={`resource-icon ${id}`} aria-hidden="true">
        {id === 'facebook' ? (
          <span className="facebook-glyph"><span>f</span></span>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: icons[id] }} />
        )}
      </span>
      <span className="resource-text">
        <span className="resource-name">{names[id] || t.websiteName}</span>
        <span className="resource-desc">{t[id]}</span>
        {enabled && <span className="sr-only">{t.newTab}</span>}
      </span>
      <span className={`resource-end${enabled ? '' : ' coming'}`} aria-hidden={enabled || undefined}>
        {enabled ? '↗' : t.soon}
      </span>
    </Tag>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'uk';
    } catch {
      return 'uk';
    }
  });

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = t.description;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }, [language, t]);

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>

      <main id="main">
        <section className="hero" id="about" aria-labelledby="game-title">
          <img
            className="hero-bg"
            src="assets/hero-city.webp"
            width="1536"
            height="1024"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <header className="header wrap">
            <a className="brand" href="#main" aria-label="Seven Lizards">
              <img
                src="assets/logo-crest.webp"
                width="560"
                height="560"
                alt=""
                fetchPriority="high"
              />
            </a>
            <nav aria-label={language === 'uk' ? 'Навігація' : 'Navigation'}>
              <a href="#about">{t.navAbout}</a>
              <a href="#links">{t.navLinks}</a>
              <a href="#rules">{t.navRules}</a>
            </nav>
            <div className="languages" role="group" aria-label="Language / Мова">
              <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
              <button type="button" onClick={() => setLanguage('uk')} aria-pressed={language === 'uk'}>UA</button>
            </div>
          </header>
          <div className="hero-copy wrap">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 id="game-title">
              <span className="title-line" data-text={t.title1}>{t.title1}</span>
              <span className="title-line accent" data-text={t.title2}>{t.title2}</span>
            </h1>
            <p className="tagline">{t.tagline}</p>
            <p className="description">{t.description}</p>
            <ul className="facts">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="9" cy="7" r="3" />
                  <path d="M3 20v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2-4" />
                </svg>
                <span>{t.players}</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9" />
                </svg>
                <span>{t.genre}</span>
              </li>
            </ul>
            <div className="hero-actions">
              <a className="button primary" href="#rules">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V4Z" />
                </svg>
                <span>{t.learn}</span>
              </a>
              <a className="text-link" href="#links">
                <span>{t.allLinks}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <img
            className="hero-art"
            src="assets/scene-builders.webp"
            width="1000"
            height="1500"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </section>

        <section className="panel wrap" id="links" aria-labelledby="links-title">
          <img
            className="panel-art blueprints"
            src="assets/scene-blueprints.webp"
            width="1100"
            height="733"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.stay}</p>
              <h2 id="links-title">{t.linksTitle}</h2>
            </div>
            <p>{t.linksIntro}</p>
          </div>
          <div className="resource-grid">
            {Object.keys(icons).map((key) => (
              <ResourceCard key={key} id={key} t={t} />
            ))}
          </div>
        </section>

        <section className="panel wrap" id="rules" aria-labelledby="rules-title">
          <img
            className="panel-art helmet"
            src="assets/scene-helmet.webp"
            width="1100"
            height="733"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="rules-inner">
            <div className="rules-copy">
              <p className="eyebrow">{t.before}</p>
              <h2 id="rules-title">{t.rulesTitle}</h2>
              <p>{t.rulesText}</p>
              <span className="file-meta">{t.fileMeta}</span>
            </div>
            <div className="rules-actions">
              <a className="button dark" href="assets/rules-uk.pdf" download="Seven-Lizards-Rules-UA.pdf">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6" />
                </svg>
                <span>{t.download}</span>
              </a>
              <a className="read-link" href="assets/rules-uk.pdf" target="_blank" rel="noopener noreferrer">
                <span>{t.read}</span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">{t.newTab}</span>
              </a>
            </div>
          </div>
        </section>

        <figure className="game-visual wrap">
          <div className="game-image">
            <img
              src="assets/game-clean.webp"
              width="1833"
              height="858"
              alt={t.gameAlt}
              loading="lazy"
            />
          </div>
          <figcaption>
            <span className="edition">{t.edition}</span>
            <span className="visual-note">{t.visualNote}</span>
          </figcaption>
        </figure>
      </main>

      <div className="foundation-band" aria-hidden="true">
        <img src="assets/band-foundation.webp" width="1920" height="570" alt="" loading="lazy" />
      </div>

      <footer>
        <div className="footer-inner wrap">
          <a href="#main" className="footer-brand">
            Seven Lizards
            <span>{t.footerBrand}</span>
          </a>
          <p>{t.footerNote}</p>
          <span className="copyright">© {new Date().getFullYear()} Seven Lizards</span>
        </div>
      </footer>
    </>
  );
}
