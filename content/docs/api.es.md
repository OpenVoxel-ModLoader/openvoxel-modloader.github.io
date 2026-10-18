---
title: Referencia de la API de mods
summary: Todos los hooks de ClientMod y métodos de ModContext, con ejemplos.
order: 2
---

# Referencia de la API de mods

> Referencia generada completa: **[Javadoc (API de cliente)](javadoc/client/index.html)** · [API de servidor](javadoc/server/index.html). Esta página es la visita guiada.

Un mod de cliente es un JAR en `instance/mods` con `openvoxel.mod.properties` y una clase que
implementa `com.happyuky7.openvoxelmoding.loader.ClientMod`. El loader crea una instancia por mod y
pasa el `ModContext` compartido a cada hook.

```properties
# openvoxel.mod.properties
id=mimod                 # id corto en minúsculas: se usa en assets/<id>/lang y config/<id>.properties
name=Mi Mod              # nombre en la pantalla Mods
version=0.1.0
main=com.example.mimod.MiMod
```

## Hooks de `ClientMod`

| Hook | Cuándo | Uso típico |
|------|--------|-----------|
| `onLoad(ModContext ctx)` | Al arrancar la JVM, antes de la ventana. | Registrar comandos, leer config, log. Aún no hay motor. |
| `onGameReady(ModContext ctx)` | El motor existe (`ctx.engine()` funciona); sin mundo todavía. | Registrar eventos del motor, recetas. |
| `onFrame(ModContext ctx)` | Cada fotograma, hilo principal, tras el HUD. | Dibujar HUD, leer teclas, lógica ligera. |
| `onShutdown(ModContext ctx)` | Al cerrar el juego. | Guardar estado. |

Todos son métodos `default`: implementa solo los que necesites. Las excepciones dentro de un hook se
registran en el log y no detienen el juego ni otros mods.

## `ModContext`

### Rutas y motor

| Método | Devuelve |
|--------|----------|
| `getGameDirectory()` | `Path` de la carpeta donde corre el juego (`Game/`). |
| `getInstanceDirectory()` | `Path` de `instance/` (mods, config, lang, resourcepacks, sounds, music). |
| `getConfigDirectory()` | `instance/config`. |
| `engine()` | `net.openvoxel.engine.VoxelEngine` o `null` antes de `onGameReady`. |
| `getEngine(Class<T>)` | Lo mismo, con cast. |
| `isInWorld()` | `true` mientras hay un mundo cargado (un jugador o servidor). |
| `getPlayerPosition()` | `org.joml.Vector3d` con la posición de los pies (copia) o `null` fuera de un mundo. |
| `getPlayerYaw()` / `getPlayerPitch()` | Ángulos de la cámara en grados. |

### Chat, log y sonido

| Método | Efecto |
|--------|--------|
| `log(String)` | Imprime `[ModLoader] …` en consola / log. |
| `chat(String)` | Añade una línea al chat. Colores: `&0`–`&f`, `&r`, `&#rrggbb`. |
| `playSound(String nombre)` | Reproduce un evento de sonido: `step`, `break`, `place`, `pickup`, `eat`, `pop`, `hurt`, `click`, o cualquier `instance/sounds/<nombre>.wav`. |

### Comandos, traducciones y ajustes

| Método | Efecto |
|--------|--------|
| `registerCommand(nombre, descripción, handler)` | Añade `/nombre`. `handler.run(String[] args)` recibe los argumentos. Sale en `/chelp` y se completa con Tab. |
| `translate(clave, args...)` | Busca la clave en el idioma actual, luego en inglés, luego devuelve la clave. `args` son parámetros de `String.format`. |
| `language()` | Código del idioma actual (`en_us`, `es_es`, …). |
| `config(modId)` | Un `ModConfig` guardado en `instance/config/<modId>.properties`. |

