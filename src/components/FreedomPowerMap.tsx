"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useLang, T, t } from "./lang";
import { REGIMES, Regime } from "./content";

/* ─── colour helpers ─── */
function regimeColor(liberty: number): { fill: string; glow: string; ring: string } {
  if (liberty >= 72)
    return { fill: "#6cd9c8", glow: "rgba(63,196,176,0.6)", ring: "#3fc4b0" };
  if (liberty >= 50)
    return { fill: "#f3c976", glow: "rgba(233,181,78,0.6)", ring: "#e9b54e" };
  if (liberty >= 32)
    return { fill: "#a6d0fb", glow: "rgba(79,156,240,0.5)", ring: "#4f9cf0" };
  return { fill: "#ec7d8d", glow: "rgba(224,85,107,0.65)", ring: "#e0556b" };
}

/* ─── SVG space → percentage helpers ─── */
const PAD = { left: 64, right: 28, top: 28, bottom: 64 };

function toX(liberty: number, w: number) {
  return PAD.left + (liberty / 100) * (w - PAD.left - PAD.right);
}
function toY(order: number, h: number) {
  // order=0 at bottom, order=100 at top
  return h - PAD.bottom - (order / 100) * (h - PAD.top - PAD.bottom);
}

/* ─── frontier curve points (illustrative) ─── */
function frontierPath(w: number, h: number): string {
  // A soft convex curve from (liberty≈20, order≈92) → (liberty≈85, order≈78)
  const pts: [number, number][] = [
    [10, 96], [20, 94], [32, 91], [46, 87], [60, 84], [72, 82], [84, 79], [92, 74],
  ];
  const coords = pts.map(([l, o]) => `${toX(l, w)},${toY(o, h)}`);
  return "M" + coords.join(" L");
}

/* ─── quadrant labels ─── */
const QUADRANTS = [
  {
    pos: { lx: 50, ly: 80 },
    label: { en: "Chaos risk", zh: "失序风险" },
    sub: { en: "freedom without structure", zh: "无结构的自由" },
    color: "rgba(79,156,240,0.55)",
  },
  {
    pos: { lx: 50, ly: 14 },
    label: { en: "The hard balance", zh: "那个艰难的平衡" },
    sub: { en: "strong and free", zh: "强健而自由" },
    color: "rgba(63,196,176,0.65)",
  },
  {
    pos: { lx: -50, ly: 14 },
    label: { en: "Control", zh: "控制" },
    sub: { en: "order without liberty", zh: "无自由的秩序" },
    color: "rgba(224,85,107,0.55)",
  },
  {
    pos: { lx: -50, ly: 80 },
    label: { en: "Collapse", zh: "崩溃" },
    sub: { en: "neither order nor freedom", zh: "秩序与自由俱失" },
    color: "rgba(127,141,176,0.45)",
  },
];

