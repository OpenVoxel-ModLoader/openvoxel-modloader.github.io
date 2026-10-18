---
title: Historial de cambios
summary: Qué cambió en cada versión del ModLoader.
order: 9
---

# Historial de cambios

## 1.1.0-pre1 — 2026-10-18 (cliente, beta)

> Pre-release para pruebas. La 1.1.0 final añadirá la parte de servidor (operadores, `/gamemode` solo para ops, `tablist.yml`, spawn/warps).

Descarga: [ModLoader-Client-v1.1.0-pre1-vgame-0.0.8.zip](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/download/v1.1.0-pre1/ModLoader-Client-v1.1.0-pre1-vgame-0.0.8.zip)

**Jugabilidad**
- Las antorchas funcionan como en Minecraft: se pegan a las paredes (modelo inclinado), necesitan un bloque sólido debajo o detrás, se caen (soltando el objeto en supervivencia) al romper ese bloque, y poner un bloque sobre una antorcha lo coloca al lado en vez de reemplazarla.
- Mobs en el cliente: los cerdos pasean por la hierba de día, los zombis aparecen en la oscuridad y persiguen/atacan al jugador en supervivencia. Golpéalos con clic izquierdo (las espadas hacen más daño); los cerdos sueltan chuletas y los zombis carne podrida. `/mobs <on|off|clear|count|spawn [pig|zombie]>`. Solo existen en tu cliente (no se sincronizan en servidores).
- Libro de recetas (botón del libro junto a la rejilla) en el inventario y la mesa de crafteo: primero las crafteables, clic para rellenar la rejilla, "Mostrar todo" para ver todas con los ingredientes que faltan.
- Inventario creativo con pestañas con icono estilo Minecraft: Bloques, Herramientas, Combate, Comida, Materiales y tu Inventario (almacén + armadura). En creativo también se ven las cantidades.
- El clic derecho en los slots coge la mitad / suelta uno, como en Minecraft.
- `/clear` vacía la hotbar y el inventario.

**Interfaz**
- Autocompletado con ventana de sugerencias: comandos, sus argumentos (modos de juego, objetos, idiomas, jugadores…) y nombres de jugadores; Arriba/Abajo eligen, Tab rota.
- Lista de jugadores manteniendo Tab (remapeable), con cabecera/pie de los servidores ModLoader.
- Fix: los botones de los menús no respondían con la ventana maximizada o en pantalla completa (el motor mantenía la cámara a 1280x720 hasta un evento de redimensionado).
- Pose del brazo en primera persona más parecida a Minecraft; el cofre ahora se dibuja con sus propias texturas (antes parecía un tronco).

**Servidores**
- Nuevo canal de control: al entrar en un servidor ModLoader el cliente se anuncia (`/mlhello`) y el servidor puede fijar el modo de juego, enviar su lista de comandos y la tab list. En esos servidores `/gamemode` lo decide el servidor (comprobación de operador) — la parte del servidor llega con la 1.1.0 final.

**API de mods**
- `ModContext.setHotbarSlot(int)`.

## 1.0.0 — 2026-10-12

- Primera versión pública: loader de cliente (agente Java), plugin núcleo de servidor, ejemplos, web de docs. Ver las [notas de la 1.0.0](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/tag/v1.0.0).