`ModConfig`: `get(clave, def)`, `getInt`, `getDouble`, `getBoolean`, `set(clave, valor)` (encadenable),
`remove`, `has`, `save()`, `getFile()`. También se guardan solos al cerrar el juego.

Traducciones: incluye `assets/<id>/lang/en_us.json` (y `es_es.json`, …) en el JAR. Claves planas;
los `%s` / `%d` funcionan con `translate`. El jugador puede sobrescribir claves con `instance/lang/<código>.json`.

### Modo de juego, objetos y recetas

| Método | Efecto |
|--------|--------|
| `isCreative()` / `isSurvival()` / `isFlying()` | Modo actual y estado de vuelo. |
| `giveItem(id, cantidad)` | Añade objetos a la hotbar/almacén. `id` es un id de objeto (`iron_sword`, `apple`, `stick`, `crafting_table`, …) o un nombre de bloque (`stone`, `oak_log`). Devuelve `false` si está lleno o no existe. |
| `getHeldItem()` | Id/nombre del slot seleccionado, o `null`. |
| `registerRecipe(idResultado, cantidad, patrón, claves...)` | Receta con forma. Las filas de `patrón` usan un carácter por celda (espacio = vacío); `claves` empareja caracteres con ids. Casa en cualquier posición y espejada, en la rejilla 2x2 si cabe, si no en la mesa. |
| `itemIds()` | Todos los ids de objetos conocidos. |

```java
ctx.registerRecipe("torch", 4, new String[]{"C", "S"}, "C", "coal", "S", "stick");
ctx.registerRecipe("diamond_sword", 1, new String[]{"D", "D", "S"}, "D", "diamond", "S", "stick");
```

Objetos incluidos: `wooden|stone|iron|golden|diamond` × `_sword|_pickaxe|_shovel|_axe`,
`leather|iron|golden|diamond` × `_helmet|_chestplate|_leggings|_boots`, `apple`, `golden_apple`,
`bread`, `cooked_beef`, `stick`, `coal`, `copper_ingot`, `iron_ingot`, `gold_ingot`, `diamond`,
`emerald`, `redstone`, `lapis`, `crafting_table`, `chest`, `bed`.

### Bloques nativos (desde la 1.1.0-pre3)

