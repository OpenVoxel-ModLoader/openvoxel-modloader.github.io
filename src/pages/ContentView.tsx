import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { api, type Doc } from '../api';

type Heading = { id: string; text: string; level: number };

function decode(s: string) { return s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }

function slugify(s: string) { return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); }

/** Renders markdown with ids on h2/h3 (for the "on this page" list). */
function render(md: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const id = slugify(decode(text));
    if (depth === 2 || depth === 3) headings.push({ id, text: decode(text), level: depth });
    return `<h${depth} id="${id}"><a class="anchor" href="#${id}">#</a>${text}</h${depth}>`;
  };
  return { html: marked.parse(md, { renderer }) as string, headings };
}

export default function ContentView({ kind }: { kind: 'docs' | 'tutorials' }) {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [tutorials, setTutorials] = useState<Doc[]>([]);
  const [filter, setFilter] = useState('');
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { api.content('docs', lang).then(setDocs); api.content('tutorials', lang).then(setTutorials); }, [lang]);
  const list = kind === 'docs' ? docs : tutorials;
  const index = list.findIndex((d) => d.slug === slug);
  const doc = index >= 0 ? list[index] : null;
  const { html, headings } = useMemo(() => render(doc?.body ?? ''), [doc]);

  // copy buttons on code blocks; anchors scroll inside the hash router
  useEffect(() => {
    const root = body.current;
    if (!root) return;
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy')) return;
      const b = document.createElement('button');
      b.className = 'copy'; b.textContent = t('content.copy');
      b.onclick = () => navigator.clipboard?.writeText(pre.querySelector('code')?.textContent ?? '').then(() => { b.textContent = t('content.copied'); setTimeout(() => (b.textContent = t('content.copy')), 1400); });
      pre.appendChild(b);
    });
    root.querySelectorAll<HTMLAnchorElement>('a.anchor').forEach((a) => {
      a.onclick = (ev) => { ev.preventDefault(); document.getElementById(a.getAttribute('href')!.slice(1))?.scrollIntoView({ behavior: 'smooth' }); };
    });
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]').forEach(() => {});
  }, [html, t]);

  const match = (d: Doc) => !filter || d.title.toLowerCase().includes(filter.toLowerCase());
  if (docs.length === 0 && tutorials.length === 0) return <div className="page"><p className="muted">…</p></div>;
  if (!doc) return <div className="page"><p className="error">{t('content.empty')}</p><Link to={`/${kind}`}>← {t(kind === 'docs' ? 'nav.docs' : 'nav.tutorials')}</Link></div>;
  const prev = index > 0 ? list[index - 1] : null, next = index < list.length - 1 ? list[index + 1] : null;
  return (
    <div className="docs-layout">
      <aside className="sidebar">
        <input className="side-search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t('content.filter')} />
        <h4>{t('nav.docs')}</h4>
        {docs.filter(match).map((d) => <NavLink key={d.slug} to={`/docs/${d.slug}`}>{d.title}</NavLink>)}
        <h4>{t('nav.tutorials')}</h4>
        {tutorials.filter(match).map((d) => <NavLink key={d.slug} to={`/tutorials/${d.slug}`}>{d.title}</NavLink>)}
      </aside>
      <article className="doc">
        <div className="crumbs"><Link to={`/${kind}`}>{t(kind === 'docs' ? 'nav.docs' : 'nav.tutorials')}</Link> <span>/</span> {doc.title}</div>
        <div className="markdown" ref={body} dangerouslySetInnerHTML={{ __html: html }} />
        <div className="prevnext">
          {prev ? <Link to={`/${kind}/${prev.slug}`} className="pn"><span className="muted small">← {t('content.prev')}</span><strong>{prev.title}</strong></Link> : <span />}
          {next ? <Link to={`/${kind}/${next.slug}`} className="pn right"><span className="muted small">{t('content.next')} →</span><strong>{next.title}</strong></Link> : <span />}
        </div>
      </article>
      {headings.length > 1 && (
        <nav className="toc" aria-label={t('content.onPage')}>
          <h4>{t('content.onPage')}</h4>
          {headings.map((h) => <a key={h.id} className={`l${h.level}`} href={`#${h.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{h.text}</a>)}
        </nav>
      )}
    </div>
  );
}
