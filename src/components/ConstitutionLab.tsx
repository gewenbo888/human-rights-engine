"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { INSTITUTIONS, Institution } from "./content";

/* ─── Fixed orbital positions (id → angle around executive center) ─── */
const ORBITAL: Record<string, number> = {
  constitution: 90,      // top
  legislature:  150,     // top-left
  judiciary:    210,     // bottom-left
  press:        270,     // bottom
  elections:    330,     // bottom-right
  "civil-society": 30,  // top-right
};

/* ─── Constraint wiring: which nodes restrain which ─── */
// Each arrow goes from constrainer → target(s)
const EDGES: Array<{ from: string; to: string[] }> = [
  { from: "constitution",   to: ["executive", "legislature", "judiciary", "elections"] },
  { from: "legislature",    to: ["executive"] },
  { from: "judiciary",      to: ["executive", "legislature"] },
  { from: "press",          to: ["executive", "legislature", "judiciary"] },
  { from: "elections",      to: ["executive", "legislature"] },
  { from: "civil-society",  to: ["executive"] },
];

/* ─── Colours ─── */
function nodeColor(id: string): { fill: string; stroke: string; glow: string; text: string } {
  if (id === "executive")
    return { fill: "#2a0e16", stroke: "#e0556b", glow: "rgba(224,85,107,0.7)", text: "#f4abb5" };
  if (id === "constitution")
    return { fill: "#0a1826", stroke: "#e9b54e", glow: "rgba(233,181,78,0.6)", text: "#fadfa6" };
  if (id === "judiciary")
    return { fill: "#0a1620", stroke: "#3fc4b0", glow: "rgba(63,196,176,0.55)", text: "#9fe9dd" };
  // rest: liberty blue
  return { fill: "#0c1628", stroke: "#4f9cf0", glow: "rgba(79,156,240,0.5)", text: "#a6d0fb" };
}

/* ─── Geometry helpers ─── */
function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function edgePath(
  x1: number, y1: number,
  x2: number, y2: number,
  nodeR: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Start slightly outside the source node, end just outside target
  const sx = x1 + (dx / dist) * (nodeR + 2);
  const sy = y1 + (dy / dist) * (nodeR + 2);
  const ex = x2 - (dx / dist) * (nodeR + 2);
  const ey = y2 - (dy / dist) * (nodeR + 2);
  // Slight curve via a midpoint control
  const mx = (sx + ex) / 2 - dy * 0.08;
  const my = (sy + ey) / 2 + dx * 0.08;
  return `M${sx},${sy} Q${mx},${my} ${ex},${ey}`;
}

/* ─── Arrow head ─── */
function arrowHead(
  x1: number, y1: number,
  x2: number, y2: number,
  dist: number,
  nodeR: number,
  color: string,
  opacity: number
): React.ReactNode {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const ex = x2 - (dx / dist) * (nodeR + 2);
  const ey = y2 - (dy / dist) * (nodeR + 2);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <polygon
      key={`arr-${x1}-${y1}-${x2}-${y2}`}
      points="-5,-3 2,0 -5,3"
      transform={`translate(${ex},${ey}) rotate(${angle})`}
      fill={color}
      opacity={opacity}
    />
  );
}