`ctx.nativeBlock("mimod:bloque_rubi")...register()` añade un **tipo de bloque real del motor** (registro al
estilo Fabric/Forge). Llámalo en `onLoad`. Ver [Bloques nativos](#/docs/native-blocks) y
[NativeBlocks.Builder](javadoc/client/com/happyuky7/openvoxelmoding/loader/NativeBlocks.Builder.html).

| Método | Efecto |
|--------|--------|
| `nativeBlock(id)` | Empieza la definición de un bloque; termina con `register()`. |
| `isServer()` | True cuando el mod corre dentro de un servidor dedicado mediante el agente ModLoader (allí solo se ejecuta `onLoad`). |

`registerRecipe` y `registerBlock` se pueden usar en `onLoad`: se aplican cuando el juego está listo, así
nunca cierran antes de tiempo el registro de bloques nativos.

### Bloques con id (desde la 1.1.0)

Los bloques del ModLoader tienen id con namespace como en Fabric/Minecraft: `modloader:chest`,
`modloader:crafting_table`, `modloader:bed`, `modloader:oak_planks`, y los tuyos, como `mimod:bloque_rubi`.

| Método | Efecto |
|--------|--------|
| `registerBlock(id, nombre, bloqueBase, textura)` | Registra un cubo con textura. `textura` es la ruta de un PNG 16x16 dentro de tu jar. |
| `registerBlock(id, nombre, bloqueBase, arriba, lado, abajo, onUse)` | Igual, con textura por cara y un handler de clic derecho `(x, y, z) -> boolean` (true consume el clic). |
| `blockIds()` | Todos los ids de bloques del ModLoader registrados. |
| `getBlockId(x, y, z)` | Id del bloque del ModLoader en esa posición, o `null` si es un bloque normal del motor. |

```java
@Override public void onLoad(ModContext ctx) {
    ctx.registerBlock("mimod:bloque_rubi", "Bloque de rubí", "STONE", "assets/mimod/textures/bloque_rubi.png");
    ctx.registerRecipe("mimod:bloque_rubi", 1, new String[]{"DD", "DD"}, "D", "redstone");
}
```

Cómo funciona: la lista de bloques del motor no se puede ampliar, así que un bloque de mod se guarda en el mundo
como un bloque real del motor (`bloqueBase`: colisión, tiempo de minado, luz) más una entrada del ModLoader con su
id. Las entradas se guardan **con el mundo** (`<mundo>/modloader/blocks.json`; en servidores en
`instance/config/servers/<host>/blocks.json`) y se cargan por id. Si falta un mod, sus bloques se omiten (no se
borran del archivo) y vuelven al reinstalarlo. El bloque recibe un objeto con el mismo id para `giveItem`, recetas
y el inventario creativo (pestaña Materiales). Ponle nombre en tus lang con `item.mimod.bloque_rubi`.

## Puntos de entrada del motor (la API del juego)

Todo el juego (`net.openvoxel.*`) está en el classpath. Clases más útiles:

| Clase | Uso |
|-------|-----|
| `VoxelEngine` | `getEngine()`, `isWorldActive()`, `getWorld()`, `getCamera()`, `getRenderer()`, `getLocalPlayer()`, `getEventManager()`, `sendChat(msg)`, `runOnMainThread(Runnable)`. |
| `Camera` | `getPosition()`, `getYaw()/getPitch()`, `getFacing()`, `getBlockInHand()`, `isThirdPerson()`, `getAspect()`. |
| `World` | `getBlock(x,y,z)`, `getState(x,y,z)`, `setBlock(x,y,z,AbstractBlock)`, `getChunks()`, `getSeed()`. |
| `BlockType` | enum de bloques: `BlockType.STONE`, `isSolid()`, `getId()`, `fromId(int)`; `BlockState.typeId(estado)`. |
| `GameEventManager` | `register(ClickEvent.class, e -> …)`; `ClickEvent` tiene `type` (LEFT/RIGHT/MIDDLE) y `worldX/Y/Z`. |
| `GLUIRenderer` | Dibujo 2D: `setup2DRendering(w,h)`, `drawPanel`, `drawRect`, `drawText`, `getTextWidth`, `drawTexture`, `restore3DRendering()`. |
| `UIManager` | `get().openGUI(gui)`, `closeTopGUI()`, `hasActiveGUIs()`, `getWindow()` (handle GLFW). |
| `ChatHud` | `addLine(texto)` (igual que `ctx.chat`). |
| `PlayerEntity` | `health`, `maxHealth`, `dead`, `username`, `position`. |
| `Texture` | `new Texture("textures/blocks/stone.png")` o `new Texture(byte[] png)`; `bind()`. |
| `org.lwjgl.glfw.GLFW` | teclado / ratón: `glfwGetKey(window, GLFW_KEY_X) == GLFW_PRESS`. |

Patrón para dibujar en el HUD (dentro de `onFrame`):

```java
int[] size = ctx.engine().getCamera().getAspect();
GLUIRenderer.setup2DRendering(size[0], size[1]);
try {
    GLUIRenderer.drawPanel(8, 8, 160, 40, 0f, 0f, 0f, 0.5f);
    GLUIRenderer.drawText("Hola", 16, 32, 1f, 1f, 1f, 1f);   // x, línea base y, r, g, b, a
} finally { GLUIRenderer.restore3DRendering(); }
```

Reglas: haz trabajo GL solo desde `onFrame` o `runOnMainThread`; nunca bloquees el hilo principal
(usa un hilo daemon para HTTP/IO y vuelve con `runOnMainThread`).
