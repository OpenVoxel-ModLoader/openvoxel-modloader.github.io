---
title: Primeros pasos con OpenVoxel ModLoader
summary: Instala el loader, copia mods en la carpeta de la instancia y juega.
order: 1
---

# Primeros pasos

**OpenVoxel ModLoader** añade una capa de mods a OpenVoxel sin tocar el JAR del juego: se ejecuta como
agente Java y envuelve en memoria algunos métodos del motor.

1. Pon la carpeta `ModLoader-Client` junto a `OpenVoxelLauncher.exe` (o define `OPENVOXEL_HOME`).
2. Ejecuta `launch.bat` / `launch.ps1` (Windows) o `./launch.sh` (Linux) y elige la versión **0.0.8-Debug** en el launcher.
3. Pon los JAR de mods en `instance/mods`.
4. Los ajustes están en `instance/config/user-config.properties`; la skin en `config/skin.png`, la capa en `config/cape.png`.

## Qué incluye

- Menús, opciones, pantalla F3 e inventario al estilo Minecraft.
- Creativo (doble espacio para volar) y Supervivencia (hambre, armadura, daño de caída).
- Skins Steve/Alex de dos capas, capas y alas de élitros.
- Colores en el chat (`&a`, `&#ff8800`), historial de comandos, autocompletar con Tab.
- Paquetes de texturas: `client\instance\resourcepacks\<nombre>\textures\blocks\*.png`.
- Idiomas: inglés y español incluidos; los mods pueden traer `assets/<id>/lang/<código>.json`.
