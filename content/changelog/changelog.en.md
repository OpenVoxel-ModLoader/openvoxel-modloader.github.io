---
title: Changelog
summary: What changed in each ModLoader release.
order: 9
---

# Changelog

## Next — 1.1.0-pre3 (in development)

**Mods**
- **Native blocks**: `ctx.nativeBlock("mymod:ruby_block")...register()` adds real engine block types (Fabric/Forge-style registration): textures, light, translucency, gravity, hardness and tools; deterministic type ids shared by client and server.
- The ModLoader agent runs on dedicated servers (`ModLoader-Server/agent/`) so servers know mod blocks; `ctx.isServer()`.
- `registerRecipe` / `registerBlock` are safe in `onLoad` (applied when the game is ready).
- Complete Javadoc for the public API, published at [javadoc/client](javadoc/client/index.html) and [javadoc/server](javadoc/server/index.html).

**Server**
- Start scripts load the agent from `agent/` and only deploy jars with `plugin.yml` from `mods/` to `plugins/`.

## 1.1.0-pre2 — 2026-10-18 (client + server, beta)

Downloads: [client ZIP](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/download/v1.1.0-pre2/ModLoader-Client-v1.1.0-pre2-vgame-0.0.8.zip) · [server ZIP](https://github.com/OpenVoxel-ModLoader/ModLoader-Server/releases/download/v1.1.0-pre2/ModLoader-Server-v1.1.0-pre2-vgame-0.0.8.zip). Update the client and the server together: game modes, permissions and the tab list need both.

**Client**
- ModLoader blocks are **real blocks**: their id is stored in the block state, so the chunk renderer draws them with world lighting, the world save keeps them and other ModLoader players on a server see them. Blocks from 1.1.0-pre1 worlds are upgraded automatically.
- Block registry with namespaced ids (`modloader:chest`, `mymod:ruby_block`) and `ModContext.registerBlock` for mods.
- Death screen with *Respawn* / *Title screen*, real death causes, items dropped where you die (survival). Respawn also works for deaths the server does not know about.
- Pick block (middle click) works like Minecraft: selects the slot that already has the block, takes it from the inventory in survival, never deletes the held item.
- Clearer connection errors (different game build, session, refused, timeout) and the main menu shows the real launcher build and protocol.
- Main menu uses OpenVoxel's own backdrop, logo and buttons.

**Server**
- Permission system: operators (`/op`, `/deop`, `ops.yml`), default nodes in `permissions.yml`, every command protected by a node, `/perms check|reload`, and a public `Permissions` API for plugins (LuckPerms support is being built on it).
- `/gamemode` is decided by the server for ModLoader clients (ops only by default).
- Tab list configurable in `tablist.yml` (header, footer, name format with prefixes).
- `server.properties.yml` → `gameplay`: server name, join message, default game mode, max players, whitelist.
- `/msg`, `/spawn`, `/setspawn`, `/warp`, `/setwarp`, `/delwarp`, `/warps`, `/whitelist`.

## 1.1.0-pre1 — 2026-10-18 (client, beta)

> Pre-release for testing. The final 1.1.0 will add the server side (operators, `/gamemode` only for ops, `tablist.yml`, world spawn/warps).

Download: [ModLoader-Client-v1.1.0-pre1-vgame-0.0.8.zip](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/download/v1.1.0-pre1/ModLoader-Client-v1.1.0-pre1-vgame-0.0.8.zip)

**Gameplay**
- Torches behave like Minecraft: they attach to walls (tilted model), need a solid block below or behind them, pop off (dropping the item in survival) when that block is broken, and a block placed on a torch goes next to it instead of replacing it.
- Client-side mobs: pigs wander on grass by day, zombies spawn in the dark and chase/attack the player in survival. Hit them with the left button (swords deal more damage); pigs drop porkchops, zombies rotten flesh. `/mobs <on|off|clear|count|spawn [pig|zombie]>`. Mobs live only on your client (not synced on servers).
- Recipe book (book button next to the crafting grid) in the inventory and the crafting table: craftable recipes first, click to fill the grid, "Show all" to see every recipe with the missing ingredients.
- Creative inventory with Minecraft-style icon tabs: Blocks, Tools, Combat, Food, Materials and your Inventory (storage + armor). Stack counts are shown in creative too.
- Right click in slots now picks up half / drops one, like Minecraft.
- `/clear` empties the hotbar and inventory.

**Interface**
- Tab completion with a suggestion popup: commands, their arguments (game modes, items, languages, players…) and player names; Up/Down pick, Tab cycles.
- Player list while holding Tab (rebindable), with header/footer from ModLoader servers.
- Fix: menu buttons did not react when the window was maximized or fullscreen (the engine kept its 1280x720 camera until a resize event).
- First-person arm pose closer to Minecraft; chest tile is now drawn with its own textures (it used to look like a log).

**Servers**
- New control channel: when the client joins a ModLoader server it announces itself (`/mlhello`) and the server can set the game mode, send its command list and the tab list. `/gamemode` on such servers is decided by the server (operator check) — the server-side part ships with the final 1.1.0.

**Mod API**
- `ModContext.setHotbarSlot(int)`.

## 1.0.0 — 2026-10-12

- First public release: client loader (Java agent), server core plugin, examples, docs site. See the [1.0.0 release notes](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/tag/v1.0.0).
