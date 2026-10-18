import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, type Doc } from '../api';
import { IconBook, IconCode } from '../components/Icons';

export default function ContentList({ kind }: { kind: 'docs' | 'tutorials' }) {
  const { t, i18n } = useTranslation();
  const [docs, setDocs] = useState<Doc[]>([]);
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  useEffect(() => { api.content(kind, lang).then(setDocs).catch(() => setDocs([])); }, [kind, lang]);
  return (
    <div className="page">
      <header className="page-head">
        <h1>{t(kind === 'docs' ? 'nav.docs' : 'nav.tutorials')}</h1>
        <p className="muted">{t(kind === 'docs' ? 'content.docsSub' : 'content.tutorialsSub')}</p>
      </header>
      {kind === 'docs' && (
        <div className="javadoc-row">
          <a className="javadoc-card" href={`${import.meta.env.BASE_URL}javadoc/client/index.html`} target="_blank" rel="noreferrer">
            <span className="jd-badge">Javadoc</span><strong>{t('content.javadocClient')}</strong><span className="muted small">ClientMod · ModContext · NativeBlocks · ModConfig · Lang</span>
          </a>
          <a className="javadoc-card" href={`${import.meta.env.BASE_URL}javadoc/server/index.html`} target="_blank" rel="noreferrer">
            <span className="jd-badge">Javadoc</span><strong>{t('content.javadocServer')}</strong><span className="muted small">Permissions</span>
          </a>
        </div>
      )}
      {docs.length === 0 && <p className="muted">{t('content.empty')}</p>}
      <div className="doc-grid">
        {docs.map((d, i) => (
          <Link key={d.slug} to={`/${kind}/${d.slug}`} className="doc-card">
            <span className="doc-num">{kind === 'tutorials' ? String(i + 1).padStart(2, '0') : kind === 'docs' ? <IconBook size={20} /> : <IconCode size={20} />}</span>
            <div><strong>{d.title}</strong><p>{d.summary}</p></div>
            <span className="doc-arrow">→</span>
          </Link>
        ))}
      </div>
      <p className="muted small">{t(kind === 'docs' ? 'content.seeTutorials' : 'content.seeDocs')} <Link to={kind === 'docs' ? '/tutorials' : '/docs'}>{t(kind === 'docs' ? 'nav.tutorials' : 'nav.docs')} →</Link></p>
    </div>
  );
}
