import { useEffect, useRef } from "react";

// Decorative contours. Content and controls live outside this canvas.
export function FieldMotion() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};

    async function mount() {
      const THREE = await import("three");
      if (disposed) return;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
      });
      if (!context) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      canvas.style.cssText = "display:block;width:100%;height:100%";
      element!.appendChild(canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
      camera.position.z = 1;
      const geometry = new THREE.PlaneGeometry(2, 2);
      const uniforms = {
        time: { value: 0 },
        aspect: { value: 1 },
        pointer: { value: new THREE.Vector2(0, 0) },
      };
      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms,
        vertexShader: `varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
          varying vec2 vUv;
          uniform float time;
          uniform float aspect;
          uniform vec2 pointer;
          void main() {
            vec2 p = vUv * vec2(aspect, 1.0) + pointer * 0.035;
            float terrain = p.y + sin(p.x * 2.6 + time * 0.12) * 0.19
              + cos(p.x * 5.0 - p.y * 2.0 + time * 0.09) * 0.065;
            float band = abs(fract(terrain * 16.0) - 0.5);
            float line = 1.0 - smoothstep(0.018, 0.052, band);
            float fade = smoothstep(0.18, 0.85, vUv.x);
            vec3 color = mix(vec3(0.39, 0.66, 0.43), vec3(0.87, 0.80, 0.47), vUv.y);
            gl_FragColor = vec4(color, line * fade * 0.42);
          }`,
      });
      scene.add(new THREE.Mesh(geometry, material));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      let visible = true;
      let frame = 0;
      let lastFrame = 0;

      function draw(now: number) {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        if (now - lastFrame >= 32 || reduced.matches) {
          if (!reduced.matches)
            uniforms.time.value += Math.min((now - lastFrame) / 1000, 0.05);
          lastFrame = now;
          renderer.render(scene, camera);
        }
        if (!reduced.matches) frame = requestAnimationFrame(draw);
      }
      function refresh() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      }
      const resize = new ResizeObserver(([entry]) => {
        if (!entry) return;
        const { width, height } = entry.contentRect;
        if (!width || !height) return;
        uniforms.aspect.value = width / height;
        renderer.setSize(width, height, false);
        refresh();
      });
      resize.observe(element!);
      const observer = new IntersectionObserver(([entry]) => {
        visible = !!entry?.isIntersecting;
        refresh();
      });
      observer.observe(element!);
      function pointer(event: PointerEvent) {
        if (reduced.matches || event.pointerType === "touch") return;
        const rect = element!.getBoundingClientRect();
        uniforms.pointer.value.set(
          (event.clientX - rect.left) / rect.width - 0.5,
          (event.clientY - rect.top) / rect.height - 0.5,
        );
      }
      const panel = element!.parentElement;
      panel?.addEventListener("pointermove", pointer);
      document.addEventListener("visibilitychange", refresh);
      reduced.addEventListener("change", refresh);
      const contextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frame);
        canvas.style.visibility = "hidden";
      };
      canvas.addEventListener("webglcontextlost", contextLost);
      cleanup = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        observer.disconnect();
        panel?.removeEventListener("pointermove", pointer);
        document.removeEventListener("visibilitychange", refresh);
        reduced.removeEventListener("change", refresh);
        canvas.removeEventListener("webglcontextlost", contextLost);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
      refresh();
    }
    // A solid background remains available when graphics cannot initialize.
    void mount().catch(() => cleanup());
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
