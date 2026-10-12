---
title: Mod project structure & build
summary: Folder layout, properties file, resources, building with Gradle or plain javac.
order: 3
---

# Mod project structure & build

```
my-mod/
  build.gradle.kts                 (optional) Gradle build, see mod-template
  build.bat / build.sh             (optional) plain javac via ../common-build.*
  src/main/java/com/example/mymod/MyMod.java
  src/main/resources/
    openvoxel.mod.properties       required: id, name, version, main
    assets/mymod/lang/en_us.json   optional translations (one file per language code)
    assets/mymod/lang/es_es.json
```

Start from [`mod-template`](https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples/tree/master/mod-template)
in the examples repository.

## Compile-time dependencies

Nothing is published to Maven: a mod compiles against two local jars.

| Jar | Where to get it | Env var |
|-----|-----------------|---------|
| Game client `openvoxel-0.0.8-Debug.jar` | Downloaded by the official launcher (`Game/versions/0.0.8-Debug/`) or `https://open-voxel.net/jars/openvoxel-0.0.8-Debug.jar` | `OPENVOXEL_GAME_JAR` |
| Loader `ModLoader-v1.0.0-vgame-0.0.8-client.jar` | ModLoader-Client releases (or `ModLoader-Client/dist` after building) | `OPENVOXEL_MODLOADER_JAR` |

Target Java **11** (`--release 11`): the game ships its own JRE 11.

### Gradle

```kotlin
dependencies {
    compileOnly(files(System.getenv("OPENVOXEL_GAME_JAR")))
    compileOnly(files(System.getenv("OPENVOXEL_MODLOADER_JAR")))
}
tasks.withType<JavaCompile> { options.release.set(11) }
```

`gradle jar` produces `build/libs/<name>.jar`; copy it to `ModLoader-Client/instance/mods`.

### Plain javac

```
javac --release 11 -cp "$OPENVOXEL_GAME_JAR:$OPENVOXEL_MODLOADER_JAR" -d build $(find src -name '*.java')
cp -r src/main/resources/. build/
jar --create --file my-mod.jar -C build .
```

(`;` instead of `:` on Windows). The examples repo has `common-build.bat/.sh` doing exactly this.

## Loading & lifecycle

1. The launcher starts the game with `-javaagent:ModLoader-…-client.jar` (set by `launch.*`).
2. The agent scans `instance/mods/*.jar`, reads `openvoxel.mod.properties`, loads the `main`
   class with its own `URLClassLoader` (parent = game classpath) and calls `onLoad`.
3. Translations of every mod jar are indexed (`assets/<id>/lang/*.json`).
4. When the engine is created, `onGameReady` runs; then `onFrame` every frame.
5. On exit `onShutdown` runs and `ModConfig` files are saved.

Mods share one classloader parent, so a mod can depend on another's public classes if both
jars are present; keep package names unique.

## Testing quickly

- Put the jar in `instance/mods`, run `launch.bat`, open the chat and type `/chelp` to see
  your commands; `/lang es_es` switches language at runtime.
- Console output appears in the launcher's game console; `ctx.log` lines are prefixed `[ModLoader]`.
- Rebuild while the game is **closed** (Windows keeps the jar locked while it runs).
