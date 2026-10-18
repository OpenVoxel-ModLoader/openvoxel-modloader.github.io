---
title: Server permissions & administration
summary: Operators, permission nodes, game modes, tab list, whitelist and warps on a ModLoader server.
order: 5
---

# Server permissions & administration

OpenVoxel's dedicated server has no permission system of its own. The ModLoader core plugin adds one,
plus the admin tools you expect from a Minecraft server. Everything lives in `plugins/ModLoader/`
and in the `gameplay` section of `server.properties.yml`.

> Available since **ModLoader-Server 1.1.0-pre2** (pre-release).

## Operators

| Command | What it does |
|---------|--------------|
| `/op <player>` | Gives operator. Operators have **every** permission. |
| `/deop <player>` | Removes operator. |
| `/ops` | Lists operators. |

Operators are stored in `plugins/ModLoader/ops.yml` (`name|uuid`). The server console is always allowed.
The first operator has to be made from the console: type `op YourName` in the server window.

## Permission nodes

Every command needs a node. By default it is `openvoxel.command.<name>`; a plugin or
`permissions.yml` can map a command to another node. Players who are not operators get the nodes in
`permissions.yml` → `default`:

```yaml
# plugins/ModLoader/permissions.yml
default:
  - openvoxel.command.help
  - openvoxel.command.list
  - openvoxel.command.msg
  - openvoxel.command.spawn
  - openvoxel.command.warp
commands:
  hg: hungergames.use
```

Wildcards work: `openvoxel.command.*` or `*`. Apply changes with `/perms reload`.

| Node | Allows | Default |
|------|--------|---------|
| `openvoxel.command.help` / `list` / `version` | Basic info commands | everyone |
| `openvoxel.command.msg` | `/msg`, `/tell` | everyone |
| `openvoxel.command.spawn`, `openvoxel.command.warp`, `openvoxel.command.warps` | Teleport to spawn / warps | everyone |
| `openvoxel.warp.<name>` | One specific warp (if `openvoxel.command.warp` is removed from defaults) | — |
| `openvoxel.command.gamemode` | Change your own game mode | ops |
| `openvoxel.command.gamemode.others` | `/gamemode <mode> <player>` | ops |
| `openvoxel.command.op` / `deop` | Manage operators | ops |
| `openvoxel.command.kick`, `say`, `heal`, `stop`, `whitelist` | Admin commands | ops |
| `openvoxel.command.setspawn`, `setwarp`, `delwarp` | Edit spawn and warps | ops |
| `openvoxel.command.perms` | `/perms check <player> <node>`, `/perms reload` | ops |

When a player lacks a node they see `You don't have permission to use /name (node)`, and `/help`
only lists the commands they can use. ModLoader clients also get that filtered list for Tab completion.

## Game modes

With the ModLoader client, **the server decides** the game mode: `/gamemode creative` asks the server,
which checks `openvoxel.command.gamemode`. New players start in `gameplay.default-gamemode`. Modes are
remembered per player in `plugins/ModLoader/players.properties`. Players without the ModLoader client
are not affected (the vanilla client has no game modes).

## Tab list

Players with the ModLoader client hold **Tab** to see it. Configure it in `plugins/ModLoader/tablist.yml`:

```yaml
enabled: true
refresh-seconds: 2
header: '&b&lOpenVoxel &f&lServer'
footer: '&7Online: &a{online}&7/&a{max}'
name-format: '{prefix}{player}{suffix}'
```

Placeholders: `{online}` `{max}` `{player}` `{prefix}` `{suffix}` `{server}` `{version}` `{provider}`.
`{prefix}` and `{suffix}` come from the permission plugin (LuckPerms meta) when one is installed.

## server.properties.yml → gameplay

```yaml
gameplay:
  server-name: OpenVoxel
  motd: '&7Welcome, &e{player}&7! Type &a/help&7.'
  default-gamemode: survival
  max-players: 20          # 0 = unlimited, operators can always join
  whitelist: false
  whitelist-message: 'You are not whitelisted on this server.'
```

Whitelist: `/whitelist add <player>`, `/whitelist remove <player>`, `/whitelist list`.

## Spawn and warps

`/setspawn` sets the world spawn (also used when players respawn), `/spawn` goes there.
`/setwarp <name>`, `/warp <name>`, `/delwarp <name>`, `/warps`. Stored in `plugins/ModLoader/warps.properties`.

## For plugin developers

```java
import com.happyuky7.openvoxelmoding.server.core.Permissions;

if (!Permissions.has(player, "myplugin.fly")) { player.sendMessage("&cNo permission."); return; }
Permissions.registerCommand("fly", "myplugin.fly");   // /fly now needs myplugin.fly
```

Add the ModLoader server jar as `compileOnly` and `depend: [ModLoader]` in your `plugin.yml`.
A permission system plugs in with `Permissions.setProvider(provider)`; the provider answers
`check(player, node)` with true, false or null (null falls back to operators and defaults) and can
supply `prefix`/`suffix`. LuckPerms for OpenVoxel is being built on this API.
