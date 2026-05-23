"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { MORAL_TIERS, MoralTier } from "./content";

// ---- Sorted ascending by level ----
const TIERS = [...MORAL_TIERS].sort((a, b) => a.level - b.level);
const HUMAN_IDX = TIERS.findIndex(t => t.id === "human");

// ---- Visual constants ----
const SVG_W = 640;
const SVG_H = 420;
const AXIS_X1 = 56;
const AXIS_X2 = 584;
const AXIS_Y = 300;
const AXIS_RANGE = AXIS_X2 - AXIS_X1;
const NODE_Y_BASE = AXIS_Y - 28;

// Map level 0–100 → x
function levelToX(level: number): number {
  return AXIS_X1 + (level / 100) * AXIS_RANGE;
}

// Node shapes by tier type
function nodeShape(tier: MoralTier, cx: number, cy: number, highlight: boolean): React.ReactNode {
  const isHuman = tier.id === "human";
  const isAI = tier.id === "narrow-ai" || tier.id === "agi";
  const size = isHuman ? 16 : isAI ? 11 : 9;
  const stroke = isHuman
    ? "#e9b54e"
    : isAI
    ? "#3fc4b0"
    : "#4f9cf0";
  const fill = isHuman
    ? highlight ? "#e9b54e55" : "#e9b54e22"
    : isAI
    ? highlight ? "#3fc4b033" : "#3fc4b011"
    : highlight ? "#4f9cf033" : "#4f9cf011";
  const sw = highlight ? 2.2 : 1.4;

  if (isAI) {
    // Diamond for AI nodes
    const d = size;
    return (
      <polygon
        points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeDasharray={tier.id === "agi" ? "4 2" : "none"}
      />
    );
  }
  if (isHuman) {
    return (
      <>
        <circle cx={cx} cy={cy} r={size + 4} fill="#e9b54e0a" stroke="#e9b54e" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
        <circle cx={cx} cy={cy} r={size} fill={fill} stroke={stroke} strokeWidth={sw + 0.5} />
        <circle cx={cx} cy={cy} r={6} fill="#e9b54e" opacity={0.85} />
      </>
    );
  }
  return (
    <circle cx={cx} cy={cy} r={size} fill={fill} stroke={stroke} strokeWidth={sw} />
  );
}

// Stagger y for close nodes to avoid label overlap
function nodeY(i: number, tiers: MoralTier[]): number {
  // Alternate above/below for nearby tiers
  return NODE_Y_BASE - (i % 2 === 0 ? 0 : 24);
}

