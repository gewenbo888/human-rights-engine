"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { MORAL_CIRCLE, Ring } from "./content";

const STATUS_COLOR: Record<Ring["status"], { fill: string; stroke: string; label: string; labelZh: string }> = {
  won:       { fill: "#4f9cf022", stroke: "#4f9cf0", label: "Recognised",  labelZh: "已承认" },
  contested: { fill: "#e9b54e22", stroke: "#e9b54e", label: "Contested",   labelZh: "争议中" },
  frontier:  { fill: "#3fc4b011", stroke: "#3fc4b0", label: "Frontier",    labelZh: "前沿" },
};

const RING_COUNT = MORAL_CIRCLE.length; // 8

// Geometry constants
const CX = 340;
const CY = 310;
const INNER_R = 38;
const RING_GAP = 38;
const ringR = (i: number) => INNER_R + (i + 1) * RING_GAP;

// Label angles — distribute labels avoiding overlap
const LABEL_ANGLES: number[] = [270, 315, 45, 90, 200, 250, 160, 130];

export default function MoralCircle() {
  const { lang } = useLang();
  const [active, setActive] = useState(RING_COUNT); // how many rings are "recognized"
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const pulseRef = useRef(0);

  // Animate pulsing boundary
  useEffect(() => {
    let frame: number;
    const tick = (t: number) => {
      pulseRef.current = t;
      // force re-render via a state tick is too heavy; we update SVG directly
      const svg = svgRef.current;
      if (!svg) { frame = requestAnimationFrame(tick); return; }

      const pulse = Math.sin(t * 0.002) * 0.5 + 0.5; // 0–1

      // animate contested rings
      MORAL_CIRCLE.forEach((ring, i) => {
        if (ring.status !== "contested") return;
        const el = svg.querySelector<SVGCircleElement>(`#ring-boundary-${i}`);
        if (!el) return;
        const opacity = i < active ? (0.5 + pulse * 0.5) : 0.12;
        el.style.opacity = String(opacity);
      });

      // animate the active boundary glow ring
      const glow = svg.querySelector<SVGCircleElement>("#active-glow");
      if (glow) {
        const r = ringR(active - 1);
        glow.setAttribute("r", String(r + 2 + pulse * 4));
        glow.style.opacity = active > 0 ? String(0.3 + pulse * 0.3) : "0";
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    animRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const displayRing = hovered !== null ? hovered : selected;
  const info = displayRing !== null ? MORAL_CIRCLE[displayRing] : null;

  const handleRingClick = useCallback((i: number) => {
    setSelected(prev => prev === i ? null : i);
  }, []);

  const svgW = 680;
  const svgH = 560;

  return (
    <div className="w-full" style={{ maxWidth: 860 }}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <h3 className="display text-lg text-bone-100">
          <T v={{ en: "The Moral Circle", zh: "道德之圆" }} />
        </h3>
        <span className="label-mono text-bone-500 text-xs">
          <T v={{ en: "Who counts as a rights-bearing being?", zh: "谁算作拥有权利的存在？" }} />
        </span>
      </div>

      {/* Slider control */}
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="label-mono text-bone-500 text-[0.68rem] shrink-0">
            <T v={{ en: "How wide is the circle?", zh: "这个圆有多宽？" }} />
          </span>
          <input
            type="range"
            min={1}
            max={RING_COUNT}
            value={active}
            onChange={e => setActive(Number(e.target.value))}
            className="flex-1 accent-liberty-500"
            style={{ cursor: "pointer" }}
            aria-label={lang === "zh" ? "扩展道德圆" : "Expand moral circle"}
          />
          <span className="label-mono text-liberty-400 text-[0.68rem] w-28 text-right shrink-0">
            {active}/{RING_COUNT} <T v={{ en: "rings", zh: "层" }} />
          </span>
        </div>
        <p className="label-mono text-bone-500 text-[0.62rem] leading-relaxed max-w-xl">
          <T v={{
            en: "Slide to expand or contract the recognized circle. Rings beyond your threshold fade — showing who has historically been left outside.",
            zh: "拖动以扩大或收缩被承认的圆。超出你的阈值的环变淡——显示历史上谁被留在圆外。",
          }} />
        </p>
      </div>

      {/* Main layout: SVG + info panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* SVG */}
        <div className="shrink-0 w-full lg:w-auto flex justify-center">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            width="100%"
            style={{ maxWidth: svgW, display: "block" }}
            aria-label={lang === "zh" ? "同心圆：道德之圆" : "Concentric rings: the moral circle"}
          >
            {/* Background void */}
            <rect width={svgW} height={svgH} fill="#070a12" />

            {/* Subtle radial gradient atmosphere */}
            <defs>
              <radialGradient id="mc-atmos" cx="50%" cy="56%" r="55%">
                <stop offset="0%" stopColor="#e9b54e" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#070a12" stopOpacity="0" />
              </radialGradient>
              <filter id="mc-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="mc-softglow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx={CX} cy={CY} r={ringR(RING_COUNT - 1) + 30} fill="url(#mc-atmos)" />

            {/* Rings — outermost first so inner ones render on top */}
            {[...MORAL_CIRCLE].reverse().map((ring, revI) => {
              const i = RING_COUNT - 1 - revI;
              const r = ringR(i);
              const isActive = i < active;
              const col = STATUS_COLOR[ring.status];
              const isHighlighted = displayRing === i;

              return (
                <g key={ring.id}>
                  {/* Fill */}
                  <circle
                    cx={CX} cy={CY} r={r}
                    fill={isActive ? col.fill : "#070a12"}
                    style={{ transition: "fill 0.4s ease" }}
                  />
                  {/* Boundary ring */}
                  <circle
                    id={`ring-boundary-${i}`}
                    cx={CX} cy={CY} r={r}
                    fill="none"
                    stroke={col.stroke}
                    strokeWidth={isHighlighted ? 2.2 : 1.1}
                    strokeDasharray={ring.status === "frontier" ? "6 5" : ring.status === "contested" ? "10 3" : "none"}
                    opacity={isActive ? (ring.status === "won" ? 0.7 : 0.55) : 0.12}
                    style={{ transition: "opacity 0.4s ease, stroke-width 0.2s" }}
                  />
                  {/* Clickable hit area */}
                  <circle
                    cx={CX} cy={CY} r={r}
                    fill="transparent"
                    stroke="none"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRingClick(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    role="button"
                    aria-label={t(ring.label, lang)}
                  />
                </g>
              );
            })}

            {/* Active boundary glow pulse */}
            {active > 0 && (
              <circle
                id="active-glow"
                cx={CX} cy={CY}
                r={ringR(active - 1) + 2}
                fill="none"
                stroke="#4f9cf0"
                strokeWidth={3}
                opacity={0.4}
                filter="url(#mc-softglow)"
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Inactive zone indicator */}
            {active < RING_COUNT && (
              <circle
                cx={CX} cy={CY}
                r={ringR(RING_COUNT - 1) - 2}
                fill="none"
                stroke="#7f8db0"
                strokeWidth={0.5}
                strokeDasharray="2 4"
                opacity={0.18}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Gold core */}
            <circle cx={CX} cy={CY} r={INNER_R} fill="#e9b54e18" stroke="#e9b54e" strokeWidth={1.5} opacity={0.9} />
            <circle cx={CX} cy={CY} r={INNER_R * 0.55} fill="#e9b54e" opacity={0.85} filter="url(#mc-glow)" />

            {/* Core label */}
            <text x={CX} y={CY - 6} textAnchor="middle" fill="#fadfa6" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600" opacity={0.9}>
              {lang === "zh" ? "自身" : "SELF"}
            </text>
            <text x={CX} y={CY + 6} textAnchor="middle" fill="#fadfa6" fontSize="8" fontFamily="IBM Plex Mono, monospace" opacity={0.7}>
              {lang === "zh" ? "血亲" : "& KIN"}
            </text>

            {/* Ring labels (skip innermost = ring 0, handled by core above) */}
            {MORAL_CIRCLE.slice(1).map((ring, si) => {
              const i = si + 1;
              const r = ringR(i);
              const angleDeg = LABEL_ANGLES[i] ?? (270 + i * 40);
              const angleRad = (angleDeg * Math.PI) / 180;
              const lx = CX + (r - 14) * Math.cos(angleRad);
              const ly = CY + (r - 14) * Math.sin(angleRad);
              const isActive = i < active;
              const col = STATUS_COLOR[ring.status];
              const isHighlighted = displayRing === i;

              return (
                <text
                  key={ring.id}
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={col.stroke}
                  fontSize={isHighlighted ? 9.5 : 8.5}
                  fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "IBM Plex Mono, monospace"}
                  fontWeight={isHighlighted ? "700" : "500"}
                  opacity={isActive ? (isHighlighted ? 1 : 0.75) : 0.22}
                  style={{ transition: "opacity 0.4s ease, font-size 0.2s", pointerEvents: "none", userSelect: "none" }}
                >
                  {t(ring.label, lang)}
                </text>
              );
            })}

            {/* Expanding boundary label */}
            {active > 0 && active <= RING_COUNT && (
              <g style={{ pointerEvents: "none" }}>
                <text
                  x={CX + ringR(active - 1) + 8}
                  y={CY - ringR(active - 1) * 0.2}
                  fill="#4f9cf0"
                  fontSize={7.5}
                  fontFamily="IBM Plex Mono, monospace"
                  opacity={0.7}
                >
                  ← {lang === "zh" ? "当前边界" : "current boundary"}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Legend */}
          <div className="card p-3 flex flex-col gap-2">
            <p className="label-mono text-bone-500 text-[0.6rem] uppercase tracking-widest mb-1">
              <T v={{ en: "Status", zh: "状态" }} />
            </p>
            {(["won", "contested", "frontier"] as Ring["status"][]).map(s => {
              const col = STATUS_COLOR[s];
              return (
                <div key={s} className="flex items-center gap-2">
                  <svg width={24} height={12}>
                    <line
                      x1={0} y1={6} x2={24} y2={6}
                      stroke={col.stroke}
                      strokeWidth={s === "won" ? 2 : 1.5}
                      strokeDasharray={s === "frontier" ? "4 3" : s === "contested" ? "7 2" : "none"}
                      opacity={0.9}
                    />
                  </svg>
                  <span className="label-mono text-[0.62rem]" style={{ color: col.stroke }}>
                    {lang === "zh" ? col.labelZh : col.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Ring info */}
          <div className="card p-4 flex-1 min-h-[160px]">
            {info ? (
              <div key={info.id} className="lang-fade">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-bone-100 font-semibold text-sm leading-tight" style={{
                    fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
                  }}>
                    {t(info.label, lang)}
                  </h4>
                  <span
                    className="label-mono text-[0.58rem] px-1.5 py-0.5 rounded-sm border shrink-0"
                    style={{ color: STATUS_COLOR[info.status].stroke, borderColor: STATUS_COLOR[info.status].stroke + "55" }}
                  >
                    {lang === "zh" ? STATUS_COLOR[info.status].labelZh : STATUS_COLOR[info.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="label-mono text-bone-500 text-[0.6rem]">
                    <T v={{ en: "Recognized:", zh: "承认时间：" }} />
                  </span>
                  <span className="label-mono text-dignity-400 text-[0.62rem]">
                    {t(info.recognized, lang)}
                  </span>
                </div>
                <p className="text-bone-300 text-xs leading-relaxed" style={{
                  fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
                }}>
                  {t(info.note, lang)}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center gap-2 opacity-40">
                <svg width={28} height={28} viewBox="0 0 28 28">
                  <circle cx={14} cy={14} r={11} fill="none" stroke="#4f9cf0" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={14} cy={14} r={6}  fill="none" stroke="#e9b54e" strokeWidth={1} />
                  <circle cx={14} cy={14} r={2}  fill="#e9b54e" opacity={0.7} />
                </svg>
                <p className="label-mono text-bone-500 text-[0.62rem] text-center">
                  <T v={{ en: "Click or hover a ring to explore", zh: "点击或悬停某环以探索" }} />
                </p>
              </div>
            )}
          </div>

          {/* Contextual thesis */}
          <div className="card p-3 border-l-2" style={{ borderLeftColor: "#4f9cf055" }}>
            <p className="text-bone-400 text-[0.7rem] leading-relaxed italic" style={{
              fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
            }}>
              <T v={{
                en: "Moral progress, measured as the expanding set of beings whose suffering is allowed to count.",
                zh: "道德的进步，量度为「其苦难被允许算数」的存在集合的扩大。",
              }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
