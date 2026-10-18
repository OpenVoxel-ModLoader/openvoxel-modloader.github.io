---
title: Server plugins API
summary: The official plugin API used by ModLoader-Server and server-side mods.
order: 5
---

# Server plugins

Server-side code is a **plugin** for the official dedicated server (`openvoxel-server-0.0.8-SNAPSHOT.jar`),
using its built-in API `net.openvoxel.server.plugin.*`. ModLoader-Server adds the console and utility
commands as one such plugin; your plugins go into `ModLoader-Server/mods/` and are copied to `plugins/`
on start. Plugins work with vanilla clients (no client mod needed).

```
my-plugin/
  src/.../MyPlugin.java      extends Plugin implements Listener
  resources/plugin.yml       name, main, version, author, description
```

```yaml
name: MyPlugin
main: com.example.MyPlugin
version: 0.1.0
author: you
description: What it does
```

## `Plugin`

| Member | Use |
|--------|-----|
| `onEnable()` / `onDisable()` | Lifecycle. Register commands and listeners in `onEnable`. |
| `getName()`, `getLogger()` | Plugin name and a `PluginLogger` (`info`, `warn`, `error`). |

## `VoxelServer` (static facade)

| Method | Effect |
|--------|--------|
| `getOnlinePlayers()`, `getPlayer(name)` | Online `Player`s. |
| `broadcast(msg)` | Chat to everyone (supports `&` colors when players run the client loader). |
| `kickPlayer(player, reason)` | Disconnects a player. |
| `getBlock(x,y,z)`, `setBlock(x,y,z,state)` | Read / write world blocks (`long` state). |
| `blockState("stone")`, `blockName(state)` | Convert names ↔ states. |
| `getEntity(id)`, `damage(entity, amount, cause)`, `spawnFallingBlock(x,y,z,state)` | Entities. |
| `mount`, `dismount`, `setSitting` | Riding / sitting. |
| `getCommandManager()`, `getPluginManager()`, `getScheduler()` | Managers below. |
| `isOnlineMode()` | Whether the server validates sessions with open-voxel.net. |

## Commands

```java
VoxelServer.getCommandManager().register("hello", "says hi", (player, args) -> {
    player.sendMessage("&aHi " + player.getName() + "!");
}, this);
```

`describeAll()` lists `/name - description`; `dispatch(player, "/line")` runs a line programmatically
(this is how the console works — a synthetic `Player("CONSOLE", "console", "127.0.0.1")` whose
`messageSink` prints to stdout).

## `Player`

`getName()`, `getUuid()`, `getAddress()`, `sendMessage(msg)`, `getLocation()` / `setLocation(Location)`
(teleport), `getX/Y/Z()`, `getHealth()`, `isDead()`, `getEntity()` (`PlayerEntity`: `health`,
`maxHealth`, `dead`), riding helpers, `openUi(Ui)` / `closeUi()` / `updateUi(...)` (server-driven UI windows).

`Location(x, y, z[, yaw, pitch])`: `getBlockX/Y/Z()`, `add(dx,dy,dz)`, `distanceSquared(other)`, `copy()`.

## Events

Implement `Listener`, annotate methods with `@EventHandler` and register with
`VoxelServer.getPluginManager().registerEvents(this, this)`.

| Package | Events |
|---------|--------|
| `event.player` | `PlayerJoinEvent`, `PlayerQuitEvent`, `PlayerChatEvent`, `PlayerCommandPreprocessEvent`, `PlayerMoveEvent`, `PlayerTeleportEvent`, `PlayerInteractEvent`, `PlayerDeathEvent`, `PlayerRespawnEvent`, `PlayerKickEvent`, `PlayerToggleSneakEvent`, `PlayerToggleSprintEvent`, `PlayerAnimationEvent`, `PlayerUiEvent` |
| `event.block` | `BlockBreakEvent`, `BlockPlaceEvent` |
| `event.entity` | `EntityDamageEvent` (+ `Cause`), `EntityDeathEvent`, `EntitySpawnEvent`, `EntityDespawnEvent`, `EntityMountEvent`, `EntityDismountEvent`, `EntityRegainHealthEvent` |
| `event.world` | `ChunkLoadEvent`, `ChunkUnloadEvent`, `LiquidFlowEvent` |

Events implementing `Cancellable` have `setCancelled(true)`; `EventPriority` orders handlers.

## Scheduler

`runLater(plugin, task, delayTicks)`, `runTimer(plugin, task, delayTicks, periodTicks)`,
`runAsync(plugin, task)`, `cancel(id)`, `cancelAll(plugin)`. The server ticks 20 times per second.

## Config

`YamlConfig` reads simple YAML; the core plugin uses `plugins/<Name>/config.yml`. For a flat file,
`java.util.Properties` is enough.

Complete example: [ModLoader-Server-Example](https://github.com/OpenVoxel-ModLoader/ModLoader-Server-Example) (Hunger Games).
