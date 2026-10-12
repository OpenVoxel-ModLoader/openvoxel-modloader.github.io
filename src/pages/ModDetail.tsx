import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { api, type Mod } from '../api';

export default function ModDetail() {
  const { id = '' } = useParams();
  const { t, i18n } = useTranslation();
  const [mod, setMod] = useState<Mod | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => { api.mod(id).then(setMod).catch(() => setMissing(true)); }, [id]);
  if (missing) return <p className="error">{t('mods.empty')}</p>;
  if (!mod) return <p className="muted">…</p>;
  return (
    <article className="detail">
      <header>
        <h1>{mod.name} <span className="pill">{mod.version}</span></h1>
        <p className="muted">{mod.summary}</p>
        <div className="tags">{mod.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
      </header>
      <dl>
        <dt>{t('mods.by', { author: '' })}</dt><dd>{mod.author}</dd>
        <dt>{t('mods.version')}</dt><dd>{mod.version}</dd>
        <dt>{t('mods.updated')}</dt><dd>{new Date(mod.updatedAt).toLocaleDateString(i18n.resolvedLanguage)}</dd>
      </dl>
      <div className="actions">
        <a className="button" href={mod.download} target="_blank" rel="noreferrer">{t('mods.download', { file: mod.download.split('/').pop() })}</a>
        {mod.repo && <a className="button secondary" href={mod.repo} target="_blank" rel="noreferrer">GitHub</a>}
      </div>
      <p className="muted small">{t('mods.install')}</p>
      {mod.readme && <div className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(mod.readme) as string }} />}
    </article>
  );
}
