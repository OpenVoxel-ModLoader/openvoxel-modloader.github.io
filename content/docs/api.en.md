---
title: Mod API reference
summary: ClientMod hooks and the ModContext services.
order: 2
---

# Mod API

A mod is a JAR with `openvoxel.mod.properties` (`id`, `name`, `version`, `main`) whose main class
implements `com.happyuky7.openvoxelmoding.loader.ClientMod`.

## Hooks

| Hook | When |
|------|------|
| `onLoad(ctx)` | JVM start, before the window exists. Register commands here. |
| `onGameReady(ctx)` | Engine created – world, camera, renderer and the event manager are reachable. |
| `onFrame(ctx)` | Every rendered frame on the main thread. Draw HUD elements here. |
| `onShutdown(ctx)` | Game closing. |

## ModContext

```java
ctx.chat("&aHello");                                   // chat line with colors
ctx.registerCommand("foo", "does foo", args -> {...}); // /foo, Tab-completed, listed by /chelp
ctx.translate("mymod.key", arg1);                      // assets/<id>/lang/<code>.json
ctx.getEngine(VoxelEngine.class);                      // net.openvoxel.engine.VoxelEngine
ctx.getInstanceDirectory();                            // client/instance
ctx.isCreative();
```

The entire game API (`net.openvoxel.*`) is on the classpath. Useful entry points:
`VoxelEngine.getEngine()`, `engine.getCamera().getPosition()`, `engine.getWorld().getBlock(x,y,z)`,
`engine.getEventManager().register(ClickEvent.class, e -> ...)`, `GLUIRenderer.drawText(...)`.
