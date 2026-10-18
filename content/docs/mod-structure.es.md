---
title: Estructura y compilación de un mod
summary: Carpetas, archivo de propiedades, recursos, compilar con Gradle o javac.
order: 4
---

# Estructura y compilación de un mod

```
mi-mod/
  build.gradle.kts                 (opcional) build de Gradle, ver mod-template
  build.bat / build.sh             (opcional) javac directo vía ../common-build.*
  src/main/java/com/example/mimod/MiMod.java
  src/main/resources/
    openvoxel.mod.properties       obligatorio: id, name, version, main
    assets/mimod/lang/en_us.json   traducciones opcionales (un archivo por idioma)
    assets/mimod/lang/es_es.json
```

Empieza por [`mod-template`](https://github.com/OpenVoxel-ModLoader/ModLoader-ModsExamples/tree/master/mod-template)
del repositorio de ejemplos.

## Dependencias de compilación

No hay nada publicado en Maven: un mod compila contra dos jars locales.

| Jar | De dónde | Variable |
|-----|----------|----------|
| Cliente `openvoxel-0.0.8-Debug.jar` | Lo descarga el launcher oficial (`Game/versions/0.0.8-Debug/`) o `https://open-voxel.net/jars/openvoxel-0.0.8-Debug.jar` | `OPENVOXEL_GAME_JAR` |
| Loader `ModLoader-v1.0.0-vgame-0.0.8-client.jar` | Releases de ModLoader-Client (o `ModLoader-Client/dist` tras compilar) | `OPENVOXEL_MODLOADER_JAR` |

Compila para Java **11** (`--release 11`): el juego trae su propio JRE 11.

### Gradle

```kotlin
dependencies {
    compileOnly(files(System.getenv("OPENVOXEL_GAME_JAR")))
    compileOnly(files(System.getenv("OPENVOXEL_MODLOADER_JAR")))
}
tasks.withType<JavaCompile> { options.release.set(11) }
```

`gradle jar` genera `build/libs/<nombre>.jar`; cópialo a `ModLoader-Client/instance/mods`.

### javac directo

```
javac --release 11 -cp "$OPENVOXEL_GAME_JAR:$OPENVOXEL_MODLOADER_JAR" -d build $(find src -name '*.java')
cp -r src/main/resources/. build/
jar --create --file mi-mod.jar -C build .
```

(`;` en vez de `:` en Windows). El repo de ejemplos trae `common-build.bat/.sh` que hace justo esto.

## Carga y ciclo de vida

1. El launcher arranca el juego con `-javaagent:ModLoader-…-client.jar` (lo pone `launch.*`).
2. El agente recorre `instance/mods/*.jar`, lee `openvoxel.mod.properties`, carga la clase `main`
   con su propio `URLClassLoader` (padre = classpath del juego) y llama a `onLoad`.
3. Se indexan las traducciones de cada jar (`assets/<id>/lang/*.json`).
4. Cuando se crea el motor corre `onGameReady`; después `onFrame` cada fotograma.
5. Al salir corre `onShutdown` y se guardan los `ModConfig`.

Los mods comparten el mismo classloader padre, así que un mod puede usar clases públicas de otro si
ambos jars están presentes; usa nombres de paquete únicos.

## Probar rápido

- Pon el jar en `instance/mods`, ejecuta `launch.bat`, abre el chat y escribe `/chelp` para ver tus
  comandos; `/lang es_es` cambia el idioma en caliente.
- La salida de consola aparece en la consola del launcher; las líneas de `ctx.log` llevan `[ModLoader]`.
- Recompila con el juego **cerrado** (Windows bloquea el jar mientras corre).
