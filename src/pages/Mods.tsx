import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, type Mod } from '../api';
import { ModCard } from '../components/ModCard';

export default function Mods() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [mods, setMods] = useState<Mod[]>([]);
  useEffect(() => {
    const handle = setTimeout(() => api.mods(query).then(setMods).catch(() => setMods([])), 200);
    return () => clearTimeout(handle);
  }, [query]);
  return (
    <section>
      <div className="search">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('mods.search')} autoFocus />
      </div>
      {mods.length === 0 && <p className="muted">{t('mods.empty')}</p>}
      <div className="grid">{mods.map((m) => <ModCard key={m.id} mod={m} />)}</div>
    </section>
  );
}
