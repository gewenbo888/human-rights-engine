"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLang, T, t } from "./lang";
import { META_AXES, MetaAxis, EPOCHS, Epoch } from "./content";

/* ─── design tokens (inline, no Tailwind custom-class deps) ─── */
const VOID = "#070a12";
const VOID800 = "#0f1626";
const VOID700 = "#172033";
const VOID600 = "#212c44";
const LIBERTY500 = "#4f9cf0";
const LIBERTY400 = "#74b4f6";
const LIBERTY300 = "#a6d0fb";
const DIGNITY500 = "#e9b54e";
const DIGNITY400 = "#f3c976";
const DIGNITY300 = "#fadfa6";
const JUSTICE400 = "#6cd9c8";
const JUSTICE300 = "#9fe9dd";
const BONE50 = "#f3f7fd";
const BONE300 = "#bcc8de";
const BONE500 = "#7f8db0";

/* axis colour wheel – cycling through liberty/dignity/justice/power etc. */
const AXIS_COLORS = [
  DIGNITY400,   // dignity
  LIBERTY400,   // institutions
  JUSTICE400,   // legal
  LIBERTY300,   // freedom
  DIGNITY300,   // economic
  JUSTICE300,   // information
  "#ec7d8d",    // antipower (power-400)
];

/* stability bands */
type Band = { min: number; max: number; en: string; zh: string; color: string };
const BANDS: Band[] = [
  { min: 0,  max: 39, en: "Fragile",   zh: "脆弱",  color: "#ec7d8d" },
  { min: 40, max: 64, en: "Contested", zh: "受争",  color: DIGNITY400 },
  { min: 65, max: 100, en: "Resilient", zh: "稳健", color: JUSTICE400 },
];

/* default "free design" values */
const DEFAULT_SCORES = [72, 65, 70, 68, 60, 62, 66];

/* ─── composite score: mean penalised by weakest axis ─── */
function compositeScore(scores: number[]): number {
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const weakest = Math.min(...scores);
  // penalty = (mean - weakest) * 0.28  →  drags toward weakest
  return Math.round(mean - (mean - weakest) * 0.28);
}

function getBand(score: number): Band {
  return BANDS.find(b => score >= b.min && score <= b.max) ?? BANDS[0];
}

/* ─── SVG radar maths ─── */
const N = META_AXES.length; // 7
const CX = 200;
const CY = 200;
const R_MAX = 155;
const LABEL_R = 178;

function polarToXY(angle: number, r: number): [number, number] {
  // Start at top (-π/2), rotate CW
  const rad = (angle * Math.PI) / 180 - Math.PI / 2;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function spokeAngle(i: number): number {
  return (360 / N) * i;
}

function scoreToRadius(score: number): number {
  return (score / 100) * R_MAX;
}

function buildPolygon(scores: number[]): string {
  return scores
    .map((s, i) => {
      const [x, y] = polarToXY(spokeAngle(i), scoreToRadius(s));
      return `${x},${y}`;
    })
    .join(" ");
}

/* ─── animated interpolation hook ─── */
function useAnimatedScores(target: number[]): number[] {
  const [display, setDisplay] = useState<number[]>(target);
  const frameRef = useRef<number | null>(null);
  const prevRef = useRef<number[]>(target);

  useEffect(() => {
    const from = prevRef.current.slice();
    const to = target.slice();
    const startTime = performance.now();
    const DURATION = 480;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const t = 1 - Math.pow(1 - progress, 3);
      const interp = from.map((f, i) => f + (to[i] - f) * t);
      setDisplay(interp);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = to.slice();
      }
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target.join(",")]); // eslint-disable-line

  return display;
}

