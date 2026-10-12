---
title: Dibujar en el HUD
summary: Usa onFrame y GLUIRenderer para dibujar paneles, texto y texturas cada fotograma.
order: 2
---

# Dibujar en el HUD

`onFrame` corre en el hilo principal (OpenGL) después de que el juego dibuje su HUD. Activa el
renderizado 2D, dibuja y restaura siempre el estado 3D en un `finally`.

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
        if (!ctx.isInWorld() || UIManager.get().hasActiveGUIs()) return;   // ocultar tras los menús

        int[] size = ctx.engine().getCamera().getAspect();                  // tamaño de ventana en píxeles
        Vector3d p = ctx.getPlayerPosition();
        String line = String.format("%d fps   X %.1f  Y %.1f  Z %.1f", fps, p.x, p.y, p.z);
        float w = GLUIRenderer.getTextWidth(line) + 16, x = size[0] - w - 8, y = 8;

        GLUIRenderer.setup2DRendering(size[0], size[1]);
        try {
            GLUIRenderer.drawPanel(x, y, w, 30, 0f, 0f, 0f, 0.45f);        // x, y, w, h, r, g, b, a
            GLUIRenderer.drawText(line, x + 8, y + 21, 1f, 1f, 0.6f, 1f);  // y es la línea base del texto
        } finally { GLUIRenderer.restore3DRendering(); }
    }
}
```

## Llamadas útiles

| Llamada | Dibuja |
|---------|--------|
| `drawPanel(x, y, w, h, r, g, b, a)` / `drawRect(...)` | Rectángulo relleno. |
| `drawBorder(x, y, w, h, grosor, r, g, b, a)` | Contorno. |
| `drawGradientV(...)` / `drawGradientH(...)` | Degradado vertical / horizontal. |
| `drawText(texto, x, lineaBaseY, r, g, b, a)` | Texto (fuente de 18 px). `getTextWidth(texto)` y `getFontHeight()` ayudan a maquetar. Los códigos `&a` funcionan. |
| `drawTexture(textura, x, y, w, h)` | Una `Texture` (`new Texture("textures/blocks/stone.png")`, créala una vez y reutilízala). |
| `BlockIconRenderer.drawBlockIcon(BlockType, cx, cy, tamaño)` | Icono isométrico de bloque. |

Las coordenadas son píxeles de ventana con origen arriba-izquierda. Usa `getAspect()` cada fotograma:
la ventana puede cambiar de tamaño.

## Teclado y ratón

```java
long window = UIManager.get().getWindow();
boolean down = GLFW.glfwGetKey(window, GLFW.GLFW_KEY_H) == GLFW.GLFW_PRESS;   // detecta tú el flanco de pulsación
```

Ignora la entrada mientras `UIManager.get().hasActiveGUIs()` sea true (chat o menús abiertos).

## Rendimiento

`onFrame` se llama ~60 veces por segundo: evita asignaciones en bucles, cachea texturas y strings y
nunca hagas red o disco ahí (usa un hilo daemon + `engine().runOnMainThread`).