export default function ConstitutionLab() {
  const { lang } = useLang();
  const [active, setActive] = useState<Institution | null>(null);
  const [checksRemoved, setChecksRemoved] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 560, h: 480 });

  // Responsive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const cw = entry.contentRect.width;
      const ch = Math.max(340, Math.min(500, cw * 0.86));
      setDims({ w: cw, h: ch });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2 - 16;
  const orbitR = Math.min(w, h) * 0.33;
  const execR = checksRemoved ? 38 : 28;
  const orbR = 22;

  // Build node positions
  const positions: Record<string, [number, number]> = { executive: [cx, cy] };
  for (const [id, angle] of Object.entries(ORBITAL)) {
    positions[id] = polar(cx, cy, orbitR, angle);
  }

  // All institutions including executive
  const allInstitutions: Institution[] = [
    ...INSTITUTIONS.filter((i) => i.id === "executive"),
    ...INSTITUTIONS.filter((i) => i.id !== "executive"),
  ];

  const handleNode = useCallback(
    (inst: Institution) => setActive((prev) => (prev?.id === inst.id ? null : inst)),
    []
  );

  // Edge opacity based on checks-removed toggle
  const edgeOpacity = checksRemoved ? 0.06 : 1;
  const edgeFlowOpacity = checksRemoved ? 0 : 1;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label-mono mb-1" style={{ color: "#6cd9c8" }}>
            <T v={{ en: "Checks & Balances", zh: "制衡系统" }} />
          </p>
          <h3 className="display text-xl text-bone-100">
            <T v={{ en: "How Institutions Constrain Power", zh: "制度如何约束权力" }} />
          </h3>
          <p className="mt-1 text-sm text-bone-500">
            <T
              v={{
                en: "Each arrow is an active constraint. The rule of law means even the executive must obey.",
                zh: "每一条箭头都是一道主动约束。法治意味着连行政机关也必须服从。",
              }}
            />
          </p>
        </div>
      </div>

      {/* Checks-removed toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => { setChecksRemoved((v) => !v); setActive(null); }}
          aria-pressed={checksRemoved}
          className={`relative flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-all duration-500 ${
            checksRemoved
              ? "border-power-500/60 bg-power-500/10 text-power-300"
              : "border-justice-500/30 bg-justice-500/08 text-justice-400 hover:border-justice-400/50"
          }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              checksRemoved ? "bg-power-400 shadow-[0_0_8px_rgba(224,85,107,0.8)]" : "bg-justice-500"
            }`}
          />
          <span className={`lang-fade ${lang === "zh" ? "zh" : ""}`} key={`toggle-${lang}`}>
            {checksRemoved
              ? t({ en: "Restore the checks ↺", zh: "恢复制衡 ↺" }, lang)
              : t({ en: "Remove the checks · 移除制衡", zh: "移除制衡" }, lang)}
          </span>
        </button>
        {active && (
          <button
            onClick={() => setActive(null)}
            className="rounded-full border border-liberty-500/30 px-3 py-1.5 text-xs text-bone-500 hover:text-bone-300 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Warning banner when checks removed */}
      <div
        className="overflow-hidden transition-all duration-700"
        style={{ maxHeight: checksRemoved ? "80px" : "0", opacity: checksRemoved ? 1 : 0 }}
      >
        <div className="mb-3 rounded-lg border border-power-500/40 bg-power-500/08 px-4 py-2.5 rise">
          <p
            className={`text-sm leading-snug text-power-300 lang-fade ${lang === "zh" ? "zh" : ""}`}
            key={`warn-${lang}-${checksRemoved}`}
          >
            {t(
              {
                en: "Power unchecked expands — this is how rights die.",
                zh: "不受制衡的权力会扩张——权利由此死亡。",
              },
              lang
            )}
          </p>
        </div>
      </div>

      {/* SVG diagram */}
      <div ref={containerRef} className="w-full">
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          style={{ display: "block" }}
          aria-label={t({ en: "Constitutional checks and balances diagram", zh: "宪政制衡图" }, lang)}
        >
          <defs>
            {/* Glow filters per colour */}
            <filter id="cl-glow-power" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cl-glow-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cl-glow-gold" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="cl-bg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0f1626" />
              <stop offset="100%" stopColor="#070a12" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width={w} height={h} fill="#0a0f1c" rx="8" />

          {/* Orbit ring (faint) */}
          <circle
            cx={cx} cy={cy} r={orbitR}
            fill="none"
            stroke="rgba(79,156,240,0.09)"
            strokeWidth="1"
            strokeDasharray="6 5"
          />

          {/* ─── Constraint edges ─── */}
          {EDGES.map(({ from, to }) => {
            const [fx, fy] = positions[from];
            const fromCol = nodeColor(from);
            const fromR = from === "executive" ? execR : orbR;

            return to.map((toId) => {
              const [tx, ty] = positions[toId];
              const toR = toId === "executive" ? execR : orbR;
              const dx = tx - fx;
              const dy = ty - fy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const path = edgePath(fx, fy, tx, ty, fromR);
              const toCol = nodeColor(toId);
              // Edge colour = constrainer's colour toward target
              const edgeColor = fromCol.stroke;
              const isActive =
                active?.id === from || active?.id === toId;

              return (
                <g key={`${from}-${toId}`} style={{ pointerEvents: "none" }}>
                  {/* Static edge */}
                  <path
                    d={path}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={isActive ? 1.6 : 1}
                    opacity={edgeOpacity * (isActive ? 0.85 : 0.3)}
                    style={{ transition: "opacity 0.7s, stroke-width 0.3s" }}
                  />
                  {/* Flowing dashed overlay */}
                  <path
                    d={path}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={1.2}
                    className="flow"
                    opacity={edgeFlowOpacity * (isActive ? 0.9 : 0.38)}
                    style={{ transition: "opacity 0.7s" }}
                  />
                  {/* Arrow head */}
                  {arrowHead(fx, fy, tx, ty, dist, toR, edgeColor, edgeOpacity * (isActive ? 0.9 : 0.45))}
                </g>
              );
            });
          })}

          {/* ─── Nodes ─── */}
          {allInstitutions.map((inst) => {
            const [nx, ny] = positions[inst.id] ?? [cx, cy];
            const isExec = inst.id === "executive";
            const col = nodeColor(inst.id);
            const r = isExec ? execR : orbR;
            const isActive = active?.id === inst.id;
            const isHov = hovered === inst.id;
            const filter = isExec
              ? "url(#cl-glow-power)"
              : inst.id === "constitution"
              ? "url(#cl-glow-gold)"
              : "url(#cl-glow-soft)";

            // Label nudge — push outward from center
            const dx = nx - cx;
            const dy = ny - cy;
            const ldist = Math.sqrt(dx * dx + dy * dy) || 1;
            const labelDist = r + 14;
            const lx = isExec ? nx : nx + (dx / ldist) * labelDist;
            const ly = isExec ? ny + r + 16 : ny + (dy / ldist) * labelDist;
            const anchor = isExec
              ? "middle"
              : Math.abs(dx) < 10
              ? "middle"
              : dx > 0
              ? "start"
              : "end";

            return (
              <g
                key={inst.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleNode(inst)}
                onMouseEnter={() => setHovered(inst.id)}
                onMouseLeave={() => setHovered(null)}
                role="button"
                aria-pressed={isActive}
                aria-label={t(inst.label, lang)}
              >
                {/* Pulse ring for executive */}
                {isExec && (
                  <circle
                    cx={nx} cy={ny}
                    r={r + 14}
                    fill="none"
                    stroke="#e0556b"
                    strokeWidth="0.8"
                    strokeDasharray="5 4"
                    opacity={checksRemoved ? 0.6 : 0.25}
                    className="node-pulse"
                    style={{ transition: "opacity 0.7s, r 0.6s" }}
                  />
                )}
                {/* Hover / active ring */}
                {(isActive || isHov) && !isExec && (
                  <circle
                    cx={nx} cy={ny}
                    r={r + 9}
                    fill="none"
                    stroke={col.stroke}
                    strokeWidth="0.8"
                    opacity="0.45"
                    className="node-pulse"
                  />
                )}
                {/* Node background */}
                <circle
                  cx={nx} cy={ny} r={r}
                  fill={col.fill}
                  stroke={col.stroke}
                  strokeWidth={isActive ? 2.2 : isExec ? 1.8 : 1.4}
                  filter={filter}
                  style={{
                    transition: "r 0.6s cubic-bezier(0.34,1.56,0.64,1), stroke-width 0.3s, fill 0.5s",
                  }}
                />
                {/* Node icon / glyph */}
                <text
                  x={nx} y={ny + (isExec ? 5 : 4)}
                  textAnchor="middle"
                  fontSize={isExec ? "16" : "13"}
                  fill={col.text}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {isExec
                    ? "⚡"
                    : inst.id === "constitution"
                    ? "§"
                    : inst.id === "legislature"
                    ? "⊞"
                    : inst.id === "judiciary"
                    ? "⚖"
                    : inst.id === "press"
                    ? "◎"
                    : inst.id === "elections"
                    ? "✓"
                    : "◈"}
                </text>
                {/* Label below/outside */}
                <text
                  x={lx}
                  y={ly + (isExec ? 0 : 0)}
                  textAnchor={anchor}
                  fontSize={isExec ? "11.5" : "10"}
                  fontFamily={
                    lang === "zh"
                      ? "Noto Serif SC, serif"
                      : isExec
                      ? "Newsreader, ui-serif, Georgia, serif"
                      : "Spectral, ui-serif, Georgia, serif"
                  }
                  fontWeight={isExec ? "600" : isActive ? "500" : "400"}
                  fill={col.text}
                  opacity={isActive || isHov ? 1 : 0.8}
                  style={{ pointerEvents: "none" }}
                >
                  {inst.label[lang]}
                </text>
              </g>
            );
          })}

          {/* "Power unchecked" label when checks removed */}
          {checksRemoved && (
            <g style={{ pointerEvents: "none" }} className="rise">
              <text
                x={cx}
                y={cy - execR - 22}
                textAnchor="middle"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="0.14em"
                fill="#ec7d8d"
                opacity="0.85"
                className="node-pulse"
              >
                {lang === "zh" ? "权力扩张中" : "POWER EXPANDING"}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Info panel */}
      <div
        className="mt-4 min-h-[96px] rounded-lg border transition-all duration-500"
        style={{
          borderColor: active
            ? `${nodeColor(active.id).stroke}55`
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
                  background: nodeColor(active.id).stroke,
                  boxShadow: `0 0 8px ${nodeColor(active.id).glow}`,
                }}
              />
              <span
                className={`font-semibold text-base lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`al-${lang}`}
                style={{ color: nodeColor(active.id).text }}
              >
                {active.label[lang]}
              </span>
              {active.id !== "executive" && (
                <span className="ml-auto text-xs font-mono text-bone-500">
                  <T v={{ en: "Constrains:", zh: "约束对象：" }} />{" "}
                  <span style={{ color: nodeColor(active.id).text }}>
                    {active.constrains[lang]}
                  </span>
                </span>
              )}
            </div>
            <p
              className={`text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}
              key={`ar-${lang}`}
            >
              {active.role[lang]}
            </p>
            {active.id === "executive" && (
              <p className="mt-2 text-xs italic text-power-300 lang-fade" key={`exec-note-${lang}`}>
                <T
                  v={{
                    en: "The hand that can most easily abuse power — the reason all other institutions exist.",
                    zh: "最易滥权的那只手——正是所有其他制度存在的理由。",
                  }}
                />
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-[96px] items-center justify-center gap-2 text-sm text-bone-500">
            <span className="text-justice-500/60 text-lg">⚖</span>
            <T
              v={{
                en: "Click an institution to learn its role and what it checks",
                zh: "点击一个制度节点，了解其职能及其约束对象",
              }}
            />
          </div>
        )}
      </div>

      {/* Node legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-bone-500">
        {[
          { color: "#e0556b", label: { en: "Executive (central power)", zh: "行政机关（中央权力）" } },
          { color: "#e9b54e", label: { en: "Constitution", zh: "宪法" } },
          { color: "#3fc4b0", label: { en: "Judiciary", zh: "司法机关" } },
          { color: "#4f9cf0", label: { en: "Other constraining institutions", zh: "其他制衡制度" } },
        ].map((l) => (
          <span key={l.color} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: l.color }}
            />
            <span className={lang === "zh" ? "zh" : ""}>{l.label[lang]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
