---
title: Historial de cambios
summary: Qué cambió en cada versión del ModLoader.
order: 9
---

# Historial de cambios

## Próxima — 1.1.0-pre3 (en desarrollo)

**Mods**
- **Bloques nativos**: `ctx.nativeBlock("mimod:bloque_rubi")...register()` añade tipos de bloque reales del motor (registro al estilo Fabric/Forge): texturas, luz, translucidez, gravedad, dureza y herramientas; ids deterministas compartidos por cliente y servidor.
- El agente ModLoader funciona en servidores dedicados (`ModLoader-Server/agent/`) para que conozcan los bloques de los mods; `ctx.isServer()`.
- `registerRecipe` / `registerBlock` se pueden usar en `onLoad` (se aplican cuando el juego está listo).
- Javadoc completo de la API pública, publicado en [javadoc/client](javadoc/client/index.html) y [javadoc/server](javadoc/server/index.html).

- **/give** funciona como en Minecraft: los objetos van al inventario (se juntan), lo que sobra cae a tus pies, el objeto de la mano no se reemplaza y la cantidad llega a 2304; en servidores ModLoader necesita `openvoxel.command.give` (`.others` para otros jugadores).
- La plantilla de mod ya no llena el chat con la posición del jugador (ahora tiene un comando `/where`).

**Servidor**
- `header`/`footer` de la tab list pueden ser listas YAML o texto con `
`: varias líneas cada uno.
- `/give [jugador] <objeto> [cantidad]` con permisos.
- Los scripts de arranque cargan el agente desde `agent/` y solo despliegan a `plugins/` los jars de `mods/` con `plugin.yml`.

## 1.1.0-pre2 — 2026-10-18 (cliente + servidor, beta)

Descargas: [ZIP del cliente](https://github.com/OpenVoxel-ModLoader/ModLoader-Client/releases/download/v1.1.0-pre2/ModLoader-Client-v1.1.0-pre2-vgame-0.0.8.zip) · [ZIP del servidor](https://github.com/OpenVoxel-ModLoader/ModLoader-Server/releases/download/v1.1.0-pre2/ModLoader-Server-v1.1.0-pre2-vgame-0.0.8.zip). Actualiza cliente y servidor a la vez: los modos de juego, los permisos y la tab list necesitan ambos.

**Cliente**
- Los bloques del ModLoader son **bloques de verdad**: su id va en el estado del bloque, así que el renderizado de chunks los dibuja con la iluminación del mundo, el guardado los conserva y en servidores los ven los demás jugadores con ModLoader. Los bloques de mundos de la 1.1.0-pre1 se actualizan solos.
- Registro de bloques con id con namespace (`modloader:chest`, `mimod:bloque_rubi`) y `ModContext.registerBlock` para mods.
- Pantalla de muerte con *Reaparecer* / *Menú principal*, causas reales, objetos soltados donde mueres (supervivencia). Reaparecer funciona también con muertes que el servidor no conoce.
- Pick block (clic central) como en Minecraft: selecciona el slot que ya lo tiene, lo saca del inventario en supervivencia y nunca borra el objeto que tenías.
- Errores de conexión explicados (otra build del juego, sesión, rechazada, tiempo agotado) y el menú principal muestra la build y el protocolo reales.
- El menú principal usa el fondo, logo y botones propios de OpenVoxel.

**Servidor**
- Sistema de permisos: operadores (`/op`, `/deop`, `ops.yml`), nodos por defecto en `permissions.yml`, cada comando protegido por un nodo, `/perms check|reload` y una API `Permissions` pública para plugins (el soporte de LuckPerms se está construyendo sobre ella).
- `/gamemode` lo decide el servidor para clientes ModLoader (por defecto solo ops).
- Tab list configurable en `tablist.yml` (cabecera, pie y formato de nombres con prefijos).
- `server.properties.yml` → `gameplay`: nombre del servidor, mensaje de entrada, modo por defecto, máximo de jugadores y whitelist.
- `/msg`, `/spawn`, `/setspawn`, `/warp`, `/setwarp`, `/delwarp`, `/warps`, `/whitelist`.

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
