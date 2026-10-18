---
title: Changelog
summary: What changed in each ModLoader release.
order: 9
---

# Changelog

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
