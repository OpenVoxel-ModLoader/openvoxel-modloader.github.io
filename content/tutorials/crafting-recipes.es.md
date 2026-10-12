---
title: Recetas, objetos y comandos
summary: Registrar recetas, dar objetos, comandos con argumentos y ajustes persistentes.
order: 4
---

# Recetas, objetos y comandos

## Recetas con forma

```java
@Override public void onGameReady(ModContext ctx) {
    // 4 antorchas con carbón sobre un palo (cabe en la rejilla 2x2 del inventario)
    ctx.registerRecipe("torch", 4, new String[]{"C", "S"}, "C", "coal", "S", "stick");
    // un anillo de troncos necesita la mesa 3x3
    ctx.registerRecipe("chest", 1, new String[]{"LLL", "L L", "LLL"}, "L", "oak_log");
    // objetos y bloques mezclados
    ctx.registerRecipe("golden_apple", 1, new String[]{"GGG", "GAG", "GGG"}, "G", "gold_ingot", "A", "apple");
}
```

- Las filas pueden tener distinta longitud; un espacio es una celda vacía.
- La receta casa en cualquier posición y espejada horizontalmente.
- Ids: ids de objeto (`stick`, `iron_ingot`, `diamond_sword`, …) o nombres de bloque en cualquier caja (`oak_log`, `STONE`).
- Devuelve `false` (y no registra nada) si algún id no existe.

## Dar objetos

```java
ctx.giveItem("diamond_pickaxe", 1);
ctx.giveItem("stone", 64);
String held = ctx.getHeldItem();        // "stone", "apple" o null
```

Se apilan con los existentes (máx. 64) y pasan a las filas de almacén si la hotbar está llena.

## Comandos con argumentos

```java
ctx.registerCommand("give2", "<id> [cantidad] - da objetos", args -> {
    if (args.length == 0) { ctx.chat("&cUso: /give2 <id> [cantidad]"); return; }
    int count = 1;
    if (args.length > 1) try { count = Integer.parseInt(args[1]); } catch (NumberFormatException ignored) { }
    if (!ctx.giveItem(args[0], count)) ctx.chat("&cObjeto desconocido o inventario lleno: " + args[0]);
});
```

Todo lo que sigue al nombre del comando se separa por espacios en `args`. Los comandos no distinguen
mayúsculas y salen en `/chelp`; los `/comandos` desconocidos se reenvían al servidor.

## Ajustes persistentes

```java
ModConfig cfg = ctx.config("mimod");
boolean enabled = cfg.getBoolean("hud.enabled", true);
cfg.set("hud.enabled", !enabled).save();
```

El archivo es `instance/config/mimod.properties`; las claves son texto libre.

## Sonidos

`ctx.playSound("pop")` reproduce un evento incluido o sintetizado; el jugador puede sustituir cualquiera
poniendo `instance/sounds/<nombre>.wav` (PCM 16 bits). Tu mod puede traer sonidos extra escribiendo WAVs en
esa carpeta desde `onLoad` (comprueba antes `Files.exists`).
