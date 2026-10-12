---
title: Reaccionar a clics y bloques
summary: Eventos del motor, leer y cambiar bloques, ejecutar código en el hilo principal.
order: 3
---

# Reaccionar a clics y bloques

El motor lanza `ClickEvent` por cada clic izquierdo / central / derecho sobre un bloque. Regístrate en
`onGameReady` (el gestor de eventos existe desde entonces).

```java
import net.openvoxel.engine.VoxelEngine;
import net.openvoxel.engine.events.player.ClickEvent;
import net.openvoxel.engine.world.block.BlockType;

@Override public void onGameReady(ModContext ctx) {
    VoxelEngine engine = ctx.engine();
    engine.getEventManager().register(ClickEvent.class, e -> {
        if (engine.getWorld() == null) return;
        BlockType type = engine.getWorld().getBlock(e.worldX, e.worldY, e.worldZ).getType();
        switch (e.type) {
            case LEFT:  ctx.chat("&7Rompiendo " + type.name().toLowerCase()); break;
            case RIGHT: ctx.chat("&7Usando " + type.name().toLowerCase()); break;
            case MIDDLE: ctx.giveItem(type.name(), 1); break;
        }
    });
}
```

Los listeners corren en el hilo principal justo antes de que el motor procese el clic, así que ven el
bloque *antes* de cambiar. En Supervivencia el loader retrasa la rotura hasta que termina el temporizador
de minado, por lo que un evento LEFT puede no quitar el bloque todavía.

## Leer el mundo

```java
long state = world.getState(x, y, z);                 // estado empaquetado
BlockType t = BlockType.fromId(BlockState.typeId(state));
boolean solid = t.isSolid();
```

`world.getBlock(x, y, z)` devuelve un `AbstractBlock` (`getType()`, `getState()`). Son coordenadas de
bloque del mundo; los pies del jugador están en `ctx.getPlayerPosition()`.

## Cambiar el mundo

```java
world.setBlock(x, y, z, new AbstractBlock(BlockType.GLASS));
ctx.engine().getRenderer().invalidateBlock(x, y, z);      // regenerar el chunk
```

En un servidor esto solo cambia la copia de tu cliente; usa un plugin de servidor (`VoxelServer.setBlock`)
para cambios que deban ver todos.

## Saber a qué mira el jugador

```java
InputHandler.Hit hit = ctx.engine().getCamera().getInputHandler().getHoverHit();
if (hit != null) ctx.chat(hit.x + " " + hit.y + " " + hit.z + " normal " + hit.nx + "," + hit.ny + "," + hit.nz);
```

## Hilos

Todo el motor es monohilo. Desde otro hilo (HTTP, temporizadores) devuelve el trabajo con:

```java
ctx.engine().runOnMainThread(() -> ctx.chat("listo"));
```
