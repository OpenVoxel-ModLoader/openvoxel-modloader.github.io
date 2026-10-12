---
title: Getting started with OpenVoxel ModLoader
summary: Install the loader, drop mods in the instance folder and play.
order: 1
---

# Getting started

**OpenVoxel ModLoader** adds a modding layer to OpenVoxel without touching the game JAR: it runs as a
Java agent and wraps a few engine methods in memory.

1. Put the `ModLoader-Client` folder next to `OpenVoxelLauncher.exe` (or set `OPENVOXEL_HOME`).
2. Run `launch.bat` / `launch.ps1` (Windows) or `./launch.sh` (Linux) and pick version **0.0.8-Debug** in the launcher.
3. Put mod JARs in `instance/mods`.
4. Settings live in `instance/config/user-config.properties`; skins in `config/skin.png`, capes in `config/cape.png`.

## What you get

- Minecraft-style menus, options, F3 debug screen and inventory.
- Creative (double-tap space to fly) and Survival (hunger, armor, fall damage).
- Steve/Alex two-layer skins, capes and elytra wings.
- Chat colors (`&a`, `&#ff8800`), command history, Tab completion.
- Resource packs: `client\instance\resourcepacks\<name>\textures\blocks\*.png`.
- Languages: English and Spanish built in; mods can ship `assets/<id>/lang/<code>.json`.
