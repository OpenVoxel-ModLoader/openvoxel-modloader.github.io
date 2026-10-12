---
title: Recipes, items and commands
summary: Register crafting recipes, give items, build commands with arguments and persist settings.
order: 4
---

# Recipes, items and commands

## Shaped recipes

```java
@Override public void onGameReady(ModContext ctx) {
    // 4 torches from coal over a stick (fits the 2x2 inventory grid)
    ctx.registerRecipe("torch", 4, new String[]{"C", "S"}, "C", "coal", "S", "stick");
    // a chest ring needs the 3x3 crafting table
    ctx.registerRecipe("chest", 1, new String[]{"LLL", "L L", "LLL"}, "L", "oak_log");
    // mixed items and blocks
    ctx.registerRecipe("golden_apple", 1, new String[]{"GGG", "GAG", "GGG"}, "G", "gold_ingot", "A", "apple");
}
```

- Pattern rows may have different lengths; a space is an empty cell.
- The recipe matches at any offset and mirrored horizontally.
- Ids: item ids (`stick`, `iron_ingot`, `diamond_sword`, …) or block names in any case (`oak_log`, `STONE`).
- Returns `false` (and registers nothing) if an id is unknown.

## Giving items

```java
ctx.giveItem("diamond_pickaxe", 1);
ctx.giveItem("stone", 64);
String held = ctx.getHeldItem();        // "stone", "apple", or null
```

Items stack with existing ones (max 64) and fall back to the storage rows when the hotbar is full.

## Commands with arguments

```java
ctx.registerCommand("give2", "<id> [count] - gives items", args -> {
    if (args.length == 0) { ctx.chat("&cUsage: /give2 <id> [count]"); return; }
    int count = 1;
    if (args.length > 1) try { count = Integer.parseInt(args[1]); } catch (NumberFormatException ignored) { }
    if (!ctx.giveItem(args[0], count)) ctx.chat("&cUnknown item or inventory full: " + args[0]);
});
```

Everything after the command name is split on spaces into `args`. Commands are matched case-insensitively
and listed by `/chelp`; unknown `/commands` are forwarded to the server.

## Persistent settings

```java
ModConfig cfg = ctx.config("mymod");
boolean enabled = cfg.getBoolean("hud.enabled", true);
cfg.set("hud.enabled", !enabled).save();
```

The file is `instance/config/mymod.properties`; keys are free-form strings.

## Sounds

`ctx.playSound("pop")` plays a built-in or synthesized event; players can override any event by placing
`instance/sounds/<name>.wav` (16-bit PCM). Your mod may ship extra sounds by writing WAVs into that folder
from `onLoad` (check `Files.exists` first).
