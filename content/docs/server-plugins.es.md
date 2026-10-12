---
title: API de plugins de servidor
summary: La API oficial de plugins que usan ModLoader-Server y los mods de servidor.
order: 4
---

# Plugins de servidor

El código de servidor es un **plugin** del servidor dedicado oficial (`openvoxel-server-0.0.8-SNAPSHOT.jar`),
usando su API incorporada `net.openvoxel.server.plugin.*`. ModLoader-Server añade la consola y comandos de
utilidad como un plugin más; los tuyos van en `ModLoader-Server/mods/` y se copian a `plugins/` al arrancar.
Funcionan con clientes vanilla (no hace falta mod de cliente).

```
mi-plugin/
  src/.../MiPlugin.java      extends Plugin implements Listener
  resources/plugin.yml       name, main, version, author, description
```

```yaml
name: MiPlugin
main: com.example.MiPlugin
version: 0.1.0
author: tú
description: Qué hace
```

## `Plugin`

| Miembro | Uso |
|---------|-----|
| `onEnable()` / `onDisable()` | Ciclo de vida. Registra comandos y listeners en `onEnable`. |
| `getName()`, `getLogger()` | Nombre y un `PluginLogger` (`info`, `warn`, `error`). |

## `VoxelServer` (fachada estática)

| Método | Efecto |
|--------|--------|
| `getOnlinePlayers()`, `getPlayer(nombre)` | Jugadores conectados (`Player`). |
| `broadcast(msg)` | Chat a todos (con colores `&` si los jugadores usan el loader de cliente). |
| `kickPlayer(player, motivo)` | Expulsa a un jugador. |
| `getBlock(x,y,z)`, `setBlock(x,y,z,estado)` | Leer / escribir bloques (estado `long`). |
| `blockState("stone")`, `blockName(estado)` | Convertir nombres ↔ estados. |
| `getEntity(id)`, `damage(entidad, cantidad, causa)`, `spawnFallingBlock(x,y,z,estado)` | Entidades. |
| `mount`, `dismount`, `setSitting` | Montar / sentarse. |
| `getCommandManager()`, `getPluginManager()`, `getScheduler()` | Gestores de abajo. |
| `isOnlineMode()` | Si el servidor valida sesiones con open-voxel.net. |

## Comandos

```java
VoxelServer.getCommandManager().register("hello", "saluda", (player, args) -> {
    player.sendMessage("&a¡Hola " + player.getName() + "!");
}, this);
```

`describeAll()` lista `/nombre - descripción`; `dispatch(player, "/línea")` ejecuta una línea por código
(así funciona la consola: un `Player("CONSOLE", "console", "127.0.0.1")` sintético cuyo `messageSink`
imprime en stdout).

## `Player`

`getName()`, `getUuid()`, `getAddress()`, `sendMessage(msg)`, `getLocation()` / `setLocation(Location)`
(teletransporte), `getX/Y/Z()`, `getHealth()`, `isDead()`, `getEntity()` (`PlayerEntity`: `health`,
`maxHealth`, `dead`), ayudas de montura, `openUi(Ui)` / `closeUi()` / `updateUi(...)` (ventanas de UI desde el servidor).

`Location(x, y, z[, yaw, pitch])`: `getBlockX/Y/Z()`, `add(dx,dy,dz)`, `distanceSquared(otra)`, `copy()`.

## Eventos

Implementa `Listener`, anota métodos con `@EventHandler` y registra con
`VoxelServer.getPluginManager().registerEvents(this, this)`.

| Paquete | Eventos |
|---------|---------|
| `event.player` | `PlayerJoinEvent`, `PlayerQuitEvent`, `PlayerChatEvent`, `PlayerCommandPreprocessEvent`, `PlayerMoveEvent`, `PlayerTeleportEvent`, `PlayerInteractEvent`, `PlayerDeathEvent`, `PlayerRespawnEvent`, `PlayerKickEvent`, `PlayerToggleSneakEvent`, `PlayerToggleSprintEvent`, `PlayerAnimationEvent`, `PlayerUiEvent` |
| `event.block` | `BlockBreakEvent`, `BlockPlaceEvent` |
| `event.entity` | `EntityDamageEvent` (+ `Cause`), `EntityDeathEvent`, `EntitySpawnEvent`, `EntityDespawnEvent`, `EntityMountEvent`, `EntityDismountEvent`, `EntityRegainHealthEvent` |
| `event.world` | `ChunkLoadEvent`, `ChunkUnloadEvent`, `LiquidFlowEvent` |

Los eventos `Cancellable` tienen `setCancelled(true)`; `EventPriority` ordena los handlers.

## Scheduler

`runLater(plugin, tarea, ticksRetraso)`, `runTimer(plugin, tarea, ticksRetraso, ticksPeriodo)`,
`runAsync(plugin, tarea)`, `cancel(id)`, `cancelAll(plugin)`. El servidor hace 20 ticks por segundo.

## Configuración

`YamlConfig` lee YAML simple; el plugin núcleo usa `plugins/<Nombre>/config.yml`. Para algo plano basta
`java.util.Properties`.

Ejemplo completo: [ModLoader-Server-Example](https://github.com/OpenVoxel-ModLoader/ModLoader-Server-Example) (Hunger Games).
