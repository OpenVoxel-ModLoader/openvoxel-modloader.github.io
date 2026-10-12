---
title: Referencia de la API de mods
summary: Hooks de ClientMod y servicios de ModContext.
order: 2
---

# API de mods

Un mod es un JAR con `openvoxel.mod.properties` (`id`, `name`, `version`, `main`) cuya clase principal
implementa `com.happyuky7.openvoxelmoding.loader.ClientMod`.

## Hooks

| Hook | Cuándo |
|------|--------|
| `onLoad(ctx)` | Al arrancar la JVM, antes de que exista la ventana. Registra aquí tus comandos. |
| `onGameReady(ctx)` | Motor creado: mundo, cámara, renderer y gestor de eventos disponibles. |
| `onFrame(ctx)` | Cada fotograma en el hilo principal. Dibuja aquí elementos del HUD. |
| `onShutdown(ctx)` | Al cerrar el juego. |

## ModContext

```java
ctx.chat("&aHola");                                     // línea de chat con colores
ctx.registerCommand("foo", "hace foo", args -> {...});  // /foo, con Tab y listado en /chelp
ctx.translate("mimod.clave", arg1);                     // assets/<id>/lang/<código>.json
ctx.getEngine(VoxelEngine.class);                       // net.openvoxel.engine.VoxelEngine
ctx.getInstanceDirectory();                             // client/instance
ctx.isCreative();
```

Toda la API del juego (`net.openvoxel.*`) está en el classpath. Puntos de entrada útiles:
`VoxelEngine.getEngine()`, `engine.getCamera().getPosition()`, `engine.getWorld().getBlock(x,y,z)`,
`engine.getEventManager().register(ClickEvent.class, e -> ...)`, `GLUIRenderer.drawText(...)`.
