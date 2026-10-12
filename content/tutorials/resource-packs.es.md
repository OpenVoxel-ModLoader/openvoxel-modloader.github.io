---
title: Crear un paquete de texturas
summary: Sustituye cualquier textura de bloque con una carpeta de PNG.
order: 2
---

# Paquetes de texturas

Crea `ModLoader-Client/instance/resourcepacks/<nombre>/` y reproduce las rutas del JAR del juego,
por ejemplo `textures/blocks/stone.png`. Cualquier archivo que añadas sustituye la textura original.

Elige el paquete en *Opciones → Texturas*. El mundo se vuelve a generar al instante; no hace falta reiniciar.

Consejos:

- Mantén el tamaño original (16x16 en la mayoría de bloques).
- Las texturas animadas son tiras verticales (fotogramas apilados), como `water_still.png`.
- Para ver los nombres: `jar tf the game JAR (OPENVOXEL_GAME_JAR) | findstr textures/blocks`.
