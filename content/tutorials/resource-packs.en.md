---
title: Making a resource pack
summary: Override any block texture with a folder of PNGs.
order: 2
---

# Resource packs

Create `ModLoader-Client/instance/resourcepacks/<pack-name>/` and mirror the paths inside the
game JAR, for example `textures/blocks/stone.png`. Any file you add replaces the original texture.

Select the pack in *Options → Textures*. The world re-meshes immediately; no restart needed.

Tips:

- Keep the same size as the original (16x16 for most blocks).
- Animated textures are vertical strips (frames stacked), like `water_still.png`.
- To find texture names, list the JAR: `jar tf the game JAR (OPENVOXEL_GAME_JAR) | findstr textures/blocks`.
