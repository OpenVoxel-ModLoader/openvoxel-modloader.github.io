---
title: Drawing on the HUD
summary: Use onFrame and GLUIRenderer to draw panels, text and textures every frame.
order: 2
---

# Drawing on the HUD

`onFrame` runs on the main (OpenGL) thread after the game drew its own HUD. Set up 2D rendering,
draw, and always restore the 3D state in a `finally`.

```java
import com.happyuky7.openvoxelmoding.loader.*;
import net.openvoxel.engine.ui.GLUIRenderer;
import net.openvoxel.engine.ui.UIManager;
import org.joml.Vector3d;

public final class HudMod implements ClientMod {
    private long lastNs; private int frames, fps;

    @Override public void onFrame(ModContext ctx) {
        long now = System.nanoTime();
        if (++frames > 0 && now - lastNs >= 1_000_000_000L) { fps = frames; frames = 0; lastNs = now; }
        if (!ctx.isInWorld() || UIManager.get().hasActiveGUIs()) return;   // hide behind menus

        int[] size = ctx.engine().getCamera().getAspect();                  // window size in pixels
        Vector3d p = ctx.getPlayerPosition();
        String line = String.format("%d fps   X %.1f  Y %.1f  Z %.1f", fps, p.x, p.y, p.z);
        float w = GLUIRenderer.getTextWidth(line) + 16, x = size[0] - w - 8, y = 8;

        GLUIRenderer.setup2DRendering(size[0], size[1]);
        try {
            GLUIRenderer.drawPanel(x, y, w, 30, 0f, 0f, 0f, 0.45f);        // x, y, w, h, r, g, b, a
            GLUIRenderer.drawText(line, x + 8, y + 21, 1f, 1f, 0.6f, 1f);  // y is the text baseline
        } finally { GLUIRenderer.restore3DRendering(); }
    }
}
```

## Useful calls

| Call | Draws |
|------|-------|
| `drawPanel(x, y, w, h, r, g, b, a)` / `drawRect(...)` | Filled rectangle. |
| `drawBorder(x, y, w, h, lineWidth, r, g, b, a)` | Outline. |
| `drawGradientV(...)` / `drawGradientH(...)` | Vertical / horizontal gradient. |
| `drawText(text, x, baselineY, r, g, b, a)` | Text (18 px font). `getTextWidth(text)` and `getFontHeight()` help with layout. Color codes `&a` work. |
| `drawTexture(texture, x, y, w, h)` | A `Texture` (`new Texture("textures/blocks/stone.png")`, created once and reused). |
| `BlockIconRenderer.drawBlockIcon(BlockType, cx, cy, size)` | Isometric block icon. |

Coordinates are window pixels, origin top-left. Use `getAspect()` every frame: the window can be
resized.

## Keyboard & mouse

```java
long window = UIManager.get().getWindow();
boolean down = GLFW.glfwGetKey(window, GLFW.GLFW_KEY_H) == GLFW.GLFW_PRESS;   // detect the press edge yourself
```

Skip input while `UIManager.get().hasActiveGUIs()` is true (chat or menus are open).

## Performance

`onFrame` is called ~60 times per second: avoid allocations in loops, cache textures and strings,
and never do network or disk I/O there (use a daemon thread + `engine().runOnMainThread`).
