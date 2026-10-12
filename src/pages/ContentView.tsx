import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { api, type Doc } from '../api';

export default function ContentView({ kind }: { kind: 'docs' | 'tutorials' }) {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [missing, setMissing] = useState(false);
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  useEffect(() => { setDoc(null); api.doc(kind, slug, lang).then(setDoc).catch(() => setMissing(true)); }, [kind, slug, lang]);
  if (missing) return <p className="error">{t('content.empty')}</p>;
  if (!doc) return <p className="muted">…</p>;
  return (
    <article className="detail">
      <Link to={`/${kind}`} className="muted">← {t(kind === 'docs' ? 'nav.docs' : 'nav.tutorials')}</Link>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(doc.body ?? '') as string }} />
    </article>
  );
}
