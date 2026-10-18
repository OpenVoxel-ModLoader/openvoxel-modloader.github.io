import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, type Mod } from '../api';
import { ModCard } from '../components/ModCard';
import { Backdrop } from '../components/Backdrop';
import { CopyButton } from '../components/CopyButton';
import { IconBook, IconChat, IconCode, IconCube, IconDownload, IconPalette, IconPlay, IconServer, IconSword } from '../components/Icons';
import { SITE } from '../site';

const SNIPPET = `public final class HelloMod implements ClientMod {
    @Override public void onLoad(ModContext ctx) {
        ctx.registerCommand("hello", "says hi", args -> {
            ctx.chat("&aHello from my first mod!");
            ctx.playSound("pop");
        });
        ctx.registerBlock("hellomod:ruby_block", "Ruby Block",
                          "STONE", "assets/hellomod/ruby.png");
    }
}`;

export default function Home() {
  const { t } = useTranslation();
  const [mods, setMods] = useState<Mod[]>([]);
  useEffect(() => { api.mods().then((m) => setMods(m.filter((x) => x.tags.includes('example')).slice(0, 3))).catch(() => setMods([])); }, []);
  const list = (key: string) => t(key, { returnObjects: true }) as string[];
  const features: { icon: JSX.Element; key: string }[] = [
    { icon: <IconSword />, key: 'survival' }, { icon: <IconCube />, key: 'crafting' }, { icon: <IconPalette />, key: 'skins' },
    { icon: <IconChat />, key: 'chat' }, { icon: <IconCode />, key: 'api' }, { icon: <IconServer />, key: 'server' }
  ];
  return (
    <>
      <section className="hero">
        <Backdrop />
        <div className="hero-inner">
          <span className="eyebrow">{t('home.eyebrow', { game: SITE.game })}</span>
          <h1>{t('home.title1')} <span className="grad">{t('home.title2')}</span></h1>
          <p className="lead">{t('home.lead')}</p>
          <div className="hero-cta">
            <Link to="/download" className="button big-btn"><IconDownload size={20} /> {t('home.ctaPlay')}</Link>
            <Link to="/tutorials/first-mod" className="button ghost big-btn"><IconCode size={20} /> {t('home.ctaDev')}</Link>
          </div>
          <div className="badges">
            <span className="badge ok">{t('home.stable', { v: SITE.stable.version })}</span>
            <Link to="/changelog" className="badge beta">{t('home.beta', { v: SITE.beta.version })}</Link>
            <span className="badge">Windows · Linux</span>
          </div>
        </div>
      </section>

      <section className="page">
        <h2 className="section-title">{t('home.paths.title')}</h2>
        <p className="section-sub">{t('home.paths.sub')}</p>
        <div className="paths">
          <article className="path-card play">
            <div className="path-icon"><IconPlay size={28} /></div>
            <h3>{t('home.paths.play.title')}</h3>
            <p>{t('home.paths.play.text')}</p>
            <ol>{list('home.paths.play.steps').map((s) => <li key={s}>{s}</li>)}</ol>
            <a className="button" href={SITE.stable.client.zip}><IconDownload size={16} /> {t('home.paths.play.cta')}</a>
          </article>
          <article className="path-card host">
            <div className="path-icon"><IconServer size={28} /></div>
            <h3>{t('home.paths.host.title')}</h3>
            <p>{t('home.paths.host.text')}</p>
            <ol>{list('home.paths.host.steps').map((s) => <li key={s}>{s}</li>)}</ol>
            <a className="button" href={SITE.stable.server.zip}><IconDownload size={16} /> {t('home.paths.host.cta')}</a>
          </article>
          <article className="path-card dev">
            <div className="path-icon"><IconCode size={28} /></div>
            <h3>{t('home.paths.dev.title')}</h3>
            <p>{t('home.paths.dev.text')}</p>
            <ol>{list('home.paths.dev.steps').map((s) => <li key={s}>{s}</li>)}</ol>
            <Link className="button" to="/tutorials/first-mod"><IconBook size={16} /> {t('home.paths.dev.cta')}</Link>
          </article>
        </div>
      </section>

      <section className="band">
        <div className="page">
          <h2 className="section-title">{t('home.features.title')}</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.key} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <div><h3>{t(`home.features.${f.key}.title`)}</h3><p>{t(`home.features.${f.key}.text`)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page split">
        <div>
          <span className="eyebrow">{t('home.code.eyebrow')}</span>
          <h2>{t('home.code.title')}</h2>
          <p className="muted">{t('home.code.text')}</p>
          <ul className="checks">{list('home.code.points').map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="actions">
            <Link className="button" to="/tutorials/first-mod">{t('home.code.cta')}</Link>
            <Link className="button ghost" to="/docs/api">{t('home.code.api')}</Link>
          </div>
        </div>
        <div className="code-window">
          <div className="code-bar"><i /><i /><i /><span>HelloMod.java</span><CopyButton text={SNIPPET} /></div>
          <pre><code>{SNIPPET}</code></pre>
        </div>
      </section>

      <section className="page">
        <div className="beta-banner">
          <div>
            <span className="badge beta">{t('home.betaBanner.badge')}</span>
            <h3>{t('home.betaBanner.title', { v: SITE.beta.version })}</h3>
            <p className="muted">{t('home.betaBanner.text')}</p>
            <ul className="dots">{list('home.betaBanner.items').map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="beta-actions">
            <a className="button" href={SITE.beta.client.zip}><IconDownload size={16} /> {t('home.betaBanner.cta')}</a>
            <Link className="muted small" to="/changelog">{t('home.betaBanner.notes')} →</Link>
          </div>
        </div>
      </section>

      {mods.length > 0 && (
        <section className="page">
          <div className="row-head">
            <h2 className="section-title">{t('home.examples')}</h2>
            <Link to="/mods" className="muted">{t('home.allMods')} →</Link>
          </div>
          <div className="grid">{mods.map((m) => <ModCard key={m.id} mod={m} />)}</div>
        </section>
      )}
    </>
  );
}
