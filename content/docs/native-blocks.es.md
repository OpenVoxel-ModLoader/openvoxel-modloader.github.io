---
title: Bloques nativos (registro de bloques)
summary: Añade bloques reales del motor desde un mod, como en Fabric o Forge: texturas, luz, dureza, herramientas, multijugador.
order: 3
---

# Bloques nativos

Un **bloque nativo** es un tipo de bloque real de OpenVoxel añadido por tu mod. El juego lo trata igual
que a los suyos: renderizado e iluminación de chunks, colisión, minado, guardado, red, inventario creativo
e iconos. Es el equivalente al registro de bloques de Fabric o Forge.

> Disponible desde ModLoader **1.1.0-pre3** (en desarrollo). Todas las opciones en el [Javadoc → NativeBlocks](javadoc/client/com/happyuky7/openvoxelmoding/loader/NativeBlocks.html).

## Registrar un bloque

Registra los bloques en `onLoad`: el juego carga su lista de bloques justo después de los mods y desde
ese momento la lista queda cerrada.

```java
public final class MiMod implements ClientMod {
    @Override public void onLoad(ModContext ctx) {
        ctx.nativeBlock("mimod:bloque_rubi")
           .name("Bloque de rubí")
           .texture("assets/mimod/textures/bloque_rubi.png")
           .hardness(3f).tool("pickaxe", true)
           .register();

        ctx.nativeBlock("mimod:lampara")
           .name("Lámpara")
           .textures("assets/mimod/textures/lampara_arriba.png", "assets/mimod/textures/lampara_lado.png", null)
           .translucent().light(15)
           .register();

        ctx.registerRecipe("mimod:bloque_rubi", 1, new String[]{"RR", "RR"}, "R", "redstone");
    }
}
```

Pon las texturas PNG de 16x16 en tu jar (`src/main/resources/assets/mimod/textures/`).

| Método | Significado | Por defecto |
|--------|-------------|-------------|
| `name(String)` | Nombre de reserva (gana la clave de idioma `block.mimod.bloque_rubi`) | el id |
| `texture(ruta)` | Una textura para todas las caras | obligatorio |
| `textures(arriba, lado, abajo)` | Texturas por cara (`null` lado/abajo = arriba) | — |
| `solid(boolean)` | Choca con los jugadores | `true` |
| `light(0..15)` | Luz que emite (antorcha = 14) | 0 |
| `translucent()` | Como cristal: pasada translúcida, deja pasar la luz | opaco |
| `opacity(0..15)` | Luz que absorbe | 15 |
| `gravity()` | Cae como la arena | no |
| `hardness(segundos)` | Base del tiempo de rotura (piedra 1.5, tierra 0.5; 0 instantáneo, < 0 irrompible) | 1.5 |
| `tool(nombre, requerida)` | `pickaxe`, `shovel`, `axe`; `requerida` = solo suelta objeto con ella | ninguna |
| `hidden()` | No sale en el inventario creativo | visible |

El id sirve en todos los sitios que aceptan ids: `/give mimod:bloque_rubi 64`, `ctx.giveItem`, recetas,
autocompletado con Tab y `ctx.getHeldItem()`.

## Ids y guardado

Cada bloque recibe un id numérico entre 1024 y 4095 **derivado de su id con namespace**. El mismo mod en
cualquier ordenador obtiene el mismo número, así que mundos y servidores coinciden sin sincronizar un
registro. Los mundos guardan ese número: si quitas el mod, esos bloques se comportan como aire hasta que
lo vuelvas a instalar (el mundo conserva los datos).

## Multijugador

Para que un servidor dedicado conozca tus bloques:

1. Pon el **mismo jar del mod** en `ModLoader-Server/mods/` (plugins y mods comparten carpeta; solo los
   jars con `plugin.yml` se despliegan como plugins).
2. Pon el jar del cliente ModLoader en `ModLoader-Server/agent/` (el ZIP del servidor ya lo incluye).
3. Arranca con `start.bat` / `start.sh`. La consola muestra `ModLoader agent: ... (native blocks enabled)`
   y `native block mimod:bloque_rubi -> type id ...`.

En el servidor solo se ejecuta `onLoad` y `ctx.isServer()` es true; el chat, los sonidos, los comandos,
las recetas y los objetos se ignoran ahí, así que la misma clase del mod sirve en ambos lados. En un
jugador no hace falta nada más.

## Bloques ModLoader vs bloques nativos

| | Bloque nativo (`nativeBlock`) | Bloque ModLoader (`registerBlock`) |
|---|---|---|
| Tipo de bloque del motor | propio | guardado como bloque base + código |
| El servidor necesita | el mismo mod + el agente | nada (los servidores vanilla ven el bloque base) |
| Clic derecho | todavía no | `BlockUseHandler` |
| Úsalo para | materiales nuevos, decoración, fuentes de luz | bloques interactivos, servidores sin agente |
