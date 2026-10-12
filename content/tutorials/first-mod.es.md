---
title: Tu primer mod en 10 minutos
summary: De la plantilla a un comando /hello con traducción y un ajuste guardado.
order: 1
---

# Tu primer mod

**Necesitas**: JDK 11+ (`javac -version`), el juego instalado con el launcher oficial y el jar del
loader de las releases de ModLoader-Client.

## 1. Copia la plantilla

```
git clone https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples.git
cp -r ModLoader-ModsExamples/mod-template mi-primer-mod
```

Renombra: paquete `com.example.mymod` → el tuyo, `id=mymod` → `id=primermod`, `name=Primer Mod`,
`main=` tu clase. Renombra `assets/mymod` → `assets/primermod`.

## 2. Escribe el mod

```java
package com.example.primermod;

import com.happyuky7.openvoxelmoding.loader.*;

public final class PrimerMod implements ClientMod {
    private ModConfig config;

    @Override public void onLoad(ModContext ctx) {
        config = ctx.config("primermod");                              // instance/config/primermod.properties
        ctx.registerCommand("hello", ctx.translate("primermod.command"), args -> {
            int veces = config.getInt("saludos", 0) + 1;
            config.set("saludos", veces).save();
            ctx.chat(ctx.translate("primermod.hello", veces));          // "&a¡Hola! Saludo nº %d"
            ctx.playSound("pop");
        });
    }
}
```

`src/main/resources/assets/primermod/lang/es_es.json`:

```json
{ "primermod.hello": "&a¡Hola! Saludo nº %d", "primermod.command": "saluda" }
```

y `en_us.json`:

```json
{ "primermod.hello": "&aHello! Greeting #%d", "primermod.command": "says hello" }
```

## 3. Compila

```
export OPENVOXEL_GAME_JAR=.../Game/versions/0.0.8-Debug/openvoxel-0.0.8-Debug.jar
export OPENVOXEL_MODLOADER_JAR=.../ModLoader-Client/dist/ModLoader-v1.0.0-vgame-0.0.8-client.jar
./build.sh            # o build.bat; o `gradle jar`
```

El jar se copia solo a `ModLoader-Client/instance/mods` si esa carpeta existe.

## 4. Juega

Ejecuta `launch.bat` / `launch.sh`, elige **0.0.8-Debug**, entra a un mundo, pulsa `T` y escribe `/hello`.
`/chelp` lista tu comando con su descripción traducida; `/lang en_us` cambia el idioma.

## Siguientes pasos

- [Dibujar en el HUD](#/tutorials/hud-overlay)
- [Reaccionar a clics y bloques](#/tutorials/events)
- [Recetas y objetos](#/tutorials/crafting-recipes)
- [Un plugin de servidor](#/tutorials/server-plugin)
