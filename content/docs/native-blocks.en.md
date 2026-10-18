---
title: Native blocks (block registration)
summary: Add real engine blocks from a mod, like Fabric or Forge: textures, light, hardness, tools, multiplayer.
order: 3
---

# Native blocks

A **native block** is a real OpenVoxel block type added by your mod. The game treats it exactly like
its own blocks: chunk rendering and lighting, collision, mining, saving, networking, the creative
inventory and block icons. It is the equivalent of block registration in Fabric or Forge.

> Available since ModLoader **1.1.0-pre3** (in development). Use [Javadoc → NativeBlocks](javadoc/client/com/happyuky7/openvoxelmoding/loader/NativeBlocks.html) for every option.

## Register a block

Register blocks in `onLoad`: the game loads its block list right after the mods, and the list is
closed from then on.

```java
public final class MyMod implements ClientMod {
    @Override public void onLoad(ModContext ctx) {
        ctx.nativeBlock("mymod:ruby_block")
           .name("Ruby Block")
           .texture("assets/mymod/textures/ruby_block.png")
           .hardness(3f).tool("pickaxe", true)
           .register();

        ctx.nativeBlock("mymod:glow_lamp")
           .name("Glow Lamp")
           .textures("assets/mymod/textures/lamp_top.png", "assets/mymod/textures/lamp_side.png", null)
           .translucent().light(15)
           .register();

        ctx.registerRecipe("mymod:ruby_block", 1, new String[]{"RR", "RR"}, "R", "redstone");
    }
}
```

Put the 16x16 PNG textures in your jar (`src/main/resources/assets/mymod/textures/`).

| Builder method | Meaning | Default |
|----------------|---------|---------|
| `name(String)` | Fallback display name (lang key `block.mymod.ruby_block` wins) | the id |
| `texture(path)` | One texture for every face | required |
| `textures(top, side, bottom)` | Per-face textures (`null` side/bottom = top) | — |
| `solid(boolean)` | Collides with players | `true` |
| `light(0..15)` | Light emitted (torch = 14) | 0 |
| `translucent()` | Glass-like: translucent pass, lets light through | opaque |
| `opacity(0..15)` | Light it absorbs | 15 |
| `gravity()` | Falls like sand | no |
| `hardness(seconds)` | Break time base (stone 1.5, dirt 0.5; 0 instant, < 0 unbreakable) | 1.5 |
| `tool(name, required)` | `pickaxe`, `shovel`, `axe`; `required` = only drops with it | none |
| `hidden()` | Not in the creative inventory | visible |

The block id works everywhere ids are accepted: `/give mymod:ruby_block 64`, `ctx.giveItem`,
recipes, Tab completion and `ctx.getHeldItem()`.

## Ids and saves

Each block gets a numeric type id between 1024 and 4095, **derived from its namespaced id**. The
same mod on any computer gets the same number, so worlds and servers agree without a registry sync.
Worlds store that number: if you remove the mod, those blocks behave as air until you install it
again (the world keeps the data).

## Multiplayer

For a dedicated server to know your blocks:

1. Put the **same mod jar** in `ModLoader-Server/mods/` (plugins and mods share the folder; only jars
   with `plugin.yml` are deployed as plugins).
2. Put the ModLoader client jar in `ModLoader-Server/agent/` (the server ZIP already includes it).
3. Start with `start.bat` / `start.sh`. The console shows `ModLoader agent: ... (native blocks enabled)`
   and `native block mymod:ruby_block -> type id ...`.

On the server only `onLoad` runs and `ctx.isServer()` is true; chat, sounds, commands, recipes and items
are ignored there, so the same mod class works on both sides. Singleplayer needs nothing extra.

## ModLoader blocks vs native blocks

| | Native block (`nativeBlock`) | ModLoader block (`registerBlock`) |
|---|---|---|
| Engine block type | its own | stored as a base engine block + code |
| Server needs | same mod + agent | nothing (vanilla servers show the base block) |
| Right-click behaviour | not yet | `BlockUseHandler` |
| Use for | new materials, decoration, light sources | interactive blocks, servers without the agent |