export default function FreedomPowerMap() {
  const { lang } = useLang();
  const [active, setActive] = useState<Regime | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 560, h: 460 });
  const roRef = useRef<ResizeObserver | null>(null);

  // Responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    roRef.current = new ResizeObserver(([entry]) => {
      const cw = entry.contentRect.width;
      const ch = Math.max(360, Math.min(520, cw * 0.82));
      setDims({ w: cw, h: ch });
    });
    roRef.current.observe(el);
    return () => roRef.current?.disconnect();
  }, []);

  const handlePoint = useCallback(
    (r: Regime) => setActive((prev) => (prev?.id === r.id ? null : r)),
    []
  );

  const { w, h } = dims;

  // Axis tick marks
  const ticks = [0, 25, 50, 75, 100];

  // Label nudges to avoid overlaps — keyed by id
  const nudge: Record<string, { dx: number; dy: number }> = {
    anarchy: { dx: 10, dy: 14 },
    "liberal-weak": { dx: -8, dy: -14 },
    "liberal-strong": { dx: 8, dy: -14 },
    developmental: { dx: -8, dy: 14 },
    authoritarian: { dx: -8, dy: -14 },
    totalitarian: { dx: 10, dy: 14 },
    techno: { dx: 8, dy: -14 },
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label-mono mb-1" style={{ color: "#6cd9c8" }}>
            <T v={{ en: "Liberty × Order", zh: "自由 × 秩序" }} />
          </p>
          <h3 className="display text-xl text-bone-100">
            <T v={{ en: "Governance Archetypes", zh: "治理原型图谱" }} />
          </h3>
          <p className="mt-1 text-sm text-bone-500">
            <T
              v={{
                en: "Where regimes sit on the liberty–order plane. The frontier shows what is structurally hard to achieve.",
                zh: "各治理形态在自由—秩序平面上的位置。曲线显示结构上难以实现之处。",
              }}
            />
          </p>
        </div>
        {active && (
          <button
            onClick={() => setActive(null)}
            className="rounded-full border border-liberty-500/30 px-3 py-1 text-xs text-bone-500 hover:border-liberty-400/50 hover:text-bone-300 transition-all"
            aria-label="Clear selection"
          >
            ✕ <T v={{ en: "Clear", zh: "清除" }} />
          </button>
        )}
      </div>

      {/* SVG map */}
      <div ref={containerRef} className="w-full">
        <svg
          ref={svgRef}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          style={{ display: "block" }}
          aria-label={t({ en: "Freedom and power map", zh: "自由与权力地图" }, lang)}
        >
          <defs>
            {/* Grid gradient overlay */}
            <radialGradient id="fpm-bg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f1626" stopOpacity="0" />
              <stop offset="100%" stopColor="#070a12" stopOpacity="0.35" />
            </radialGradient>
            {/* Quadrant overlays */}
            <linearGradient id="fpm-tr" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#3fc4b0" stopOpacity="0" />
              <stop offset="100%" stopColor="#3fc4b0" stopOpacity="0.07" />
            </linearGradient>
            <linearGradient id="fpm-tl" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#e0556b" stopOpacity="0" />
              <stop offset="100%" stopColor="#e0556b" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="fpm-br" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f9cf0" stopOpacity="0" />
              <stop offset="100%" stopColor="#4f9cf0" stopOpacity="0.05" />
            </linearGradient>
            {REGIMES.map((r) => {
              const c = regimeColor(r.liberty);
              return (
                <filter key={`glow-${r.id}`} id={`glow-${r.id}`} x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              );
            })}
            <filter id="fpm-frontier-glow" x="-10%" y="-200%" width="120%" height="500%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width={w} height={h} fill="#0a0f1c" rx="8" />

          {/* Quadrant colour tints */}
          {/* top-right: high liberty, high order (justice teal) */}
          <rect
            x={toX(50, w)} y={PAD.top}
            width={w - PAD.right - toX(50, w)}
            height={toY(50, h) - PAD.top}
            fill="url(#fpm-tr)" rx="4"
          />
          {/* top-left: low liberty, high order (power red) */}
          <rect
            x={PAD.left} y={PAD.top}
            width={toX(50, w) - PAD.left}
            height={toY(50, h) - PAD.top}
            fill="url(#fpm-tl)" rx="4"
          />
          {/* bottom-right: high liberty, low order (liberty blue) */}
          <rect
            x={toX(50, w)} y={toY(50, h)}
            width={w - PAD.right - toX(50, w)}
            height={h - PAD.bottom - toY(50, h)}
            fill="url(#fpm-br)" rx="4"
          />

          {/* Grid lines */}
          {ticks.map((v) => (
            <g key={`grid-${v}`}>
              <line
                x1={toX(v, w)} y1={PAD.top}
                x2={toX(v, w)} y2={h - PAD.bottom}
                stroke="rgba(79,156,240,0.08)" strokeWidth="1"
                strokeDasharray="3 5"
              />
              <line
                x1={PAD.left} y1={toY(v, h)}
                x2={w - PAD.right} y2={toY(v, h)}
                stroke="rgba(79,156,240,0.08)" strokeWidth="1"
                strokeDasharray="3 5"
              />
            </g>
          ))}

          {/* Axis lines */}
          <line
            x1={PAD.left} y1={h - PAD.bottom}
            x2={w - PAD.right} y2={h - PAD.bottom}
            stroke="rgba(79,156,240,0.35)" strokeWidth="1.5"
          />
          <line
            x1={PAD.left} y1={PAD.top}
            x2={PAD.left} y2={h - PAD.bottom}
            stroke="rgba(79,156,240,0.35)" strokeWidth="1.5"
          />

          {/* Axis tick labels */}
          {ticks.filter((v) => v > 0 && v < 100).map((v) => (
            <g key={`tick-x-${v}`}>
              <text
                x={toX(v, w)} y={h - PAD.bottom + 18}
                textAnchor="middle" fontSize="10"
                fill="rgba(127,141,176,0.5)" fontFamily="IBM Plex Mono"
              >{v}</text>
              <text
                x={PAD.left - 14} y={toY(v, h) + 4}
                textAnchor="end" fontSize="10"
                fill="rgba(127,141,176,0.5)" fontFamily="IBM Plex Mono"
              >{v}</text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={(PAD.left + w - PAD.right) / 2} y={h - 10}
            textAnchor="middle" fontSize="11.5" fontFamily="IBM Plex Mono"
            letterSpacing="0.16em"
            fill="#6cd9c8"
            style={{ textTransform: "uppercase" }}
          >
            {lang === "zh" ? "自由度 →" : "LIBERTY →"}
          </text>
          <text
            x={18} y={(PAD.top + h - PAD.bottom) / 2}
            textAnchor="middle" fontSize="11.5" fontFamily="IBM Plex Mono"
            letterSpacing="0.16em"
            fill="#a6d0fb"
            transform={`rotate(-90, 18, ${(PAD.top + h - PAD.bottom) / 2})`}
          >
            {lang === "zh" ? "↑ 国家能力" : "↑ ORDER"}
          </text>

          {/* Quadrant ghost labels */}
          {QUADRANTS.map((q, i) => {
            const midX = (PAD.left + w - PAD.right) / 2;
            const midY = (PAD.top + h - PAD.bottom) / 2;
            const x = midX + q.pos.lx * ((w - PAD.left - PAD.right) / 200);
            const y = midY + (q.pos.ly / 100) * (h - PAD.top - PAD.bottom) - (h - PAD.top - PAD.bottom) / 2;
            return (
              <g key={i} style={{ pointerEvents: "none" }}>
                <text
                  x={x} y={y - 8}
                  textAnchor="middle" fontSize="10.5"
                  fontFamily="IBM Plex Mono" letterSpacing="0.12em"
                  fill={q.color}
                >
                  {q.label[lang]}
                </text>
                <text
                  x={x} y={y + 6}
                  textAnchor="middle" fontSize="9"
                  fontFamily="Spectral, ui-serif, Georgia, serif"
                  fontStyle="italic"
                  fill={q.color} opacity="0.7"
                >
                  {q.sub[lang]}
                </text>
              </g>
            );
          })}

          {/* Frontier curve */}
          <path
            d={frontierPath(w, h)}
            fill="none"
            stroke="rgba(233,181,78,0.35)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            filter="url(#fpm-frontier-glow)"
          />
          {/* Frontier label */}
          <text
            x={toX(78, w) + 6}
            y={toY(83, h) - 10}
            fontSize="9.5"
            fontFamily="IBM Plex Mono"
            letterSpacing="0.1em"
            fill="rgba(233,181,78,0.65)"
          >
            {lang === "zh" ? "前沿边界" : "FRONTIER"}
          </text>

          {/* "Coordination without domination" tension line annotation */}
          <g style={{ pointerEvents: "none" }}>
            <text
              x={toX(50, w)}
              y={toY(50, h) - 6}
              textAnchor="middle"
              fontSize="9"
              fontFamily="Spectral, ui-serif"
              fontStyle="italic"
              fill="rgba(166,208,251,0.4)"
            >
              {lang === "zh" ? "无支配的协调" : "coordination without domination"}
            </text>
          </g>

          {/* Regime points */}
          {REGIMES.map((r) => {
            const cx = toX(r.liberty, w);
            const cy = toY(r.order, h);
            const col = regimeColor(r.liberty);
            const isActive = active?.id === r.id;
            const isHovered = hovered === r.id;
            const isConstitutional = r.id === "liberal-strong";
            const radius = isConstitutional ? 11 : 8.5;
            const nd = nudge[r.id] ?? { dx: 10, dy: -14 };

            return (
              <g
                key={r.id}
                style={{ cursor: "pointer" }}
                onClick={() => handlePoint(r)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                role="button"
                aria-pressed={isActive}
                aria-label={t(r.label, lang)}
              >
                {/* Outer glow ring for active/hovered */}
                {(isActive || isHovered) && (
                  <circle
                    cx={cx} cy={cy}
                    r={radius + 9}
                    fill="none"
                    stroke={col.ring}
                    strokeWidth="1"
                    opacity="0.5"
                    className="node-pulse"
                  />
                )}
                {/* Constitutional democracy: extra ring */}
                {isConstitutional && (
                  <circle
                    cx={cx} cy={cy}
                    r={radius + 18}
                    fill="none"
                    stroke="#3fc4b0"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                    opacity="0.35"
                    className="node-pulse"
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={cx} cy={cy}
                  r={radius}
                  fill={col.fill}
                  fillOpacity={isActive || isHovered ? 1 : 0.82}
                  stroke={isActive ? "#f3f7fd" : col.ring}
                  strokeWidth={isActive ? 2 : 1.2}
                  style={{
                    filter: (isActive || isHovered)
                      ? `drop-shadow(0 0 7px ${col.glow})`
                      : `drop-shadow(0 0 3px ${col.glow})`,
                    transition: "r 0.2s, opacity 0.2s",
                  }}
                />
                {/* Label */}
                <text
                  x={cx + nd.dx}
                  y={cy + nd.dy}
                  textAnchor={nd.dx < 0 ? "end" : "start"}
                  fontSize={isConstitutional ? "11.5" : "10"}
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Spectral, ui-serif, Georgia, serif"}
                  fontWeight={isConstitutional ? "600" : "400"}
                  fill={col.fill}
                  opacity={isActive || isHovered ? 1 : 0.82}
                  style={{ pointerEvents: "none" }}
                >
                  {r.label[lang]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info panel */}
      <div
        className="mt-4 min-h-[96px] rounded-lg border transition-all duration-500"
        style={{
          borderColor: active
            ? `${regimeColor(active.liberty).ring}55`
            : "rgba(79,156,240,0.12)",
          background: active
            ? "linear-gradient(160deg, rgba(23,32,51,0.9), rgba(10,15,28,0.95))"
            : "rgba(10,15,28,0.5)",
        }}
      >
        {active ? (
          <div className="p-4 rise">
            <div className="mb-2 flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  background: regimeColor(active.liberty).fill,
                  boxShadow: `0 0 8px ${regimeColor(active.liberty).glow}`,
                }}
              />
              <span
                className={`font-semibold text-base lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`label-${lang}`}
                style={{ color: regimeColor(active.liberty).fill }}
              >
                {active.label[lang]}
              </span>
              <span className="ml-auto text-xs font-mono text-bone-500">
                <span className="liberty-text">Liberty {active.liberty}</span>
                {" · "}
                <span className="justice-text">Order {active.order}</span>
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}
              key={`note-${lang}`}
            >
              {active.note[lang]}
            </p>
          </div>
        ) : (
          <div className="flex h-[96px] items-center justify-center gap-2 text-sm text-bone-500">
            <span className="text-liberty-500/60 text-lg">◎</span>
            <T v={{ en: "Click a point to read about that governance type", zh: "点击一个点以了解该治理类型" }} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-bone-500">
        {[
          { color: "#6cd9c8", label: { en: "High liberty", zh: "高自由度" } },
          { color: "#f3c976", label: { en: "Mid liberty", zh: "中等自由度" } },
          { color: "#a6d0fb", label: { en: "Low liberty", zh: "较低自由度" } },
          { color: "#ec7d8d", label: { en: "Very low liberty", zh: "极低自由度" } },
        ].map((l) => (
          <span key={l.color} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: l.color }}
            />
            <span className={lang === "zh" ? "zh" : ""}>{l.label[lang]}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-1">
          <span className="inline-block w-5 border-t border-dashed" style={{ borderColor: "rgba(233,181,78,0.55)" }} />
          <span><T v={{ en: "Structural frontier", zh: "结构性前沿" }} /></span>
        </span>
      </div>
    </div>
  );
}
