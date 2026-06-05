"use client";

/**
 * GradientBackground — the "strips" looped gradient as a self-contained,
 * dependency-free React background layer (raw WebGL, ~3KB, no Three.js).
 *
 * Drop it in once, near the top of your layout/page, then put your content
 * on top as normal:
 *
 *   const gradient = useRef<GradientBackgroundHandle>(null);
 *   <GradientBackground ref={gradient} />
 *   <GradientSettings target={gradient} />
 *   <main style={{ position: "relative", zIndex: 10 }}> ...hero... </main>
 *
 * It renders a fixed, full-viewport canvas behind everything
 * (z-index:-1, pointer-events:none) and:
 *   - pauses when the tab is hidden or the canvas is scrolled off-screen
 *   - freezes motion for users with prefers-reduced-motion
 *   - caps devicePixelRatio at 2 and cleans up fully on unmount
 *
 * Look params are optional props for the INITIAL render (see DEFAULTS). For
 * LIVE changes (e.g. a settings panel), grab the ref and call
 * `ref.current.setConfig({ wave: 0.6, palette: [...] })` — this updates the
 * shader uniforms in place, with no WebGL teardown/rebuild.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { CSSProperties } from "react";

export interface GradientBackgroundProps {
  /** number of vertical strips */
  count?: number;
  /** gradient cycles per screen height */
  scale?: number;
  /** primary skyline wave amplitude */
  amp?: number;
  /** secondary skyline wave amplitude */
  amp2?: number;
  /** per-strip phase step (wave 1) */
  phase?: number;
  /** per-strip phase step (wave 2) */
  phase2?: number;
  /** base time frequency (seamless loop uses w and 2w) */
  wave?: number;
  /** film grain amount */
  grain?: number;
  /** mouse parallax strength (0 disables) */
  parallax?: number;
  /** cyclic palette, 6 hex stops top -> bottom (last loops to first) */
  palette?: string[];
  className?: string;
  style?: CSSProperties;
}

export type GradientConfig = Required<
  Omit<GradientBackgroundProps, "className" | "style">
>;

/** Imperative handle for live look changes (no WebGL rebuild). */
export interface GradientBackgroundHandle {
  setConfig: (partial: Partial<GradientConfig>) => void;
}

