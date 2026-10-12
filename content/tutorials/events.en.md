---
title: Reacting to clicks and blocks
summary: Engine events, reading and changing blocks, running code on the main thread.
order: 3
---

# Reacting to clicks and blocks

The engine fires `ClickEvent` for left / middle / right clicks on a block. Register in
`onGameReady` (the event manager exists from then on).

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
            case LEFT:  ctx.chat("&7Breaking " + type.name().toLowerCase()); break;
            case RIGHT: ctx.chat("&7Using " + type.name().toLowerCase()); break;
            case MIDDLE: ctx.giveItem(type.name(), 1); break;
        }
    });
}
```

Listeners run on the main thread right before the engine processes the click, so they see the block
*before* it changes. In Survival the loader delays breaking until the mining timer ends, so a LEFT event
may not remove the block yet.

## Reading the world

```java
long state = world.getState(x, y, z);                 // packed block state
BlockType t = BlockType.fromId(BlockState.typeId(state));
boolean solid = t.isSolid();
```

`world.getBlock(x, y, z)` returns an `AbstractBlock` (`getType()`, `getState()`). Coordinates are
world block coordinates; the player's feet are at `ctx.getPlayerPosition()`.

## Changing the world

```java
world.setBlock(x, y, z, new AbstractBlock(BlockType.GLASS));
ctx.engine().getRenderer().invalidateBlock(x, y, z);      // re-mesh the chunk
```

On a server this changes only your client's copy; use a server plugin (`VoxelServer.setBlock`) for
changes everybody should see.

## Finding what the player looks at

```java
InputHandler.Hit hit = ctx.engine().getCamera().getInputHandler().getHoverHit();
if (hit != null) ctx.chat(hit.x + " " + hit.y + " " + hit.z + " face normal " + hit.nx + "," + hit.ny + "," + hit.nz);
```

## Threads

Everything in the engine is single-threaded. From another thread (HTTP, timers) hand work back with:

```java
ctx.engine().runOnMainThread(() -> ctx.chat("done"));
```
