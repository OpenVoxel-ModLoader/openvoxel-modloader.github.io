import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Mods from './pages/Mods';
import ModDetail from './pages/ModDetail';
import ContentList from './pages/ContentList';
import ContentView from './pages/ContentView';

export default function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="shell">
      <header className="top">
        <Link to="/" className="brand"><span className="cube" /> {t('brand')}</Link>
        <nav>
          <NavLink to="/docs">{t('nav.docs')}</NavLink>
          <NavLink to="/tutorials">{t('nav.tutorials')}</NavLink>
          <NavLink to="/mods">{t('nav.mods')}</NavLink>
          <a href="https://github.com/OpenVoxel-ModLoader" target="_blank" rel="noreferrer">GitHub</a>
          <select aria-label={t('lang')} value={i18n.resolvedLanguage} onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mods" element={<Mods />} />
          <Route path="/mods/:id" element={<ModDetail />} />
          <Route path="/tutorials" element={<ContentList kind="tutorials" />} />
          <Route path="/tutorials/:slug" element={<ContentView kind="tutorials" />} />
          <Route path="/docs" element={<ContentList kind="docs" />} />
          <Route path="/docs/:slug" element={<ContentView kind="docs" />} />
        </Routes>
      </main>
      <footer>{t('footer')}</footer>
    </div>
  );
}
