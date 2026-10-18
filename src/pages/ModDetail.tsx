import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { api, type Mod } from '../api';
import { IconDownload, IconGitHub } from '../components/Icons';

export default function ModDetail() {
  const { id = '' } = useParams();
  const { t, i18n } = useTranslation();
  const [mod, setMod] = useState<Mod | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => { api.mod(id).then(setMod).catch(() => setMissing(true)); }, [id]);
  if (missing) return <div className="page"><p className="error">{t('mods.empty')}</p></div>;
  if (!mod) return <div className="page"><p className="muted">…</p></div>;
  return (
    <div className="page">
      <div className="crumbs"><Link to="/mods">{t('nav.mods')}</Link> <span>/</span> {mod.name}</div>
      <div className="mod-detail">
        <div>
          <h1>{mod.name} <span className="pill">{mod.version}</span></h1>
          <p className="lead-sm">{mod.summary}</p>
          <div className="tags">{mod.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
          {mod.readme && <div className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(mod.readme) as string }} />}
        </div>
        <aside className="mod-side card">
          <a className="button block" href={mod.download} target="_blank" rel="noreferrer"><IconDownload size={16} /> {t('mods.get')}</a>
          {mod.repo && <a className="button ghost block" href={mod.repo} target="_blank" rel="noreferrer"><IconGitHub size={16} /> GitHub</a>}
          <dl>
            <dt>{t('mods.author')}</dt><dd>{mod.author}</dd>
            <dt>{t('mods.version')}</dt><dd>{mod.version}</dd>
            <dt>{t('mods.updated')}</dt><dd>{new Date(mod.updatedAt).toLocaleDateString(i18n.resolvedLanguage)}</dd>
          </dl>
          <p className="muted small">{t('mods.install')}</p>
        </aside>
      </div>
    </div>
  );
}
