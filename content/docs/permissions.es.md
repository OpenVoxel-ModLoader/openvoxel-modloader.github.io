---
title: Permisos y administración del servidor
summary: Operadores, nodos de permiso, modos de juego, tab list, whitelist y warps en un servidor ModLoader.
order: 6
---

# Permisos y administración del servidor

El servidor dedicado de OpenVoxel no tiene sistema de permisos propio. El plugin núcleo del ModLoader
añade uno, además de las herramientas de administración típicas de un servidor de Minecraft. Todo
vive en `plugins/ModLoader/` y en la sección `gameplay` de `server.properties.yml`.

> Disponible desde **ModLoader-Server 1.1.0-pre2** (pre-release).

## Operadores

| Comando | Qué hace |
|---------|----------|
| `/op <jugador>` | Da operador. Los operadores tienen **todos** los permisos. |
| `/deop <jugador>` | Quita operador. |
| `/ops` | Lista los operadores. |

Se guardan en `plugins/ModLoader/ops.yml` (`nombre|uuid`). La consola del servidor siempre tiene permiso.
El primer operador se crea desde la consola: escribe `op TuNombre` en la ventana del servidor.

## Nodos de permiso

Cada comando necesita un nodo. Por defecto es `openvoxel.command.<nombre>`; un plugin o
`permissions.yml` pueden asignar otro nodo a un comando. Los jugadores que no son operadores reciben
los nodos de `permissions.yml` → `default`:

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

Admite comodines: `openvoxel.command.*` o `*`. Aplica los cambios con `/perms reload`.

| Nodo | Permite | Por defecto |
|------|---------|-------------|
| `openvoxel.command.help` / `list` / `version` | Comandos de información | todos |
| `openvoxel.command.msg` | `/msg`, `/tell` | todos |
| `openvoxel.command.spawn`, `openvoxel.command.warp`, `openvoxel.command.warps` | Ir al spawn / warps | todos |
| `openvoxel.warp.<nombre>` | Un warp concreto (si quitas `openvoxel.command.warp` de los defaults) | — |
| `openvoxel.command.gamemode` | Cambiar tu propio modo de juego | ops |
| `openvoxel.command.gamemode.others` | `/gamemode <modo> <jugador>` | ops |
| `openvoxel.command.op` / `deop` | Gestionar operadores | ops |
| `openvoxel.command.kick`, `say`, `heal`, `stop`, `whitelist` | Comandos de admin | ops |
| `openvoxel.command.setspawn`, `setwarp`, `delwarp` | Editar spawn y warps | ops |
| `openvoxel.command.perms` | `/perms check <jugador> <nodo>`, `/perms reload` | ops |
| `openvoxel.command.give` | `/give <objeto> [cantidad]` para ti | ops |
| `openvoxel.command.give.others` | `/give <jugador> <objeto> [cantidad]` | ops |

Si a un jugador le falta el nodo verá `You don't have permission to use /nombre (nodo)`, y `/help`
solo lista los comandos que puede usar. Los clientes ModLoader reciben también esa lista filtrada para autocompletar con Tab.

## Modos de juego

Con el cliente ModLoader **el servidor decide** el modo de juego: `/gamemode creative` se lo pide al
servidor, que comprueba `openvoxel.command.gamemode`. Los jugadores nuevos empiezan en
`gameplay.default-gamemode`. El modo se recuerda por jugador en `plugins/ModLoader/players.properties`.
A los jugadores sin cliente ModLoader no les afecta (el cliente original no tiene modos de juego).

## Tab list

Los jugadores con el cliente ModLoader la ven manteniendo **Tab**. Se configura en `plugins/ModLoader/tablist.yml`:

```yaml
enabled: true
refresh-seconds: 2
header:                       # a list: one line per item
  - '&b&lOpenVoxel &f&lServer'
  - '&7Welcome, &e{player}'
  - ''
footer: '\n&7Online: &a{online}&7/&a{max}\n&8ModLoader {version}'   # o un texto con \n
name-format: '{prefix}{player}{suffix}'
```

`header` y `footer` pueden ser una **lista** (una línea por elemento, `''` para una línea vacía) o un texto donde `\n` empieza una línea nueva.

Placeholders: `{online}` `{max}` `{player}` `{prefix}` `{suffix}` `{server}` `{version}` `{provider}`.
`{prefix}` y `{suffix}` vienen del plugin de permisos (meta de LuckPerms) cuando hay uno instalado.

## /give

`/give [jugador] <objeto> [cantidad]` mete los objetos en el inventario, juntándolos con los que ya tiene. Lo que no cabe cae al suelo a sus pies; el objeto de la mano nunca se reemplaza. La cantidad puede llegar a 2304 (un inventario lleno). Los objetos son del cliente, así que el destino necesita el cliente ModLoader. En un jugador `/give` siempre funciona; en servidores sin el plugin ModLoader solo en creativo.

## server.properties.yml → gameplay

```yaml
gameplay:
  server-name: OpenVoxel
  motd: '&bAn OpenVoxel server\n&7running &eModLoader'   # texto en la lista de servidores (clientes ModLoader, necesita el agente); dos líneas con \n
  welcome-message: '&7Welcome, &e{player}&7! Type &a/help&7.'   # mensaje de chat al entrar un jugador
  default-gamemode: survival
  max-players: 20          # 0 = sin límite, los operadores siempre pueden entrar
  whitelist: false
  whitelist-message: 'You are not whitelisted on this server.'
```

Whitelist: `/whitelist add <jugador>`, `/whitelist remove <jugador>`, `/whitelist list`.

## Spawn y warps

`/setspawn` fija el spawn del mundo (también se usa al reaparecer) y `/spawn` te lleva allí.
`/setwarp <nombre>`, `/warp <nombre>`, `/delwarp <nombre>`, `/warps`. Se guardan en `plugins/ModLoader/warps.properties`.

## Para desarrolladores de plugins

```java
import com.happyuky7.openvoxelmoding.server.permissions.Permissions;

if (!Permissions.has(player, "myplugin.fly")) { player.sendMessage("&cNo tienes permiso."); return; }
Permissions.registerCommand("fly", "myplugin.fly");   // ahora /fly necesita myplugin.fly
```

Añade el jar del servidor ModLoader como `compileOnly` y `depend: [ModLoader]` en tu `plugin.yml`.
Un sistema de permisos se enchufa con `Permissions.setProvider(provider)`: el proveedor responde
`check(jugador, nodo)` con true, false o null (null vuelve a operadores y defaults) y puede dar
`prefix`/`suffix`. LuckPerms para OpenVoxel se está construyendo sobre esta API.
