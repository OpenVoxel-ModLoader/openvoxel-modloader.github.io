import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Mod } from '../api';

export function ModCard({ mod }: { mod: Mod }) {
  const { t } = useTranslation();
  return (
    <Link to={`/mods/${mod.id}`} className="card mod-card">
      <div className="mod-title"><strong>{mod.name}</strong><span className="pill">{mod.version}</span></div>
      <p>{mod.summary}</p>
      <div className="meta"><span>{t('mods.by', { author: mod.author })}</span></div>
      <div className="tags">{mod.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
    </Link>
  );
}
