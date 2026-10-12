---
title: Mod API reference
summary: Every ClientMod hook and ModContext method, with examples.
order: 2
---

# Mod API reference

A client mod is a JAR in `instance/mods` containing `openvoxel.mod.properties` and a class that
implements `com.happyuky7.openvoxelmoding.loader.ClientMod`. The loader creates one instance per
mod and passes the shared `ModContext` to every hook.

```properties
# openvoxel.mod.properties
id=mymod                 # short id: lowercase, used for assets/<id>/lang and config/<id>.properties
name=My Mod              # shown in the Mods screen
version=0.1.0
main=com.example.mymod.MyMod
```

## `ClientMod` hooks

| Hook | When | Typical use |
|------|------|-------------|
| `onLoad(ModContext ctx)` | JVM start, before the window exists. | Register commands, read config, log. No engine yet. |
| `onGameReady(ModContext ctx)` | The engine exists (`ctx.engine()` works); no world yet. | Register engine event listeners, recipes. |
| `onFrame(ModContext ctx)` | Every rendered frame, main thread, after the HUD. | Draw HUD elements, poll keys, cheap per-frame logic. |
| `onShutdown(ModContext ctx)` | Game closing. | Save state. |

All hooks are `default` methods — implement only the ones you need. Exceptions thrown inside a hook
are logged and do not stop the game or other mods.

## `ModContext`

### Paths & engine

| Method | Returns |
|--------|---------|
| `getGameDirectory()` | `Path` of the folder the game runs in (`Game/`). |
| `getInstanceDirectory()` | `Path` of `instance/` (mods, config, lang, resourcepacks, sounds, music). |
| `getConfigDirectory()` | `instance/config`. |
| `engine()` | `net.openvoxel.engine.VoxelEngine` or `null` before `onGameReady`. |
| `getEngine(Class<T>)` | Same, cast to the given type. |
| `isInWorld()` | `true` while a world (singleplayer or server) is loaded. |
| `getPlayerPosition()` | `org.joml.Vector3d` feet position (copy), or `null` outside a world. |
| `getPlayerYaw()` / `getPlayerPitch()` | Camera angles in degrees. |

### Chat, logging, sound

| Method | Effect |
|--------|--------|
| `log(String)` | Prints `[ModLoader] …` to the console / log. |
| `chat(String)` | Adds a line to the in-game chat. Colors: `&0`–`&f`, `&r`, `&#rrggbb`. |
| `playSound(String name)` | Plays a sound event: `step`, `break`, `place`, `pickup`, `eat`, `pop`, `hurt`, `click`, or any `instance/sounds/<name>.wav`. |

### Commands, translations, settings

| Method | Effect |
|--------|--------|
| `registerCommand(name, description, handler)` | Adds `/name`. `handler.run(String[] args)` receives the arguments. Listed by `/chelp`, Tab-completed. |
| `translate(key, args...)` | Looks the key up in the current language, falls back to English, then to the key. `args` are `String.format` parameters. |
| `language()` | Current language code (`en_us`, `es_es`, …). |
| `config(modId)` | A `ModConfig` backed by `instance/config/<modId>.properties`. |

`ModConfig`: `get(key, def)`, `getInt`, `getDouble`, `getBoolean`, `set(key, value)` (chainable),
`remove(key)`, `has(key)`, `save()`, `getFile()`. Configs are also saved automatically on shutdown.

Translations: put `assets/<id>/lang/en_us.json` (and `es_es.json`, …) in the JAR. Keys are flat
strings; `%s` / `%d` placeholders work with `translate`. Players can override any key with
`instance/lang/<code>.json`.

### Game mode, items, recipes

