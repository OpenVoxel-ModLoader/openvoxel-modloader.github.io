---
title: Your first mod in 10 minutes
summary: From the template to a /hello command with a translation and a saved setting.
order: 1
---

# Your first mod

**You need**: JDK 11+ (`javac -version`), the game installed through the official launcher, and
the loader jar from the ModLoader-Client releases.

## 1. Copy the template

```
git clone https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples.git
cp -r ModLoader-ModsExamples/mod-template my-first-mod
```

Rename things: package `com.example.mymod` → yours, `id=mymod` → `id=firstmod`, `name=First Mod`,
`main=` your class. Rename `assets/mymod` → `assets/firstmod`.

## 2. Write the mod

```java
package com.example.firstmod;

import com.happyuky7.openvoxelmoding.loader.*;

public final class FirstMod implements ClientMod {
    private ModConfig config;

    @Override public void onLoad(ModContext ctx) {
        config = ctx.config("firstmod");                               // instance/config/firstmod.properties
        ctx.registerCommand("hello", ctx.translate("firstmod.command"), args -> {
            int times = config.getInt("greetings", 0) + 1;
            config.set("greetings", times).save();
            ctx.chat(ctx.translate("firstmod.hello", times));           // "&aHello! Greeting #%d"
            ctx.playSound("pop");
        });
    }
}
```

`src/main/resources/assets/firstmod/lang/en_us.json`:

```json
{ "firstmod.hello": "&aHello! Greeting #%d", "firstmod.command": "says hello" }
```

and `es_es.json`:

```json
{ "firstmod.hello": "&a¡Hola! Saludo nº %d", "firstmod.command": "saluda" }
```

## 3. Build

```
export OPENVOXEL_GAME_JAR=.../Game/versions/0.0.8-Debug/openvoxel-0.0.8-Debug.jar
export OPENVOXEL_MODLOADER_JAR=.../ModLoader-Client/dist/ModLoader-v1.0.0-vgame-0.0.8-client.jar
./build.sh            # or build.bat; or `gradle jar`
```

The jar is copied to `ModLoader-Client/instance/mods` automatically when that folder exists.

## 4. Play

Run `launch.bat` / `launch.sh`, pick **0.0.8-Debug**, enter a world, press `T` and type `/hello`.
`/chelp` lists your command with its translated description; `/lang es_es` switches language.

## Next steps

- [Drawing on the HUD](#/tutorials/hud-overlay)
- [Reacting to clicks and blocks](#/tutorials/events)
- [Recipes and items](#/tutorials/crafting-recipes)
- [A server plugin](#/tutorials/server-plugin)