/* ─── component ─── */
export default function RightsStabilityModel() {
  const { lang } = useLang();

  const [scores, setScores] = useState<number[]>(DEFAULT_SCORES);
  const [selectedEpoch, setSelectedEpoch] = useState<Epoch | null>(null);
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const [selectedAxis, setSelectedAxis] = useState<number | null>(null);
  const [mode, setMode] = useState<"free" | string>("free");

  const displayScores = useAnimatedScores(scores);
  const score = compositeScore(scores);
  const band = getBand(score);
  const displayScore = Math.round(compositeScore(displayScores));
  const displayBand = getBand(displayScore);

  /* preset load */
  const loadEpoch = useCallback((epoch: Epoch) => {
    setScores(epoch.scores.slice());
    setSelectedEpoch(epoch);
    setMode(epoch.id);
  }, []);

  const resetFree = useCallback(() => {
    setScores(DEFAULT_SCORES.slice());
    setSelectedEpoch(null);
    setMode("free");
  }, []);

  /* slider change → exit preset mode */
  const handleSlider = useCallback((i: number, val: number) => {
    setScores(prev => {
      const next = prev.slice();
      next[i] = val;
      return next;
    });
    setSelectedEpoch(null);
    setMode("free");
  }, []);

  /* active detail panel: hovered > selected > null */
  const activeAxis = hoveredAxis ?? selectedAxis;

  /* rings */
  const rings = [20, 40, 60, 80, 100];

  /* label positions – pushed slightly outward for clearance */
  const labelPositions = META_AXES.map((_, i) => {
    const ang = spokeAngle(i);
    const [x, y] = polarToXY(ang, LABEL_R + 8);
    return { x, y, ang };
  });

  return (
    <div className="w-full">
      {/* ── header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label-mono mb-1">
            <T v={{ en: "Meta-model · 7 axes", zh: "元模型 · 七轴" }} />
          </p>
          <h2 className="display text-2xl sm:text-3xl glow-text leading-tight">
            <T v={{ en: "Human Rights Stability", zh: "人权稳定性" }} />
          </h2>
        </div>
        {/* composite score badge */}
        <div
          className="card rounded-xl px-5 py-3 text-center min-w-[108px]"
          style={{ borderColor: displayBand.color + "55" }}
        >
          <div
            className="text-4xl font-mono font-semibold leading-none"
            style={{ color: displayBand.color, textShadow: `0 0 22px ${displayBand.color}88` }}
          >
            {displayScore}
          </div>
          <div className="mt-1 text-xs font-mono" style={{ color: displayBand.color }}>
            {lang === "zh" ? displayBand.zh : displayBand.en}
          </div>
        </div>
      </div>

      {/* ── indivisibility note ── */}
      <p className="text-xs text-bone-500 mb-5 max-w-xl leading-relaxed" style={{ color: BONE500 }}>
        <T v={{
          en: "Score is the mean penalised by the weakest axis — a chain is as strong as its weakest link.",
          zh: "分值为均值经最弱轴修正——链条的强度取决于最弱的一环。"
        }} />
      </p>

      {/* ── main layout: radar + sliders ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── radar SVG ── */}
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
          <svg
            viewBox="0 0 400 400"
            width="100%"
            style={{ maxWidth: 420 }}
            role="img"
            aria-label={lang === "zh" ? "人权稳定性雷达图" : "Human Rights Stability radar chart"}
          >
            <defs>
              {/* gradient fill for polygon */}
              <radialGradient id="poly-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={DIGNITY400} stopOpacity="0.22" />
                <stop offset="70%" stopColor={LIBERTY500} stopOpacity="0.16" />
                <stop offset="100%" stopColor={LIBERTY500} stopOpacity="0.04" />
              </radialGradient>
              <radialGradient id="poly-fill-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={DIGNITY400} stopOpacity="0.08" />
                <stop offset="100%" stopColor={LIBERTY500} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ── background void ── */}
            <circle cx={CX} cy={CY} r={R_MAX + 24} fill={VOID800} opacity={0.6} />

            {/* ── concentric rings ── */}
            {rings.map(pct => (
              <polygon
                key={pct}
                points={META_AXES.map((_, i) => {
                  const [x, y] = polarToXY(spokeAngle(i), (pct / 100) * R_MAX);
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke={VOID600}
                strokeWidth={0.8}
              />
            ))}

            {/* ── ring labels (20 40 60 80) ── */}
            {[20, 40, 60, 80].map(pct => {
              const [x, y] = polarToXY(0, (pct / 100) * R_MAX);
              return (
                <text
                  key={pct}
                  x={x + 4}
                  y={y - 2}
                  fontSize={8}
                  fill={BONE500}
                  opacity={0.5}
                  fontFamily="IBM Plex Mono"
                >
                  {pct}
                </text>
              );
            })}

            {/* ── spokes ── */}
            {META_AXES.map((_, i) => {
              const [x, y] = polarToXY(spokeAngle(i), R_MAX);
              const isActive = activeAxis === i;
              return (
                <line
                  key={i}
                  x1={CX} y1={CY} x2={x} y2={y}
                  stroke={isActive ? AXIS_COLORS[i] : VOID600}
                  strokeWidth={isActive ? 1.4 : 0.8}
                  opacity={isActive ? 1 : 0.7}
                  style={{ transition: "stroke 0.25s, opacity 0.25s" }}
                />
              );
            })}

            {/* ── polygon glow layer (behind) ── */}
            <polygon
              points={buildPolygon(displayScores)}
              fill="url(#poly-fill-glow)"
              stroke="none"
              style={{ transition: "points 0.05s linear" }}
            />

            {/* ── main polygon ── */}
            <polygon
              points={buildPolygon(displayScores)}
              fill="url(#poly-fill)"
              stroke={LIBERTY400}
              strokeWidth={1.8}
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 8px ${LIBERTY500}88)`,
                transition: "points 0.05s linear",
              }}
            />

            {/* ── axis dots at current value ── */}
            {displayScores.map((s, i) => {
              const [x, y] = polarToXY(spokeAngle(i), scoreToRadius(s));
              const isActive = activeAxis === i;
              return (
                <circle
                  key={i}
                  cx={x} cy={y} r={isActive ? 5 : 3.5}
                  fill={AXIS_COLORS[i]}
                  stroke={VOID}
                  strokeWidth={1}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 6px ${AXIS_COLORS[i]})` : "none",
                    transition: "r 0.2s, filter 0.2s",
                  }}
                />
              );
            })}

            {/* ── axis labels ── */}
            {META_AXES.map((ax, i) => {
              const { x, y, ang } = labelPositions[i];
              const isActive = activeAxis === i;
              // text-anchor based on angle quadrant
              let textAnchor: "start" | "middle" | "end" = "middle";
              const normAng = ((ang % 360) + 360) % 360;
              if (normAng > 15 && normAng < 165) textAnchor = "start";
              else if (normAng > 195 && normAng < 345) textAnchor = "end";

              return (
                <g
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedAxis(selectedAxis === i ? null : i)}
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  role="button"
                  aria-pressed={selectedAxis === i}
                  aria-label={t(ax.short, lang)}
                >
                  <circle
                    cx={x} cy={y} r={18}
                    fill="transparent"
                  />
                  <text
                    x={x} y={y}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    fontSize={lang === "zh" ? 11 : 10}
                    fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace"}
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? AXIS_COLORS[i] : BONE300}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 5px ${AXIS_COLORS[i]})` : "none",
                      transition: "fill 0.2s, filter 0.2s",
                    }}
                  >
                    {t(ax.short, lang)}
                  </text>
                </g>
              );
            })}

            {/* ── centre score ── */}
            <text
              x={CX} y={CY - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={28}
              fontFamily="IBM Plex Mono, monospace"
              fontWeight={700}
              fill={displayBand.color}
              style={{ filter: `drop-shadow(0 0 12px ${displayBand.color}88)` }}
            >
              {displayScore}
            </text>
            <text
              x={CX} y={CY + 14}
              textAnchor="middle"
              fontSize={9}
              fontFamily={lang === "zh" ? "Noto Serif SC" : "IBM Plex Mono"}
              fill={displayBand.color}
              opacity={0.8}
            >
              {lang === "zh" ? displayBand.zh : displayBand.en}
            </text>
          </svg>
        </div>

        {/* ── right panel: sliders + detail ── */}
        <div className="flex-1 min-w-0 w-full space-y-3">

          {/* active axis detail */}
          {activeAxis !== null && (
            <div
              className="card rounded-xl p-4 rise mb-4"
              style={{ borderColor: AXIS_COLORS[activeAxis] + "44" }}
              key={activeAxis}
            >
              <p
                className="label-mono mb-1"
                style={{ color: AXIS_COLORS[activeAxis] }}
              >
                {t(META_AXES[activeAxis].label, lang)}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: BONE300 }}>
                {t(META_AXES[activeAxis].desc, lang)}
              </p>
            </div>
          )}

          {/* sliders */}
          <div className="space-y-3">
            {META_AXES.map((ax, i) => {
              const isActive = activeAxis === i;
              const val = scores[i];
              return (
                <div
                  key={ax.id}
                  className="group"
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <button
                      className="text-left text-xs leading-none transition-all duration-200"
                      style={{
                        color: isActive ? AXIS_COLORS[i] : BONE300,
                        fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                        textShadow: isActive ? `0 0 8px ${AXIS_COLORS[i]}` : "none",
                      }}
                      onClick={() => setSelectedAxis(selectedAxis === i ? null : i)}
                      aria-pressed={selectedAxis === i}
                    >
                      {t(ax.label, lang)}
                    </button>
                    <span
                      className="text-xs font-mono ml-2 tabular-nums"
                      style={{ color: AXIS_COLORS[i], minWidth: 28, textAlign: "right" }}
                    >
                      {val}
                    </span>
                  </div>
                  <div className="relative">
                    {/* filled track background */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
                      style={{
                        width: `${val}%`,
                        background: `linear-gradient(90deg, ${AXIS_COLORS[i]}33, ${AXIS_COLORS[i]}66)`,
                        height: 3,
                        top: "50%",
                        transform: "translateY(-50%)",
                        transition: "width 0.08s",
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={e => handleSlider(i, Number(e.target.value))}
                      className="w-full relative"
                      style={{
                        accentColor: AXIS_COLORS[i],
                      }}
                      aria-label={t(ax.label, lang)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── epoch presets ── */}
      <div className="mt-8">
        <div className="rule-warm mb-5" />
        <p className="label-mono mb-4">
          <T v={{ en: "Load historical preset", zh: "加载历史预设" }} />
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetFree}
            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
            aria-pressed={mode === "free"}
            style={{
              background: mode === "free" ? VOID600 : "transparent",
              border: `1px solid ${mode === "free" ? LIBERTY400 + "88" : VOID600}`,
              color: mode === "free" ? LIBERTY300 : BONE500,
            }}
          >
            <T v={{ en: "Free design", zh: "自由设计" }} />
          </button>
          {EPOCHS.map(ep => (
            <button
              key={ep.id}
              onClick={() => loadEpoch(ep)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
              aria-pressed={mode === ep.id}
              style={{
                fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                background: mode === ep.id ? VOID700 : "transparent",
                border: `1px solid ${mode === ep.id ? DIGNITY400 + "88" : VOID600}`,
                color: mode === ep.id ? DIGNITY300 : BONE500,
              }}
            >
              {t(ep.label, lang)}
            </button>
          ))}
        </div>

        {/* selected epoch note */}
        {selectedEpoch && (
          <div
            className="card rounded-xl p-5 mt-4 rise max-w-2xl"
            key={selectedEpoch.id}
          >
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span
                className="label-mono"
                style={{ color: DIGNITY400 }}
              >
                {t(selectedEpoch.label, lang)}
              </span>
              <span className="text-xs" style={{ color: BONE500 }}>
                {t(selectedEpoch.sub, lang)}
              </span>
              <span
                className="ml-auto text-sm font-mono tabular-nums"
                style={{ color: getBand(score).color }}
              >
                {lang === "zh" ? "稳定分" : "stability"} {score}
                {" · "}
                {lang === "zh" ? getBand(score).zh : getBand(score).en}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: BONE300,
                fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "Spectral, serif",
              }}
            >
              {t(selectedEpoch.note, lang)}
            </p>
          </div>
        )}
      </div>

      {/* ── bands legend ── */}
      <div className="mt-6 flex flex-wrap gap-4">
        {BANDS.map(b => (
          <div key={b.en} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: b.color, boxShadow: `0 0 6px ${b.color}` }}
            />
            <span className="text-xs font-mono" style={{ color: b.color }}>
              {lang === "zh" ? b.zh : b.en}
            </span>
            <span className="text-xs font-mono" style={{ color: BONE500 }}>
              {b.min}–{b.max}
            </span>
          </div>
        ))}
        <span className="text-xs ml-auto" style={{ color: BONE500 }}>
          <T v={{ en: "Click an axis label to pin details", zh: "点击轴标签以固定详情" }} />
        </span>
      </div>
    </div>
  );
}
