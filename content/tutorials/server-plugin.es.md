---
title: Tu primer plugin de servidor
summary: Un comando /spawn y un mensaje de bienvenida para el servidor dedicado, del código al servidor en marcha.
order: 5
---

# Tu primer plugin de servidor

Los plugins usan la API oficial y corren dentro del servidor dedicado; los jugadores no necesitan ningún mod.

## 1. Proyecto

```
mi-plugin/
  build.bat / build.sh      copia los de ModLoader-Server-Example
  resources/plugin.yml
  src/com/example/SpawnPlugin.java
```

`plugin.yml`:

```yaml
name: SpawnPlugin
main: com.example.SpawnPlugin
version: 0.1.0
author: tú
description: /spawn y mensaje de bienvenida
```

## 2. Código

```java
package com.example;

import net.openvoxel.server.plugin.*;
import net.openvoxel.server.plugin.event.EventHandler;
import net.openvoxel.server.plugin.event.Listener;
import net.openvoxel.server.plugin.event.player.PlayerJoinEvent;

public final class SpawnPlugin extends Plugin implements Listener {
    private Location spawn;

    @Override public void onEnable() {
        VoxelServer.getPluginManager().registerEvents(this, this);
        VoxelServer.getCommandManager().register("setspawn", "fija el spawn aquí", (player, args) -> {
            spawn = player.getLocation().copy();
            player.sendMessage("&aSpawn fijado en " + spawn.getBlockX() + " " + spawn.getBlockY() + " " + spawn.getBlockZ());
        }, this);
        VoxelServer.getCommandManager().register("spawn", "te teletransporta al spawn", (player, args) -> {
            if (spawn == null) { player.sendMessage("&cNo hay spawn. Usa /setspawn"); return; }
            player.setLocation(spawn.copy());
        }, this);
        // cada 5 minutos (20 ticks por segundo)
        VoxelServer.getScheduler().runTimer(this, () -> VoxelServer.broadcast("&7Consejo: /spawn te lleva a casa."), 20L * 60, 20L * 300);
        getLogger().info("SpawnPlugin listo");
    }

    @EventHandler public void onJoin(PlayerJoinEvent e) {
        e.getPlayer().sendMessage("&e¡Bienvenido, " + e.getPlayer().getName() + "! Prueba /spawn.");
    }
}
```

## 3. Compilar

```
export OPENVOXEL_SERVER_JAR=.../ModLoader-Server/server/openvoxel-server.jar
javac --release 11 -cp "$OPENVOXEL_SERVER_JAR" -d build $(find src -name '*.java')
cp resources/plugin.yml build/ && jar --create --file SpawnPlugin.jar -C build .
```

## 4. Ejecutar

Copia `SpawnPlugin.jar` en `ModLoader-Server/mods/` y ejecuta `start.bat` / `start.sh`. El script copia
`mods/*.jar` a `plugins/` y la consola muestra `[plugins] enabled SpawnPlugin`. Escribe `help` en la
consola del servidor para ver tus comandos.

## Ideas

- Cancela `BlockBreakEvent` fuera de una región para proteger el spawn.
- Usa `PlayerChatEvent` para prefijos/colores (los jugadores con el loader de cliente ven los colores `&`).
- Guarda datos con `java.util.Properties` en `plugins/<Nombre>/`.

API completa: [Plugins de servidor](#/docs/server-plugins). Ejemplo completo: Hunger Games en
[ModLoader-Server-Example](https://github.com/OpenVoxel-ModLoader/ModLoader-Server-Example).
