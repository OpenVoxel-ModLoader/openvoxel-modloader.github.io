---
title: Tu primer mod en 5 minutos
summary: De una carpeta vacía a un comando /hello dentro del juego.
order: 1
---

# Tu primer mod

1. Copia `ModLoader-ModsExamples/hello-mod` a `ModLoader-ModsExamples/mi-mod`.
2. Edita `resources/openvoxel.mod.properties`:

```properties
id=mimod
name=Mi Mod
version=0.1.0
main=com.example.mimod.MiMod
```

3. Crea `src/com/example/mimod/MiMod.java`:

```java
package com.example.mimod;

import com.happyuky7.openvoxelmoding.loader.ClientMod;
import com.happyuky7.openvoxelmoding.loader.ModContext;

public final class MiMod implements ClientMod {
    @Override public void onLoad(ModContext ctx) {
        ctx.registerCommand("hello", "saluda", args -> ctx.chat("&a¡Hola desde Mi Mod!"));
    }
}
```

4. Cambia en `build.bat` el nombre del JAR a `mi-mod.jar`, ejecútalo y arranca el juego con
   `launch-client.bat`. Escribe `/hello` en el chat.

## Traducciones

Añade `resources/assets/mimod/lang/en_us.json` y `es_es.json`, y usa
`ctx.translate("mimod.hola")`. El idioma sigue el ajuste *Opciones → Idioma* del juego.
