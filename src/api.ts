/** Static data layer: markdown bundled at build time, mods list from public/mods.json. */

export interface Mod {
  id: string; name: string; version: string; summary: string; author: string; tags: string[];
  download: string; repo?: string; updatedAt: string; readme?: string;
}

export interface Doc { slug: string; lang: string; title: string; summary: string; order: number; body?: string }

const files = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(kind: string, slug: string, lang: string, text: string): Doc {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta: Record<string, string> = {};
  if (match) for (const line of match[1].split(/\r?\n/)) { const at = line.indexOf(':'); if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim(); }
  return { slug, lang, title: meta.title ?? slug, summary: meta.summary ?? '', order: Number(meta.order ?? 100), body: match ? text.slice(match[0].length) : text };
}

export type Kind = 'docs' | 'tutorials' | 'changelog';

function load(kind: Kind, lang: string): Doc[] {
  const bySlug = new Map<string, Doc>();
  for (const [path, text] of Object.entries(files)) {
    const m = path.match(/\/content\/([^/]+)\/(.+)\.([a-z]{2})\.md$/);
    if (!m || m[1] !== kind) continue;
    const [, , slug, fileLang] = m;
    const doc = parse(kind, slug, fileLang, text);
    const current = bySlug.get(slug);
    if (!current || fileLang === lang || (current.lang !== lang && fileLang === 'en')) bySlug.set(slug, doc);
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export const api = {
  mods: async (q = '') => {
    const res = await fetch(`${import.meta.env.BASE_URL}mods.json`);
    const list = (await res.json()) as Mod[];
    const needle = q.trim().toLowerCase();
    return list.filter((m) => !needle || m.name.toLowerCase().includes(needle) || m.summary.toLowerCase().includes(needle) || m.author.toLowerCase().includes(needle))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  mod: async (id: string) => { const m = (await api.mods()).find((x) => x.id === id); if (!m) throw new Error('404'); return m; },
  content: async (kind: Kind, lang: string) => load(kind, lang),
  doc: async (kind: Kind, slug: string, lang: string) => { const d = load(kind, lang).find((x) => x.slug === slug); if (!d) throw new Error('404'); return d; }
};
