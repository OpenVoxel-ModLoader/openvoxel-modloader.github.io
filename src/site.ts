/** Release links in one place: "latest" always resolves to the newest stable release on GitHub. */
const ORG = 'https://github.com/OpenVoxel-ModLoader';
const GAME = '0.0.8';

function client(version: string, tag?: string) {
  const base = tag ? `${ORG}/ModLoader-Client/releases/download/${tag}` : `${ORG}/ModLoader-Client/releases/latest/download`;
  return { zip: `${base}/ModLoader-Client-v${version}-vgame-${GAME}.zip`, jar: `${base}/ModLoader-v${version}-vgame-${GAME}-client.jar` };
}
function server(version: string, tag?: string) {
  const base = tag ? `${ORG}/ModLoader-Server/releases/download/${tag}` : `${ORG}/ModLoader-Server/releases/latest/download`;
  return { zip: `${base}/ModLoader-Server-v${version}-vgame-${GAME}.zip`, jar: `${base}/ModLoader-v${version}-vgame-${GAME}-server.jar` };
}

export const SITE = {
  org: ORG,
  game: GAME,
  launcherVersion: '0.0.8-Debug',
  stable: { version: '1.0.0', client: client('1.0.0'), server: server('1.0.0'), notes: `${ORG}/ModLoader-Client/releases/tag/v1.0.0` },
  beta: { version: '1.1.0-pre2', client: client('1.1.0-pre2', 'v1.1.0-pre2'), server: server('1.1.0-pre2', 'v1.1.0-pre2'), notes: `${ORG}/ModLoader-Client/releases/tag/v1.1.0-pre2` },
  template: `${ORG}/ModLoader-ModsExamples/tree/master/mod-template`,
  examples: `${ORG}/ModLoader-ModsExamples`,
  serverExample: `${ORG}/ModLoader-Server-Example`
};