// --- default look (matches the strips lab "Periwinkle" preset) --------------
export const DEFAULTS: GradientConfig = {
  count: 6, // number of vertical strips
  scale: 1.19, // gradient cycles per screen height
  amp: 0.185, // primary skyline wave amplitude (align 0.5)
  amp2: 0.04, // secondary wave amplitude (align 0.5)
  phase: 1.67, // per-strip phase step (wave 1)
  phase2: 1.8, // per-strip phase step (wave 2)
  wave: 0.35, // base time frequency (seamless loop uses w and 2w)
  grain: 0.095, // film grain
  parallax: 0.04, // mouse parallax strength (0 disables)
  // cyclic palette, one period top -> bottom (last stop loops to the first)
  palette: [
    "#aecbf5", // top light periwinkle
    "#c2cbf1", // blue-lavender
    "#d2c9ec", // lavender
    "#e2d4e8", // pale lavender-pink
    "#ead9e6", // palest pink
    "#6f86dd", // deep periwinkle (bottom) -> loops to top
  ],
};

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Ported verbatim from the strips fragment shader.
const FRAG = `
precision highp float;
varying vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uMouse;

uniform float uCount;
uniform float uScale;
uniform float uAmp;
uniform float uAmp2;
uniform float uPhase;
uniform float uPhase2;
uniform float uWave;
uniform float uGrain;
uniform float uParallax;

uniform vec3 uP0;
uniform vec3 uP1;
uniform vec3 uP2;
uniform vec3 uP3;
uniform vec3 uP4;
uniform vec3 uP5;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 palette(float t) {
  t = fract(t);
  vec3 c = mix(uP0, uP1, smoothstep(0.00, 0.14, t));
  c = mix(c, uP2, smoothstep(0.14, 0.38, t));
  c = mix(c, uP3, smoothstep(0.38, 0.56, t));
  c = mix(c, uP4, smoothstep(0.56, 0.72, t));
  c = mix(c, uP5, smoothstep(0.72, 0.86, t));
  c = mix(c, uP0, smoothstep(0.86, 1.00, t));
  return c;
}

void main() {
  vec2 uv = vUv;
  float strip = floor(uv.x * uCount);
  float t = uTime;

  float off = uAmp * sin(strip * uPhase + t * uWave)
            + uAmp2 * sin(strip * uPhase2 - t * 2.0 * uWave);

  off += uMouse.y * uParallax;

  float vy = (1.0 - uv.y) * uScale + off;
  vec3 col = palette(vy);

  float g = hash(gl_FragCoord.xy + fract(uTime) * 57.0) - 0.5;
  col += g * uGrain;

  vec2 c = uv - 0.5;
  col *= 1.0 - 0.10 * dot(c, c);

  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || "shader compile failed");
  }
  return sh;
}

const GradientBackground = forwardRef<
  GradientBackgroundHandle,
  GradientBackgroundProps
>(function GradientBackground({ className, style, ...overrides }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // live look config — initialized once, then mutated in place via setConfig.
  const cfgRef = useRef<GradientConfig>({ ...DEFAULTS, ...overrides });
  // exposed by the running effect so the imperative handle can push updates.
  const applyRef = useRef<((c: GradientConfig) => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setConfig(partial) {
        Object.assign(cfgRef.current, partial);
        applyRef.current?.(cfgRef.current);
      },
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return; // no WebGL: page just shows the CSS background fallback

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // two triangles covering the clip-space quad
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(program, n);
    const u = {
      res: U("uResolution"),
      time: U("uTime"),
      mouse: U("uMouse"),
      count: U("uCount"),
      scale: U("uScale"),
      amp: U("uAmp"),
      amp2: U("uAmp2"),
      phase: U("uPhase"),
      phase2: U("uPhase2"),
      wave: U("uWave"),
      grain: U("uGrain"),
      parallax: U("uParallax"),
      p: [0, 1, 2, 3, 4, 5].map((i) => U("uP" + i)),
    };

    // push the full look to the shader — called once at init and again on every
    // live setConfig(). (uWave is uploaded here so time-based motion actually
    // runs and the Speed control has something to drive.)
    const apply = (c: GradientConfig) => {
      gl.uniform1f(u.count, Math.round(c.count));
      gl.uniform1f(u.scale, c.scale);
      gl.uniform1f(u.amp, c.amp);
      gl.uniform1f(u.amp2, c.amp2);
      gl.uniform1f(u.phase, c.phase);
      gl.uniform1f(u.phase2, c.phase2);
      gl.uniform1f(u.wave, c.wave);
      gl.uniform1f(u.grain, c.grain);
      gl.uniform1f(u.parallax, c.parallax);
      c.palette
        .slice(0, 6)
        .forEach((hex, i) => gl.uniform3fv(u.p[i], hexToRgb(hex)));
    };
    apply(cfgRef.current);
    applyRef.current = apply;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    const onMotion = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };
    motionQuery.addEventListener("change", onMotion);

    // mouse parallax (smoothed). Listener is always attached so parallax can be
    // toggled live; the uParallax uniform is 0 when disabled, so it costs nothing.
    const target: [number, number] = [0, 0];
    const mouse: [number, number] = [0, 0];
    const onPointer = (e: PointerEvent) => {
      target[0] = (e.clientX / window.innerWidth) * 2 - 1;
      target[1] = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(u.res, w, h);
      }
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // --- run loop with pausing ----------------------------------------------
    let raf = 0;
    let simTime = 0;
    let last = performance.now();
    let onScreen = true;
    let visible = !document.hidden;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) simTime += dt;
      mouse[0] += (target[0] - mouse[0]) * 0.05;
      mouse[1] += (target[1] - mouse[1]) * 0.05;
      gl!.uniform1f(u.time, simTime);
      gl!.uniform2f(u.mouse, mouse[0], mouse[1]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    function start() {
      if (raf || !onScreen || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    const onVisibility = () => {
      visible = !document.hidden;
      visible ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? start() : stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    start();

    return () => {
      stop();
      applyRef.current = null;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointer);
      // Free GPU resources WITHOUT destroying the context. Calling
      // loseContext() here poisons the <canvas> for the React StrictMode dev
      // remount: getContext() then returns the already-lost context, so the
      // next compileShader fails with an empty info log ("shader compile
      // failed"). Deleting the program/buffer is enough; the context is reused
      // cleanly on remount and reclaimed by the browser when the canvas unmounts.
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
    // Mount-once: initial look comes from cfgRef; live changes flow through the
    // imperative handle, so we deliberately do not re-init on prop changes.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        display: "block",
        pointerEvents: "none",
        background: cfgRef.current.palette[0], // paint before WebGL is ready
        ...style,
      }}
    />
  );
});

export default GradientBackground;