| Method | Effect |
|--------|--------|
| `isCreative()` / `isSurvival()` / `isFlying()` | Current mode and flight state. |
| `giveItem(id, count)` | Adds items to the hotbar/storage. `id` is an item id (`iron_sword`, `apple`, `stick`, `crafting_table`, …) or a block name (`stone`, `oak_log`). Returns `false` when full or unknown. |
| `getHeldItem()` | Id/name of the selected hotbar slot, or `null`. |
| `registerRecipe(resultId, count, pattern, keys...)` | Shaped recipe. `pattern` rows use one char per cell (space = empty); `keys` pairs chars with ids. Matches at any offset and mirrored, in the 2x2 grid when it fits, else the crafting table. |
| `itemIds()` | All item ids known to the loader. |

```java
ctx.registerRecipe("torch", 4, new String[]{"C", "S"}, "C", "coal", "S", "stick");
ctx.registerRecipe("diamond_sword", 1, new String[]{"D", "D", "S"}, "D", "diamond", "S", "stick");
```

Built-in items: `wooden|stone|iron|golden|diamond` × `_sword|_pickaxe|_shovel|_axe`,
`leather|iron|golden|diamond` × `_helmet|_chestplate|_leggings|_boots`, `apple`, `golden_apple`,
`bread`, `cooked_beef`, `stick`, `coal`, `copper_ingot`, `iron_ingot`, `gold_ingot`, `diamond`,
`emerald`, `redstone`, `lapis`, `crafting_table`, `chest`, `bed`.

## Engine entry points (the game API)

The whole game (`net.openvoxel.*`) is on the classpath. Most useful classes:

| Class | Use |
|-------|-----|
| `VoxelEngine` | `getEngine()`, `isWorldActive()`, `getWorld()`, `getCamera()`, `getRenderer()`, `getLocalPlayer()`, `getEventManager()`, `sendChat(msg)`, `runOnMainThread(Runnable)`. |
| `Camera` | `getPosition()`, `getYaw()/getPitch()`, `getFacing()`, `getBlockInHand()`, `isThirdPerson()`, `getAspect()`. |
| `World` | `getBlock(x,y,z)`, `getState(x,y,z)`, `setBlock(x,y,z,AbstractBlock)`, `getChunks()`, `getSeed()`. |
| `BlockType` | enum of blocks: `BlockType.STONE`, `isSolid()`, `getId()`, `fromId(int)`; `BlockState.typeId(state)`. |
| `GameEventManager` | `register(ClickEvent.class, e -> …)`; `ClickEvent` has `type` (LEFT/RIGHT/MIDDLE) and `worldX/Y/Z`. |
| `GLUIRenderer` | 2D drawing: `setup2DRendering(w,h)`, `drawPanel`, `drawRect`, `drawText`, `getTextWidth`, `drawTexture`, `restore3DRendering()`. |
| `UIManager` | `get().openGUI(gui)`, `closeTopGUI()`, `hasActiveGUIs()`, `getWindow()` (GLFW handle). |
| `ChatHud` | `addLine(text)` (same as `ctx.chat`). |
| `PlayerEntity` | `health`, `maxHealth`, `dead`, `username`, `position`. |
| `Texture` | `new Texture("textures/blocks/stone.png")` or `new Texture(byte[] png)`; `bind()`. |
| `org.lwjgl.glfw.GLFW` | key / mouse polling: `glfwGetKey(window, GLFW_KEY_X) == GLFW_PRESS`. |

HUD drawing pattern (inside `onFrame`):

```java
int[] size = ctx.engine().getCamera().getAspect();
GLUIRenderer.setup2DRendering(size[0], size[1]);
try {
    GLUIRenderer.drawPanel(8, 8, 160, 40, 0f, 0f, 0f, 0.5f);
    GLUIRenderer.drawText("Hello", 16, 32, 1f, 1f, 1f, 1f);   // x, baseline y, r, g, b, a
} finally { GLUIRenderer.restore3DRendering(); }
```

Rules of thumb: do GL work only from `onFrame` or `runOnMainThread`; never block the main
thread (use a daemon thread for HTTP/IO and post results back with `runOnMainThread`).
