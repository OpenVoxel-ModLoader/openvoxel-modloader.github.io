import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Download from './pages/Download';
import Mods from './pages/Mods';
import ModDetail from './pages/ModDetail';
import ContentList from './pages/ContentList';
import ContentView from './pages/ContentView';
import Changelog from './pages/Changelog';
import Servers from './pages/Servers';
import { IconCube, IconDownload, IconGitHub } from './components/Icons';
import { SITE } from './site';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenu(false), [pathname]);
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return (
    <div className="shell">
      <ScrollToTop />
      <header className="top">
        <div className="top-inner">
          <Link to="/" className="brand">
            <IconCube size={26} className="brand-cube" />
            <span><b>OpenVoxel</b> ModLoader</span>
          </Link>
          <button className="menu-toggle" aria-label={t('nav.menu')} aria-expanded={menu} onClick={() => setMenu(!menu)}><span /><span /><span /></button>
          <nav className={menu ? 'open' : ''}>
            <NavLink to="/download">{t('nav.download')}</NavLink>
            <NavLink to="/docs">{t('nav.docs')}</NavLink>
            <NavLink to="/tutorials">{t('nav.tutorials')}</NavLink>
            <NavLink to="/servers">{t('nav.servers')}</NavLink>
            <NavLink to="/mods">{t('nav.mods')}</NavLink>
            <NavLink to="/changelog">{t('nav.changelog')}</NavLink>
            <span className="nav-spacer" />
            <button className="lang" onClick={() => i18n.changeLanguage(lang === 'es' ? 'en' : 'es')} aria-label={t('lang')}>{lang === 'es' ? 'ES' : 'EN'}</button>
            <a className="icon-link" href={SITE.org} target="_blank" rel="noreferrer" aria-label="GitHub"><IconGitHub /></a>
            <Link to="/download" className="button small-btn"><IconDownload size={16} /> {t('nav.get')}</Link>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/download" element={<Download />} />
          <Route path="/mods" element={<Mods />} />
          <Route path="/mods/:id" element={<ModDetail />} />
          <Route path="/tutorials" element={<ContentList kind="tutorials" />} />
          <Route path="/tutorials/:slug" element={<ContentView kind="tutorials" />} />
          <Route path="/docs" element={<ContentList kind="docs" />} />
          <Route path="/docs/:slug" element={<ContentView kind="docs" />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/docs/changelog" element={<Navigate to="/changelog" replace />} />
          <Route path="*" element={<div className="page narrow-page"><h1>404</h1><p className="muted">{t('content.empty')}</p><Link className="button" to="/">{t('nav.home')}</Link></div>} />
        </Routes>
      </main>
      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-brand">
            <Link to="/" className="brand"><IconCube size={22} className="brand-cube" /><span><b>OpenVoxel</b> ModLoader</span></Link>
            <p className="muted small">{t('footer.about')}</p>
          </div>
          <div>
            <h4>{t('footer.players')}</h4>
            <Link to="/download">{t('nav.download')}</Link>
            <Link to="/docs/getting-started">{t('footer.install')}</Link>
            <Link to="/tutorials/resource-packs">{t('footer.packs')}</Link>
            <Link to="/mods">{t('nav.mods')}</Link>
          </div>
          <div>
            <h4>{t('footer.developers')}</h4>
            <Link to="/tutorials/first-mod">{t('footer.firstMod')}</Link>
            <Link to="/docs/api">{t('footer.api')}</Link>
            <Link to="/tutorials/server-plugin">{t('footer.plugins')}</Link>
            <Link to="/servers">{t('nav.servers')}</Link>
            <a href={SITE.template} target="_blank" rel="noreferrer">{t('footer.template')}</a>
          </div>
          <div>
            <h4>{t('footer.project')}</h4>
            <a href={SITE.org} target="_blank" rel="noreferrer">GitHub</a>
            <Link to="/changelog">{t('nav.changelog')}</Link>
            <a href={`${SITE.org}/ModLoader-Client/issues`} target="_blank" rel="noreferrer">{t('footer.issues')}</a>
            <a href="https://open-voxel.net" target="_blank" rel="noreferrer">open-voxel.net</a>
          </div>
        </div>
        <p className="foot-legal">{t('footer.legal')}</p>
      </footer>
    </div>
  );
}
