import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Mod } from '../api';
import { IconCode, IconCube, IconServer } from './Icons';

export function ModCard({ mod }: { mod: Mod }) {
  const { t } = useTranslation();
  const icon = mod.tags.includes('server') ? <IconServer /> : mod.tags.includes('loader') ? <IconCube /> : <IconCode />;
  return (
    <Link to={`/mods/${mod.id}`} className="card mod-card">
      <div className="mod-top">
        <span className="mod-icon">{icon}</span>
        <div className="mod-title"><strong>{mod.name}</strong><span className="muted small">{t('mods.by', { author: mod.author })}</span></div>
        <span className="pill">{mod.version}</span>
      </div>
      <p>{mod.summary}</p>
      <div className="tags">{mod.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
    </Link>
  );
}