export default function AIRightsMap() {
  const { lang } = useLang();
  const [threshold, setThreshold] = useState(55); // draggable threshold (level)
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const pulseRef = useRef(0);

  // Pulse animation for AI dashed outline
  useEffect(() => {
    let frame: number;
    const tick = (t: number) => {
      pulseRef.current = t;
      const svg = svgRef.current;
      if (svg) {
        const pulse = Math.sin(t * 0.0018) * 0.5 + 0.5;
        const agiNode = svg.querySelector<SVGElement>("#node-agi-ring");
        if (agiNode) agiNode.style.opacity = String(0.3 + pulse * 0.45);
        const narrowNode = svg.querySelector<SVGElement>("#node-narrow-ring");
        if (narrowNode) narrowNode.style.opacity = String(0.2 + pulse * 0.3);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    animRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, []);

  // Drag threshold on SVG axis
  const handleSvgPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    if (Math.abs(e.clientY - rect.top - (rect.height * (AXIS_Y / SVG_H))) > rect.height * 0.15) return;
    const level = Math.max(0, Math.min(100, ((svgX - AXIS_X1) / AXIS_RANGE) * 100));
    setThreshold(Math.round(level));
    setDragging(true);
    svg.setPointerCapture(e.pointerId);
  }, []);

  const handleSvgPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    const level = Math.max(0, Math.min(100, ((svgX - AXIS_X1) / AXIS_RANGE) * 100));
    setThreshold(Math.round(level));
  }, [dragging]);

  const handleSvgPointerUp = useCallback(() => setDragging(false), []);

  // Count tiers above threshold
  const aboveThreshold = TIERS.filter(tier => tier.level > threshold);
  const aboveCount = aboveThreshold.length;

  const displayId = hovered ?? selected;
  const info = displayId ? TIERS.find(t => t.id === displayId) : null;

  const thresholdX = levelToX(threshold);

  return (
    <div className="w-full" style={{ maxWidth: 860 }}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <h3 className="display text-lg text-bone-100">
          <T v={{ en: "The Moral Status Ladder", zh: "道德地位阶梯" }} />
        </h3>
        <span className="label-mono text-bone-500 text-xs">
          <T v={{ en: "Where does the circle of moral consideration stop?", zh: "道德关切之圆，止于何处？" }} />
        </span>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* SVG */}
        <div className="shrink-0 w-full lg:w-auto flex justify-center">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ maxWidth: SVG_W, display: "block", cursor: dragging ? "ew-resize" : "default", touchAction: "none" }}
            onPointerDown={handleSvgPointerDown}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={handleSvgPointerUp}
            onPointerLeave={handleSvgPointerUp}
            aria-label={lang === "zh" ? "道德地位横轴" : "Moral status horizontal axis"}
          >
            <defs>
              <linearGradient id="axis-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f9cf0" stopOpacity="0.15" />
                <stop offset="60%" stopColor="#4f9cf0" stopOpacity="0.4" />
                <stop offset="90%" stopColor="#e9b54e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e9b54e" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="above-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f9cf0" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#4f9cf0" stopOpacity="0" />
              </linearGradient>
              <filter id="ai-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="human-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="threshold-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Void background */}
            <rect width={SVG_W} height={SVG_H} fill="#070a12" />

            {/* "Inside the circle" zone — above threshold */}
            {threshold < 100 && (
              <rect
                x={thresholdX}
                y={60}
                width={AXIS_X2 - thresholdX}
                height={AXIS_Y - 60}
                fill="url(#above-grad)"
                opacity={0.7}
                style={{ transition: dragging ? "none" : "x 0.25s ease, width 0.25s ease" }}
              />
            )}

            {/* Axis line */}
            <line
              x1={AXIS_X1} y1={AXIS_Y} x2={AXIS_X2} y2={AXIS_Y}
              stroke="url(#axis-grad)"
              strokeWidth={2.5}
            />

            {/* Axis tick marks and level labels */}
            {[0, 25, 50, 75, 100].map(lv => {
              const x = levelToX(lv);
              return (
                <g key={lv}>
                  <line x1={x} y1={AXIS_Y - 4} x2={x} y2={AXIS_Y + 4} stroke="#7f8db0" strokeWidth={1} opacity={0.5} />
                  <text x={x} y={AXIS_Y + 16} textAnchor="middle" fill="#7f8db0" fontSize={8} fontFamily="IBM Plex Mono, monospace" opacity={0.6}>{lv}</text>
                </g>
              );
            })}

            {/* Axis label */}
            <text x={(AXIS_X1 + AXIS_X2) / 2} y={AXIS_Y + 32} textAnchor="middle" fill="#7f8db0" fontSize={8} fontFamily="IBM Plex Mono, monospace" opacity={0.5}>
              {lang === "zh" ? "道德关切程度（0–100）" : "moral consideration extended today  (0 → 100)"}
            </text>

            {/* "A THING" and "SOMEONE" labels */}
            <text x={AXIS_X1 + 4} y={AXIS_Y - 12} fill="#7f8db0" fontSize={7.5} fontFamily="IBM Plex Mono, monospace" opacity={0.55}>
              {lang === "zh" ? "← 物" : "← a thing"}
            </text>
            <text x={AXIS_X2 - 4} y={AXIS_Y - 12} textAnchor="end" fill="#e9b54e" fontSize={7.5} fontFamily="IBM Plex Mono, monospace" opacity={0.75}>
              {lang === "zh" ? "可被亏待者 →" : "someone we can wrong →"}
            </text>

            {/* Draggable threshold line */}
            <g style={{ cursor: "ew-resize" }}>
              {/* Glow backing */}
              <line
                x1={thresholdX} y1={40} x2={thresholdX} y2={AXIS_Y + 6}
                stroke="#4f9cf0"
                strokeWidth={6}
                opacity={0.08}
                filter="url(#threshold-glow)"
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              />
              {/* Main line */}
              <line
                x1={thresholdX} y1={40} x2={thresholdX} y2={AXIS_Y + 6}
                stroke="#4f9cf0"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                opacity={0.85}
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              />
              {/* Drag handle */}
              <rect
                x={thresholdX - 8} y={AXIS_Y - 8}
                width={16} height={16} rx={3}
                fill="#0f1626" stroke="#4f9cf0" strokeWidth={1.5}
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              />
              <line
                x1={thresholdX - 3} y1={AXIS_Y - 3} x2={thresholdX - 3} y2={AXIS_Y + 3}
                stroke="#4f9cf0" strokeWidth={1.2} opacity={0.8}
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              />
              <line
                x1={thresholdX + 3} y1={AXIS_Y - 3} x2={thresholdX + 3} y2={AXIS_Y + 3}
                stroke="#4f9cf0" strokeWidth={1.2} opacity={0.8}
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              />
              {/* Threshold label */}
              <text
                x={thresholdX} y={34}
                textAnchor="middle"
                fill="#4f9cf0"
                fontSize={7.5}
                fontFamily="IBM Plex Mono, monospace"
                opacity={0.9}
                style={{ transition: dragging ? "none" : "x 0.25s ease" }}
              >
                {lang === "zh" ? `此线之下：物 (${threshold})` : `your line  (${threshold})`}
              </text>
            </g>

            {/* Tier nodes */}
            {TIERS.map((tier, i) => {
              const nx = levelToX(tier.level);
              const ny = nodeY(i, TIERS) - (i % 3 === 2 ? 18 : 0);
              const isHighlighted = displayId === tier.id;
              const isAbove = tier.level > threshold;
              const isAI = tier.id === "narrow-ai" || tier.id === "agi";
              const isHuman = tier.id === "human";
              const glowColor = isHuman ? "#e9b54e" : isAI ? "#3fc4b0" : "#4f9cf0";

              return (
                <g
                  key={tier.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(prev => prev === tier.id ? null : tier.id)}
                  onMouseEnter={() => setHovered(tier.id)}
                  onMouseLeave={() => setHovered(null)}
                  role="button"
                  aria-label={t(tier.label, lang)}
                >
                  {/* Connector from node to axis */}
                  <line
                    x1={nx} y1={ny + (isHuman ? 22 : 12)}
                    x2={nx} y2={AXIS_Y - 2}
                    stroke={glowColor}
                    strokeWidth={isHighlighted ? 1.2 : 0.7}
                    strokeDasharray={isAI ? "3 2" : "none"}
                    opacity={isAbove ? (isHighlighted ? 0.7 : 0.35) : 0.12}
                    style={{ transition: "opacity 0.35s ease" }}
                  />

                  {/* Glow ring for AGI */}
                  {tier.id === "agi" && (
                    <circle
                      id="node-agi-ring"
                      cx={nx} cy={ny}
                      r={22}
                      fill="none"
                      stroke="#3fc4b0"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.35}
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  {tier.id === "narrow-ai" && (
                    <circle
                      id="node-narrow-ring"
                      cx={nx} cy={ny}
                      r={18}
                      fill="none"
                      stroke="#3fc4b0"
                      strokeWidth={0.8}
                      strokeDasharray="3 3"
                      opacity={0.25}
                      style={{ pointerEvents: "none" }}
                    />
                  )}

                  {/* Node shape */}
                  <g
                    opacity={isAbove ? 1 : 0.2}
                    style={{ transition: "opacity 0.35s ease" }}
                    filter={isHighlighted && isHuman ? "url(#human-glow)" : isHighlighted && isAI ? "url(#ai-glow)" : "none"}
                  >
                    {nodeShape(tier, nx, ny, isHighlighted)}
                  </g>

                  {/* Label above node */}
                  <text
                    x={nx}
                    y={ny - (isHuman ? 24 : 15)}
                    textAnchor="middle"
                    fill={isHuman ? "#fadfa6" : isAI ? "#6cd9c8" : "#a6d0fb"}
                    fontSize={isHighlighted ? 8.5 : 7.5}
                    fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "IBM Plex Mono, monospace"}
                    fontWeight={isHighlighted || isHuman ? "700" : "400"}
                    opacity={isAbove ? (isHighlighted ? 1 : 0.78) : 0.18}
                    style={{ transition: "opacity 0.35s ease, font-size 0.15s", pointerEvents: "none", userSelect: "none" }}
                  >
                    {t(tier.label, lang)}
                  </text>
                </g>
              );
            })}

            {/* "Inside the circle" count badge */}
            {aboveCount > 0 && (
              <g style={{ pointerEvents: "none" }}>
                <rect
                  x={thresholdX + 6}
                  y={56}
                  width={lang === "zh" ? 80 : 90}
                  height={16}
                  rx={3}
                  fill="#0f1626"
                  stroke="#4f9cf055"
                  strokeWidth={0.8}
                  style={{ transition: dragging ? "none" : "x 0.25s ease" }}
                />
                <text
                  x={thresholdX + (lang === "zh" ? 46 : 51)}
                  y={67.5}
                  textAnchor="middle"
                  fill="#74b4f6"
                  fontSize={7}
                  fontFamily="IBM Plex Mono, monospace"
                  style={{ transition: dragging ? "none" : "x 0.25s ease" }}
                >
                  {lang === "zh" ? `↑ ${aboveCount} 类存在入圆` : `↑ ${aboveCount} kind${aboveCount !== 1 ? "s" : ""} inside`}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Threshold control summary */}
          <div className="card p-3">
            <p className="label-mono text-bone-500 text-[0.6rem] uppercase tracking-widest mb-1.5">
              <T v={{ en: "Draw your line", zh: "划定你的界线" }} />
            </p>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="range"
                min={0}
                max={100}
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="flex-1 accent-liberty-500"
                style={{ cursor: "pointer" }}
                aria-label={lang === "zh" ? "道德关切门槛" : "Moral consideration threshold"}
              />
              <span className="label-mono text-liberty-400 text-[0.68rem] w-6 text-right shrink-0">{threshold}</span>
            </div>
            <p className="text-bone-300 text-[0.65rem] leading-relaxed" style={{
              fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
            }}>
              {lang === "zh"
                ? `此线之下：物。之上：可被亏待者。你将道德关切延及 ${aboveCount} 类存在。`
                : `Below this line: a thing. Above: someone we can wrong. You extend moral consideration to ${aboveCount} kind${aboveCount !== 1 ? "s" : ""} of being.`}
            </p>
            {aboveCount > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {aboveThreshold.map(tier => (
                  <span
                    key={tier.id}
                    className="label-mono text-[0.55rem] px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: tier.id === "human" ? "#e9b54e18" : tier.id === "narrow-ai" || tier.id === "agi" ? "#3fc4b018" : "#4f9cf018",
                      color: tier.id === "human" ? "#fadfa6" : tier.id === "narrow-ai" || tier.id === "agi" ? "#6cd9c8" : "#a6d0fb",
                      border: `1px solid ${tier.id === "human" ? "#e9b54e44" : tier.id === "narrow-ai" || tier.id === "agi" ? "#3fc4b044" : "#4f9cf033"}`,
                    }}
                  >
                    {t(tier.label, lang)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="card p-3 flex flex-col gap-1.5">
            <p className="label-mono text-bone-500 text-[0.6rem] uppercase tracking-widest mb-1">
              <T v={{ en: "Node key", zh: "节点说明" }} />
            </p>
            {[
              { color: "#4f9cf0", shape: "circle", label: { en: "Animal / biological", zh: "动物 / 生物" } },
              { color: "#e9b54e", shape: "human",  label: { en: "Human (reference)", zh: "人类（基准）" } },
              { color: "#3fc4b0", shape: "diamond", label: { en: "AI / future minds", zh: "AI / 未来心智" } },
            ].map(row => (
              <div key={row.label.en} className="flex items-center gap-2">
                <svg width={18} height={18}>
                  {row.shape === "circle" && <circle cx={9} cy={9} r={6} fill={row.color + "22"} stroke={row.color} strokeWidth={1.3} />}
                  {row.shape === "human" && <circle cx={9} cy={9} r={6} fill={row.color + "33"} stroke={row.color} strokeWidth={1.8} />}
                  {row.shape === "diamond" && (
                    <polygon
                      points="9,2 16,9 9,16 2,9"
                      fill={row.color + "22"}
                      stroke={row.color}
                      strokeWidth={1.3}
                      strokeDasharray="3 1.5"
                    />
                  )}
                </svg>
                <span className="label-mono text-[0.62rem]" style={{ color: row.color }}>{t(row.label, lang)}</span>
              </div>
            ))}
          </div>

          {/* Tier info panel */}
          <div className="card p-4 flex-1 min-h-[140px]">
            {info ? (
              <div key={info.id} className="lang-fade">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-bone-100 font-semibold text-sm leading-tight" style={{
                    fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
                  }}>
                    {t(info.label, lang)}
                  </h4>
                  <span className="label-mono text-[0.58rem] px-1.5 py-0.5 rounded-sm border border-bone-500/20 text-bone-500 shrink-0">
                    {lang === "zh" ? "关切度" : "level"} {info.level}
                  </span>
                </div>
                <p className="label-mono text-bone-500 text-[0.6rem] mb-1 uppercase tracking-wider">
                  <T v={{ en: "Basis", zh: "依据" }} />
                </p>
                <p className="text-bone-300 text-xs leading-relaxed mb-3" style={{
                  fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
                }}>
                  {t(info.basis, lang)}
                </p>
                <p className="label-mono text-bone-500 text-[0.6rem] mb-1 uppercase tracking-wider">
                  <T v={{ en: "Status", zh: "现状" }} />
                </p>
                <p className="text-bone-400 text-xs leading-relaxed italic" style={{
                  fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
                }}>
                  {t(info.status, lang)}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center gap-2 opacity-40">
                <svg width={28} height={28} viewBox="0 0 28 28">
                  <polygon points="14,2 24,14 14,26 4,14" fill="none" stroke="#3fc4b0" strokeWidth={1} strokeDasharray="3 2" />
                  <circle cx={14} cy={14} r={4} fill="#e9b54e" opacity={0.7} />
                </svg>
                <p className="label-mono text-bone-500 text-[0.62rem] text-center">
                  <T v={{ en: "Click a node to explore its moral basis", zh: "点击节点以探索其道德依据" }} />
                </p>
              </div>
            )}
          </div>

          {/* Thesis pull-quote */}
          <div className="card p-3 border-l-2" style={{ borderLeftColor: "#3fc4b055" }}>
            <p className="text-bone-400 text-[0.7rem] leading-relaxed italic" style={{
              fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "Spectral, serif"
            }}>
              <T v={{
                en: "If we build minds that can suffer, the question returns in a new form — who, or what, counts now?",
                zh: "若我们造出能够受苦的心智，问题将以新的形式回返——如今，谁、或什么，算数？",
              }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
