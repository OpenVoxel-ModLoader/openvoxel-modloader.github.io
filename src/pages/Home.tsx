import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, type Mod } from '../api';
import { ModCard } from '../components/ModCard';

export default function Home() {
  const { t } = useTranslation();
  const [mods, setMods] = useState<Mod[]>([]);
  useEffect(() => { api.mods().then((m) => setMods(m.slice(0, 6))).catch(() => setMods([])); }, []);
  return (
    <>
      <section className="hero">
        <h1>{t('brand')}</h1>
        <p>{t('tagline')}</p>
        <div className="actions center">
          <Link className="button" to="/docs/getting-started">{t('home.get')}</Link>
          <Link className="button secondary" to="/tutorials/first-mod">{t('home.start')}</Link>
        </div>
        <p className="muted small">{t('home.getText')}</p>
      </section>
      <section>
        <h2>{t('home.latest')}</h2>
        <div className="grid">{mods.map((m) => <ModCard key={m.id} mod={m} />)}</div>
      </section>
    </>
  );
}
