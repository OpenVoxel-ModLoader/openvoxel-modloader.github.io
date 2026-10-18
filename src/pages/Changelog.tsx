import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { api, type Doc } from '../api';
import { SITE } from '../site';

type Release = { title: string; id: string; html: string; tag: 'next' | 'beta' | 'stable' };

/** Splits the changelog markdown into one card per "## version" section. */
function split(md: string): Release[] {
  const parts = md.split(/^## /m).slice(1);
  return parts.map((p) => {
    const nl = p.indexOf('\n');
    const title = p.slice(0, nl).trim();
    const body = p.slice(nl + 1);
    const low = title.toLowerCase();
    const tag = low.includes('next') || low.includes('próxima') ? 'next' : low.includes('pre') || low.includes('beta') ? 'beta' : 'stable';
    return { title, id: title.split(' ')[0].replace(/[^a-z0-9.-]/gi, '').toLowerCase() || 'next', html: marked.parse(body) as string, tag };
  });
}

export default function Changelog() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  const [doc, setDoc] = useState<Doc | null>(null);
  useEffect(() => { api.doc('changelog', 'changelog', lang).then(setDoc).catch(() => setDoc(null)); }, [lang]);
  const releases = useMemo(() => split(doc?.body ?? ''), [doc]);
  return (
    <div className="page changelog">
      <header className="page-head">
        <h1>{t('changelog.title')}</h1>
        <p className="muted">{t('changelog.sub')}</p>
        <div className="actions">
          <Link className="button" to="/download">{t('nav.download')}</Link>
          <a className="button ghost" href={`${SITE.org}/ModLoader-Client/releases`} target="_blank" rel="noreferrer">{t('changelog.releases')}</a>
        </div>
      </header>
      <div className="timeline">
        {releases.map((r) => (
          <article key={r.title} id={r.id} className={`release ${r.tag}`}>
            <div className="release-dot" />
            <div className="release-body">
              <div className="release-head">
                <h2>{r.title}</h2>
                <span className={`badge ${r.tag === 'stable' ? 'ok' : 'beta'}`}>{t(`changelog.tag.${r.tag}`)}</span>
              </div>
              <div className="markdown" dangerouslySetInnerHTML={{ __html: r.html }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
