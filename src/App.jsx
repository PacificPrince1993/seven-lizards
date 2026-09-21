import React, { useEffect, useState } from 'react';
import { translations, icons, names, gameLinks } from './content.js';

function ResourceCard({ id, t }) {
  const url = gameLinks[id];
  let enabled = false;
  try { enabled = ['http:', 'https:'].includes(new URL(url).protocol); } catch {}
  const Tag = enabled ? 'a' : 'div';
  return <Tag className="resource" {...(enabled ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { 'aria-disabled': true, title: t.unavailable })}>
    <span className={`resource-icon ${id}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[id] }} />
    <span><span className="resource-name">{names[id] || t.websiteName}</span><span className="resource-desc">{t[id]}</span>{enabled && <span className="sr-only">{t.newTab}</span>}</span>
    <span className={`resource-end${enabled ? '' : ' coming'}`} aria-hidden={enabled || undefined}>{enabled ? '↗' : t.soon}</span>
  </Tag>;
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('seven-lizards-language') === 'en' ? 'en' : 'uk'; } catch { return 'uk'; }
  });
  const t = translations[language];
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]').content = t.description;
    try { localStorage.setItem('seven-lizards-language', language); } catch {}
  }, [language, t]);
  return <>

  <a className="skip-link" href="#main" data-i18n="skip">{t.skip}</a>
  <header className="header wrap">
    <a className="brand" href="#" aria-label="Seven Lizards"><img src="assets/logo.webp" width="58" height="58" alt="" /><span>SEVEN LIZARDS<small data-i18n="brand">{t.brand}</small></span></a>
    <nav aria-label={language === "uk" ? "Навігація" : "Navigation"}><a href="#about" data-i18n="navAbout">{t.navAbout}</a><a href="#links" data-i18n="navLinks">{t.navLinks}</a><a href="#rules" data-i18n="navRules">{t.navRules}</a></nav>
    <div className="languages" role="group" aria-label="Language / Мова"><button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button><button type="button" onClick={() => setLanguage("uk")} aria-pressed={language === "uk"}>UA</button></div>
  </header>
  <main id="main">
    <section className="hero wrap" id="about" aria-labelledby="game-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="small-dice" aria-hidden="true">⠿</span><span data-i18n="eyebrow">{t.eyebrow}</span></p>
        <h1 id="game-title"><span data-i18n="title1">{t.title1}</span><br /><span className="accent" data-i18n="title2">{t.title2}</span><span className="title-dot">.</span></h1>
        <p className="tagline" data-i18n="tagline">{t.tagline}</p>
        <p className="description" data-i18n="description">{t.description}</p>
        <div className="facts"><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2-4"/></svg><b data-i18n="players">{t.players}</b></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9"/></svg><b data-i18n="genre">{t.genre}</b></span></div>
        <div className="hero-actions"><a className="button primary" href="#rules"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V4Z"/></svg><span data-i18n="learn">{t.learn}</span><span aria-hidden="true">↗</span></a><a className="text-link" href="#links"><span data-i18n="allLinks">{t.allLinks}</span><span aria-hidden="true">↓</span></a></div>
      </div>
      <figure className="game-visual"><div className="visual-top"><span>SEVEN LIZARDS</span><span aria-hidden="true">✳</span></div><div className="game-image"><img src="assets/game-clean.webp" width="1710" height="800" alt={t.gameAlt} data-alt="gameAlt" /></div><figcaption><span className="edition" data-i18n="edition">{t.edition}</span><span className="visual-note" data-i18n="visualNote">{t.visualNote}</span></figcaption><span className="image-index" aria-hidden="true">SEVEN LIZARDS</span></figure>
    </section>
    <section className="resources wrap" id="links" aria-labelledby="links-title"><div className="section-heading"><div><p className="eyebrow" data-i18n="stay">{t.stay}</p><h2 id="links-title" data-i18n="linksTitle">{t.linksTitle}</h2></div><p data-i18n="linksIntro">{t.linksIntro}</p></div><div className="resource-grid">{Object.keys(icons).map(key => <ResourceCard key={key} id={key} t={t} />)}</div></section>
    <section className="rules wrap" id="rules" aria-labelledby="rules-title"><div className="rules-inner"><div className="rule-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V4Z"/></svg></div><div className="rules-copy"><p className="eyebrow" data-i18n="before">{t.before}</p><h2 id="rules-title" data-i18n="rulesTitle">{t.rulesTitle}</h2><p data-i18n="rulesText">{t.rulesText}</p><span className="file-meta" data-i18n="fileMeta">{t.fileMeta}</span></div><div className="rules-actions"><a className="button dark" href="assets/rules-uk.pdf" download="Seven-Lizards-Rules-UA.pdf"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/></svg><span data-i18n="download">{t.download}</span></a><a className="read-link" href="assets/rules-uk.pdf" target="_blank" rel="noopener"><span data-i18n="read">{t.read}</span> <span aria-hidden="true">↗</span><span className="sr-only" data-i18n="newTab">{t.newTab}</span></a></div></div></section>
  </main>
  <footer><div className="footer-inner wrap"><a href="#" className="footer-brand">SEVEN LIZARDS<span data-i18n="footerBrand">{t.footerBrand}</span></a><p data-i18n="footerNote">{t.footerNote}</p><span className="copyright">© <span>{new Date().getFullYear()}</span> Seven Lizards</span></div></footer>

  </>;
}
