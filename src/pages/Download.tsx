import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconDownload, IconPlay, IconServer } from '../components/Icons';
import { SITE } from '../site';

type Channel = 'stable' | 'beta';
type Os = 'windows' | 'linux';

export default function Download() {
  const { t } = useTranslation();
  const [channel, setChannel] = useState<Channel>('stable');
  const [os, setOs] = useState<Os>(navigator.userAgent.includes('Linux') ? 'linux' : 'windows');
  const rel = channel === 'stable' ? SITE.stable : SITE.beta;
  const srv = channel === 'stable' ? SITE.stable : SITE.beta;
  const list = (key: string) => t(key, { returnObjects: true }) as string[];
  return (
    <div className="page">
      <header className="page-head">
        <h1>{t('download.title')}</h1>
        <p className="muted">{t('download.sub', { launcher: SITE.launcherVersion })}</p>
      </header>

      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label={t('download.channel')}>
          <button role="tab" aria-selected={channel === 'stable'} className={channel === 'stable' ? 'on' : ''} onClick={() => setChannel('stable')}>{t('download.stable', { v: SITE.stable.version })}</button>
          <button role="tab" aria-selected={channel === 'beta'} className={channel === 'beta' ? 'on' : ''} onClick={() => setChannel('beta')}>{t('download.beta', { v: SITE.beta.version })}</button>
        </div>
        <div className="segmented" role="tablist" aria-label={t('download.os')}>
          <button role="tab" aria-selected={os === 'windows'} className={os === 'windows' ? 'on' : ''} onClick={() => setOs('windows')}>Windows</button>
          <button role="tab" aria-selected={os === 'linux'} className={os === 'linux' ? 'on' : ''} onClick={() => setOs('linux')}>Linux</button>
        </div>
      </div>
      {channel === 'beta' && <p className="notice">{t('download.betaNote')}</p>}

      <div className="dl-grid">
        <article className="dl-card">
          <div className="dl-head"><IconPlay size={28} /><div><h2>{t('download.client.title')}</h2><span className="muted small">ModLoader {rel.version} · OpenVoxel {SITE.game}</span></div></div>
          <p>{t('download.client.text')}</p>
          <a className="button big-btn block" href={rel.client.zip}><IconDownload size={20} /> {t('download.zip')}<small>ModLoader-Client-v{rel.version}-vgame-{SITE.game}.zip</small></a>
          <a className="muted small" href={rel.client.jar}>{t('download.jarOnly')}</a>
          <h3>{t('download.install')}</h3>
          <ol className="steps">{list(`download.client.steps.${os}`).map((s) => <li key={s}><span>{s}</span></li>)}</ol>
          <details><summary>{t('download.contents')}</summary><p className="muted small">{t('download.client.contents')}</p></details>
        </article>

        <article className="dl-card">
          <div className="dl-head"><IconServer size={28} /><div><h2>{t('download.server.title')}</h2><span className="muted small">ModLoader {srv.version} · {t('download.server.official')}</span></div></div>
          <p>{t('download.server.text')}</p>
          <a className="button big-btn block" href={srv.server.zip}><IconDownload size={20} /> {t('download.zip')}<small>ModLoader-Server-v{srv.version}-vgame-{SITE.game}.zip</small></a>
          <a className="muted small" href={srv.server.jar}>{t('download.jarOnly')}</a>
          <h3>{t('download.install')}</h3>
          <ol className="steps">{list(`download.server.steps.${os}`).map((s) => <li key={s}><span>{s}</span></li>)}</ol>
          <details><summary>{t('download.contents')}</summary><p className="muted small">{t('download.server.contents')}</p></details>
        </article>
      </div>

      <section className="req">
        <h2>{t('download.req.title')}</h2>
        <div className="req-grid">{list('download.req.items').map((s) => <div key={s} className="req-item">{s}</div>)}</div>
        <p className="muted small">{t('download.req.more')} <Link to="/docs/getting-started">{t('download.req.guide')}</Link> · <a href={rel.notes} target="_blank" rel="noreferrer">{t('download.notes')}</a></p>
      </section>
    </div>
  );
}
