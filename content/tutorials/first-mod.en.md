---
title: Your first mod in 5 minutes
summary: From an empty folder to a /hello command in the game.
order: 1
---

# Your first mod

1. Copy `ModLoader-ModsExamples/hello-mod` to `ModLoader-ModsExamples/my-mod`.
2. Edit `resources/openvoxel.mod.properties`:

```properties
id=mymod
name=My Mod
version=0.1.0
main=com.example.mymod.MyMod
```

3. Create `src/com/example/mymod/MyMod.java`:

```java
package com.example.mymod;

import com.happyuky7.openvoxelmoding.loader.ClientMod;
import com.happyuky7.openvoxelmoding.loader.ModContext;

public final class MyMod implements ClientMod {
    @Override public void onLoad(ModContext ctx) {
        ctx.registerCommand("hello", "says hi", args -> ctx.chat("&aHi from My Mod!"));
    }
}
```

4. Edit `build.bat` so the JAR name is `my-mod.jar`, run it, and start the game with
   `launch-client.bat`. Type `/hello` in chat.

## Translations

Add `resources/assets/mymod/lang/en_us.json` and `es_es.json`, then call
`ctx.translate("mymod.hello")`. The language follows the game's *Options → Language*.
