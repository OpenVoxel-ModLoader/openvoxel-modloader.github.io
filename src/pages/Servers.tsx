import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '../components/CopyButton';
import { IconBook, IconChat, IconCode, IconDownload, IconServer, IconSword } from '../components/Icons';
import { SITE } from '../site';

const PERMISSIONS_YML = `# plugins/ModLoader/permissions.yml
default:                      # every player
  - openvoxel.command.help
  - openvoxel.command.list
  - openvoxel.command.msg
  - openvoxel.command.spawn
  - openvoxel.command.warp
commands:                     # command -> node
  hg: hungergames.use`;

const TABLIST_YML = `# plugins/ModLoader/tablist.yml
enabled: true
refresh-seconds: 2
header: '&b&lOpenVoxel &f&lServer'
footer: '&7Online: &a{online}&7/&a{max}'
name-format: '{prefix}{player}{suffix}'`;

const API = `import com.happyuky7.openvoxelmoding.server.core.Permissions;

if (!Permissions.has(player, "myplugin.fly")) {
    player.sendMessage("&cNo permission.");
    return;
}
Permissions.registerCommand("fly", "myplugin.fly");`;

export default function Servers() {
  const { t } = useTranslation();
  const rows = t('servers.nodes.rows', { returnObjects: true }) as [string, string, string][];
  const features: { icon: JSX.Element; key: string }[] = [
    { icon: <IconSword />, key: 'perms' }, { icon: <IconServer />, key: 'gamemode' }, { icon: <IconChat />, key: 'tab' },
    { icon: <IconBook />, key: 'whitelist' }, { icon: <IconCode />, key: 'api' }, { icon: <IconDownload />, key: 'luckperms' }
  ];
  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">{t('servers.eyebrow')}</span>
        <h1>{t('servers.title')}</h1>
        <p className="muted">{t('servers.sub')}</p>
        <div className="actions">
          <a className="button" href={SITE.stable.server.zip}><IconDownload size={16} /> {t('servers.download')}</a>
          <Link className="button ghost" to="/docs/permissions">{t('servers.docs')}</Link>
        </div>
      </header>

      <div className="features-grid">
        {features.map((f) => (
          <div key={f.key} className={`feature${f.key === 'luckperms' ? ' soon' : ''}`}>
            <div className="feature-icon">{f.icon}</div>
            <div><h3>{t(`servers.f.${f.key}.title`)}</h3><p>{t(`servers.f.${f.key}.text`)}</p></div>
          </div>
        ))}
      </div>

      <section className="split servers-split">
        <div>
          <h2>{t('servers.how.title')}</h2>
          <ol className="steps">{(t('servers.how.steps', { returnObjects: true }) as string[]).map((s) => <li key={s}><span>{s}</span></li>)}</ol>
        </div>
        <div className="code-window">
          <div className="code-bar"><i /><i /><i /><span>permissions.yml</span><CopyButton text={PERMISSIONS_YML} /></div>
          <pre><code>{PERMISSIONS_YML}</code></pre>
        </div>
      </section>

      <section>
        <h2>{t('servers.nodes.title')}</h2>
        <div className="markdown">
          <table>
            <thead><tr><th>{t('servers.nodes.node')}</th><th>{t('servers.nodes.what')}</th><th>{t('servers.nodes.default')}</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r[0]}><td><code>{r[0]}</code></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="split servers-split">
        <div className="code-window">
          <div className="code-bar"><i /><i /><i /><span>tablist.yml</span><CopyButton text={TABLIST_YML} /></div>
          <pre><code>{TABLIST_YML}</code></pre>
        </div>
        <div className="code-window">
          <div className="code-bar"><i /><i /><i /><span>MyPlugin.java</span><CopyButton text={API} /></div>
          <pre><code>{API}</code></pre>
        </div>
      </section>

      <div className="beta-banner">
        <div>
          <span className="badge beta">{t('servers.roadmap.badge')}</span>
          <h3>{t('servers.roadmap.title')}</h3>
          <ul className="dots">{(t('servers.roadmap.items', { returnObjects: true }) as string[]).map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="beta-actions">
          <a className="button ghost" href={`${SITE.org}/LuckPerms-OpenVoxel-ModLoader`} target="_blank" rel="noreferrer">LuckPerms fork</a>
        </div>
      </div>
    </div>
  );
}
