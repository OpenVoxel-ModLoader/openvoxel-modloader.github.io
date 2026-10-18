import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, type Mod } from '../api';
import { ModCard } from '../components/ModCard';

export default function Mods() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [all, setAll] = useState<Mod[]>([]);
  useEffect(() => { api.mods().then(setAll).catch(() => setAll([])); }, []);
  const tags = useMemo(() => [...new Set(all.flatMap((m) => m.tags))].sort(), [all]);
  const q = query.trim().toLowerCase();
  const mods = all.filter((m) => (!tag || m.tags.includes(tag)) && (!q || `${m.name} ${m.summary} ${m.author}`.toLowerCase().includes(q)));
  return (
    <div className="page">
      <header className="page-head">
        <h1>{t('nav.mods')}</h1>
        <p className="muted">{t('mods.sub')}</p>
      </header>
      <div className="toolbar">
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('mods.search')} />
        <div className="chips">
          <button className={!tag ? 'chip on' : 'chip'} onClick={() => setTag('')}>{t('mods.all')}</button>
          {tags.map((x) => <button key={x} className={tag === x ? 'chip on' : 'chip'} onClick={() => setTag(tag === x ? '' : x)}>{x}</button>)}
        </div>
      </div>
      {mods.length === 0 && <p className="muted">{t('mods.empty')}</p>}
      <div className="grid">{mods.map((m) => <ModCard key={m.id} mod={m} />)}</div>
      <p className="muted small submit">{t('mods.submit')}</p>
    </div>
  );
}
