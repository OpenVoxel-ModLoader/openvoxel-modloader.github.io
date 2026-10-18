import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, type Mod } from '../api';
import { ModCard } from '../components/ModCard';

const CLIENT_ZIP = 'https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/latest/download/ModLoader-Client-v1.0.0-vgame-0.0.8.zip';
const SERVER_ZIP = 'https://github.com/OpenVoxel-ModLoader/ModLoader-Server/releases/latest/download/ModLoader-Server-v1.0.0-vgame-0.0.8.zip';
const CLIENT_JAR = 'https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/latest/download/ModLoader-v1.0.0-vgame-0.0.8-client.jar';
const BETA_ZIP = 'https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/download/v1.1.0-pre1/ModLoader-Client-v1.1.0-pre1-vgame-0.0.8.zip';
const SERVER_JAR = 'https://github.com/OpenVoxel-ModLoader/ModLoader-Server/releases/latest/download/ModLoader-v1.0.0-vgame-0.0.8-server.jar';

export default function Home() {
  const { t } = useTranslation();
  const [mods, setMods] = useState<Mod[]>([]);
  useEffect(() => { api.mods().then((m) => setMods(m.filter((x) => x.tags.includes('example')).slice(0, 4))).catch(() => setMods([])); }, []);
  const clientSteps = t('home.client.steps', { returnObjects: true }) as string[];
  const serverSteps = t('home.server.steps', { returnObjects: true }) as string[];
  return (
    <>
      <section className="hero">
        <h1>{t('brand')}</h1>
        <p>{t('tagline')}</p>
        <p className="muted small">{t('home.version')}</p>
      </section>

      <section className="downloads">
        <article className="card download">
          <h2>{t('home.client.title')}</h2>
          <p>{t('home.client.text')}</p>
          <a className="button big" href={CLIENT_ZIP}>{t('home.download.zip')} <small>ModLoader-Client-v1.0.0-vgame-0.0.8.zip</small></a>
          <a className="muted small" href={CLIENT_JAR}>{t('home.download.jarOnly')}</a>
          <ol>{clientSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <p className="muted small">{t('home.client.contains')}</p>
        </article>
        <article className="card download">
          <h2>{t('home.server.title')}</h2>
          <p>{t('home.server.text')}</p>
          <a className="button big secondary" href={SERVER_ZIP}>{t('home.download.zip')} <small>ModLoader-Server-v1.0.0-vgame-0.0.8.zip</small></a>
          <a className="muted small" href={SERVER_JAR}>{t('home.download.jarOnly')}</a>
          <ol>{serverSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <p className="muted small">{t('home.server.contains')}</p>
        </article>
      </section>

      <section className="card whatsnew">
        <h2>{t('home.whatsnew')}</h2>
        <p className="muted small">{t('home.beta.note')}</p>
        <ul>{(t('home.whatsnewItems', { returnObjects: true }) as string[]).map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="actions">
          <a className="button secondary" href={BETA_ZIP}>{t('home.beta.download')} <small>v1.1.0-pre1</small></a>
          <Link className="muted small" to="/docs/changelog">{t('home.links.changelog')} →</Link>
        </div>
      </section>

      <section className="features">
        <h2>{t('home.features.title')}</h2>
        <div className="grid">
          {(t('home.features.items', { returnObjects: true }) as { title: string; text: string }[]).map((f) => (
            <div key={f.title} className="card"><strong>{f.title}</strong><p className="muted">{f.text}</p></div>
          ))}
        </div>
      </section>

      <section>
        <h2>{t('home.start')}</h2>
        <div className="actions">
          <Link className="button" to="/tutorials/first-mod">{t('home.links.firstMod')}</Link>
          <Link className="button secondary" to="/docs/api">{t('home.links.api')}</Link>
          <Link className="button secondary" to="/tutorials/server-plugin">{t('home.links.serverPlugin')}</Link>
          <a className="button secondary" href="https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples/tree/master/mod-template" target="_blank" rel="noreferrer">{t('home.links.template')}</a>
        </div>
      </section>

      {mods.length > 0 && (
        <section>
          <h2>{t('home.examples')}</h2>
          <div className="grid">{mods.map((m) => <ModCard key={m.id} mod={m} />)}</div>
        </section>
      )}
    </>
  );
}
