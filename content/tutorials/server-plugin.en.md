---
title: Your first server plugin
summary: A /spawn command and a join message for the dedicated server, from source to the running server.
order: 5
---

# Your first server plugin

Server plugins use the official API and run inside the dedicated server; players do not need any mod.

## 1. Project

```
my-plugin/
  build.bat / build.sh      copy from ModLoader-Server-Example
  resources/plugin.yml
  src/com/example/SpawnPlugin.java
```

`plugin.yml`:

```yaml
name: SpawnPlugin
main: com.example.SpawnPlugin
version: 0.1.0
author: you
description: /spawn and a welcome message
```

## 2. Code

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
        VoxelServer.getCommandManager().register("setspawn", "sets the spawn here", (player, args) -> {
            spawn = player.getLocation().copy();
            player.sendMessage("&aSpawn set to " + spawn.getBlockX() + " " + spawn.getBlockY() + " " + spawn.getBlockZ());
        }, this);
        VoxelServer.getCommandManager().register("spawn", "teleports you to spawn", (player, args) -> {
            if (spawn == null) { player.sendMessage("&cNo spawn set. Use /setspawn"); return; }
            player.setLocation(spawn.copy());
        }, this);
        // every 5 minutes (20 ticks per second)
        VoxelServer.getScheduler().runTimer(this, () -> VoxelServer.broadcast("&7Tip: /spawn brings you home."), 20L * 60, 20L * 300);
        getLogger().info("SpawnPlugin ready");
    }

    @EventHandler public void onJoin(PlayerJoinEvent e) {
        e.getPlayer().sendMessage("&eWelcome, " + e.getPlayer().getName() + "! Try /spawn.");
    }
}
```

## 3. Build

```
export OPENVOXEL_SERVER_JAR=.../ModLoader-Server/server/openvoxel-server.jar
javac --release 11 -cp "$OPENVOXEL_SERVER_JAR" -d build $(find src -name '*.java')
cp resources/plugin.yml build/ && jar --create --file SpawnPlugin.jar -C build .
```

## 4. Run

Copy `SpawnPlugin.jar` into `ModLoader-Server/mods/` and run `start.bat` / `start.sh`. The start
script copies `mods/*.jar` to `plugins/`, and the console shows `[plugins] enabled SpawnPlugin`.
Type `help` in the server console to see your commands listed.

## Ideas

- Cancel `BlockBreakEvent` outside a region to protect spawn.
- Use `PlayerChatEvent` to add prefixes/colors (players with the client loader see `&` colors).
- Store data with `java.util.Properties` under `plugins/<Name>/`.

Full API: [Server plugins](#/docs/server-plugins). Complete example: Hunger Games in
[ModLoader-Server-Example](https://github.com/OpenVoxel-ModLoader/ModLoader-Server-Example).
