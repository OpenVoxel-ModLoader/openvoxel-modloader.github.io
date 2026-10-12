import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, type Doc } from '../api';

export default function ContentList({ kind }: { kind: 'docs' | 'tutorials' }) {
  const { t, i18n } = useTranslation();
  const [docs, setDocs] = useState<Doc[]>([]);
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  useEffect(() => { api.content(kind, lang).then(setDocs).catch(() => setDocs([])); }, [kind, lang]);
  return (
    <section>
      <h1>{t(kind === 'docs' ? 'nav.docs' : 'nav.tutorials')}</h1>
      {docs.length === 0 && <p className="muted">{t('content.empty')}</p>}
      <div className="list">
        {docs.map((d) => (
          <Link key={d.slug} to={`/${kind}/${d.slug}`} className="card row">
            <div><strong>{d.title}</strong><p className="muted">{d.summary}</p></div>
            <span className="button secondary">{t('content.read')}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
