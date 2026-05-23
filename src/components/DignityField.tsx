"use client";

import { useEffect, useRef } from "react";

/* ─── palette ─── */
const DIGNITY_COLORS = [
  { r: 233, g: 181, b: 78 },   // dignity-500 gold
  { r: 243, g: 201, b: 118 },  // dignity-400 warm gold
  { r: 250, g: 223, b: 166 },  // dignity-300 pale gold
];
const LIBERTY_COLORS = [
  { r: 116, g: 180, b: 246 },  // liberty-400 sky
  { r: 166, g: 208, b: 251 },  // liberty-300 pale sky
  { r: 79,  g: 156, b: 240 },  // liberty-500 deeper
];
const THREAD_COLOR = { r: 63, g: 196, b: 176 }; // justice-500 teal (threads)
const BG = "#070a12"; // void-950

const PARTICLE_COUNT = 110; // ~80–140 cap
const MAX_THREAD_DIST = 130;
const RIPPLE_INTERVAL_MS = 7200; // one ripple every ~7 s
const RIPPLE_MAX_RADIUS_FACTOR = 0.65; // fraction of diagonal

interface Pt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  colorGroup: "dignity" | "liberty";
  colorIdx: number;
}

interface Ripple {
  cx: number;
  cy: number;
  t: number; // current frame age 0→duration
  duration: number; // frames
  maxR: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function DignityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const ptsRef = useRef<Pt[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 1;
    let h = 1;

    function initParticles() {
      ptsRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.18;
        const isDignity = Math.random() < 0.55;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.4 + Math.random() * 1.8,
          opacity: 0.35 + Math.random() * 0.45,
          colorGroup: isDignity ? "dignity" : "liberty",
          colorIdx: Math.floor(
            Math.random() * (isDignity ? DIGNITY_COLORS.length : LIBERTY_COLORS.length)
          ),
        } satisfies Pt;
      });
    }

    function resize() {
      const parent = canvas!.parentElement;
      const dpr = window.devicePixelRatio || 1;
      w = parent ? parent.clientWidth : window.innerWidth;
      h = parent ? parent.clientHeight : window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.scale(dpr, dpr);
    }

    resize();
    initParticles();

    const ro = new ResizeObserver(() => {
      resize();
      // clamp particles
      ptsRef.current.forEach((p) => {
        p.x = Math.min(Math.max(p.x, 0), w);
        p.y = Math.min(Math.max(p.y, 0), h);
      });
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    else ro.observe(canvas);

    let frame = 0;

    function tick() {
      frame++;
      // clear
      ctx!.fillStyle = BG;
      ctx!.fillRect(0, 0, w, h);

      const now = performance.now();

      // spawn ripple periodically
      if (now - lastRippleRef.current > RIPPLE_INTERVAL_MS) {
        lastRippleRef.current = now;
        const diag = Math.hypot(w, h);
        ripplesRef.current.push({
          cx: w * (0.2 + Math.random() * 0.6),
          cy: h * (0.2 + Math.random() * 0.6),
          t: 0,
          duration: 220, // frames
          maxR: diag * RIPPLE_MAX_RADIUS_FACTOR,
        });
      }

      // update + draw ripples
      ripplesRef.current = ripplesRef.current.filter((rip) => rip.t <= rip.duration);
      ripplesRef.current.forEach((rip) => {
        const prog = rip.t / rip.duration;
        const r = rip.maxR * prog;
        const alpha = (1 - prog) * 0.07; // very faint
        ctx!.beginPath();
        ctx!.arc(rip.cx, rip.cy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(116,180,246,${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
        // second, slightly smaller ring
        if (r > 30) {
          const r2 = r * 0.72;
          const a2 = alpha * 0.6;
          ctx!.beginPath();
          ctx!.arc(rip.cx, rip.cy, r2, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(233,181,78,${a2})`;
          ctx!.lineWidth = 0.6;
          ctx!.stroke();
        }
        rip.t++;
      });

      // draw threads between nearby particles
      const pts = ptsRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          if (Math.abs(dx) > MAX_THREAD_DIST || Math.abs(dy) > MAX_THREAD_DIST) continue;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > MAX_THREAD_DIST) continue;
          const fade = 1 - d / MAX_THREAD_DIST;
          const alpha = fade * 0.055;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.strokeStyle = `rgba(${THREAD_COLOR.r},${THREAD_COLOR.g},${THREAD_COLOR.b},${alpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }

      // update + draw particles
      pts.forEach((p) => {
        // very slow drift with gentle Brownian nudge
        if (frame % 90 === 0) {
          const nudge = 0.012;
          p.vx += (Math.random() - 0.5) * nudge;
          p.vy += (Math.random() - 0.5) * nudge;
          // cap speed
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 0.28) {
            p.vx = (p.vx / spd) * 0.28;
            p.vy = (p.vy / spd) * 0.28;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // soft wrap (torus)
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;

        // pick colour
        const col =
          p.colorGroup === "dignity"
            ? DIGNITY_COLORS[p.colorIdx % DIGNITY_COLORS.length]
            : LIBERTY_COLORS[p.colorIdx % LIBERTY_COLORS.length];

        // gentle opacity breathe
        const breathe = Math.sin(frame * 0.01 + p.x * 0.02) * 0.07;
        const op = Math.max(0.1, Math.min(0.85, p.opacity + breathe));

        // halo glow
        const haloR = p.r * 4.5;
        const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        grd.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${op * 0.18})`);
        grd.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        ctx!.fillStyle = grd;
        ctx!.fill();

        // core dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${col.r},${col.g},${col.b},${op})`;
        ctx!.fill();
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
