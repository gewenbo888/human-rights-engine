"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { APPROACHES, Approach } from "./content";

/* ─── Spectrum position for each approach (0 = full negative, 100 = full positive) ─── */
const SPECTRUM_POS: Record<string, number> = {
  liberal: 18,
  socialist: 82,
  communitarian: 38,
  hybrid: 50,
};

/* ─── Pole colors ─── */
const LIBERTY_COLOR = "#4f9cf0";
const PROVISION_COLOR = "#e9b54e";
const JUSTICE_COLOR = "#3fc4b0";
const POWER_COLOR = "#e0556b";

/* ─── Slider readout by region ─── */
type SliderZone = "far-neg" | "mid-neg" | "center" | "mid-pos" | "far-pos";

function sliderZone(v: number): SliderZone {
  if (v < 18) return "far-neg";
  if (v < 38) return "mid-neg";
  if (v < 62) return "center";
  if (v < 82) return "mid-pos";
  return "far-pos";
}

const ZONE_READOUT: Record<SliderZone, { color: string; en: string; zh: string }> = {
  "far-neg": {
    color: LIBERTY_COLOR,
    en: "Free to speak — perhaps unable to live. Negative rights guard conscience but leave need unaddressed.",
    zh: "有言论之自由，却或许无法活命。消极权利守护良心，却让匮乏无人应对。",
  },
  "mid-neg": {
    color: "#7ab8f5",
    en: "Civil freedoms are strong; basic provisions exist but remain secondary claims, not guaranteed rights.",
    zh: "公民自由强健；基本供给虽存，却仍是次要主张，而非有保障的权利。",
  },
  center: {
    color: JUSTICE_COLOR,
    en: "The uneasy hybrid most real societies attempt — forever negotiating where freedom ends and provision begins.",
    zh: "多数真实社会尝试的、不安的混合——永远在商议自由在何处终止，供给在何处开始。",
  },
  "mid-pos": {
    color: "#d4a94a",
    en: "Broad social guarantees; civil and political freedoms are recognised but balanced against collective provision.",
    zh: "广泛的社会保障；公民与政治自由虽获承认，却须与集体供给相权衡。",
  },
  "far-pos": {
    color: PROVISION_COLOR,
    en: "Provided for — perhaps unable to dissent. Positive rights secure material life but may crowd out political voice.",
    zh: "衣食得保，却或许不能异议。积极权利保障物质生活，却可能挤占政治发声。",
  },
};

/* ─── Tick positions on the spectrum ─── */
const APPROACH_ORDER = ["liberal", "communitarian", "hybrid", "socialist"];

export default function RightsLadder() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>("hybrid");
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);

  const active = APPROACHES.find((a) => a.id === activeId) ?? APPROACHES[0];

  /* ─── Spectrum SVG responsive sizing ─── */
  const specContainerRef = useRef<HTMLDivElement>(null);
  const [specW, setSpecW] = useState(520);
  useEffect(() => {
    const el = specContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSpecW(entry.contentRect.width || 520);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const specH = 80;
  const specPadX = 24;
  const trackW = specW - specPadX * 2;
  const sliderX = specPadX + (sliderVal / 100) * trackW;

  /* ─── Drag handling ─── */
  const trackRef = useRef<SVGRectElement>(null);

  const computeVal = useCallback(
    (clientX: number): number => {
      const el = specContainerRef.current;
      if (!el) return sliderVal;
      const rect = el.getBoundingClientRect();
      const raw = (clientX - rect.left - specPadX) / trackW;
      return Math.round(Math.min(100, Math.max(0, raw * 100)));
    },
    [trackW, sliderVal, specPadX]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGElement>) => {
    setIsDragging(true);
    setSliderVal(computeVal(e.clientX));
    (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (!isDragging) return;
    setSliderVal(computeVal(e.clientX));
  };
  const handlePointerUp = () => setIsDragging(false);

  const zone = sliderZone(sliderVal);
  const readout = ZONE_READOUT[zone];

  /* ─── Tab selection also moves slider ─── */
  const handleTabClick = (id: string) => {
    setActiveId(id);
    setSliderVal(SPECTRUM_POS[id] ?? 50);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="label-mono mb-1" style={{ color: JUSTICE_COLOR }}>
          <T v={{ en: "Economic & Social Rights · A Fair Comparison", zh: "经济权利与社会权利 · 公平比较" }} />
        </p>
        <h3 className="display text-xl text-bone-100">
          <T v={{ en: "Four Approaches to What a Right Is", zh: "关于「权利是什么」的四种立场" }} />
        </h3>
        <p className="mt-1 text-sm text-bone-500">
          <T
            v={{
              en: "Each tradition has a real strength and a real cost. Select one to read; drag the spectrum to explore the tension.",
              zh: "每一种传统都有真实的优势与真实的代价。选择一项以阅读；拖动光谱以探索张力。",
            }}
          />
        </p>
      </div>

      {/* Approach tabs */}
      <div
        className="mb-5 grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
        role="tablist"
        aria-label={t({ en: "Rights approach tabs", zh: "权利立场标签" }, lang)}
      >
        {APPROACHES.map((a) => {
          const isActive = a.id === activeId;
          const pos = SPECTRUM_POS[a.id];
          const blend = pos / 100;
          // Color by position on spectrum: left=liberty-blue, right=dignity-gold
          const r = Math.round(79 + (233 - 79) * blend);
          const g = Math.round(156 + (181 - 156) * blend);
          const b = Math.round(240 + (78 - 240) * blend);
          const accent = `rgb(${r},${g},${b})`;

          return (
            <button
              key={a.id}
              role="tab"
              aria-pressed={isActive}
              aria-selected={isActive}
              onClick={() => handleTabClick(a.id)}
              className="rounded-lg border px-3 py-2.5 text-left transition-all duration-300"
              style={{
                borderColor: isActive ? `${accent}88` : "rgba(79,156,240,0.14)",
                background: isActive
                  ? `linear-gradient(135deg, rgba(${r},${g},${b},0.1), rgba(10,15,28,0.95))`
                  : "rgba(10,15,28,0.55)",
                boxShadow: isActive ? `0 0 18px rgba(${r},${g},${b},0.12)` : "none",
              }}
            >
              <span
                className={`block text-xs font-mono font-semibold tracking-widest lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`tab-label-${lang}-${a.id}`}
                style={{ color: isActive ? accent : "rgba(127,141,176,0.7)" }}
              >
                {a.label[lang]}
              </span>
              <span
                className={`mt-1 block text-[0.7rem] leading-snug lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`tab-thesis-${lang}-${a.id}`}
                style={{ color: isActive ? "rgba(188,200,222,0.9)" : "rgba(127,141,176,0.5)" }}
              >
                {a.thesis[lang]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active approach detail */}
      {active && (
        <div
          className="mb-5 rounded-lg border transition-all duration-500 rise"
          style={{
            borderColor: "rgba(63,196,176,0.2)",
            background: "linear-gradient(150deg, rgba(15,22,38,0.9), rgba(10,15,28,0.95))",
          }}
        >
          {/* Thesis */}
          <div className="border-b border-void-700/60 px-4 pt-4 pb-3">
            <p className="label-mono mb-1 text-[0.65rem]" style={{ color: "rgba(127,141,176,0.6)" }}>
              <T v={{ en: "THESIS · 核心主张", zh: "THESIS · 核心主张" }} />
            </p>
            <p
              className={`text-sm leading-relaxed text-bone-200 lang-fade ${lang === "zh" ? "zh" : ""}`}
              key={`thesis-${lang}-${active.id}`}
            >
              {active.thesis[lang]}
            </p>
          </div>

          {/* Strength + Tension — side by side */}
          <div className="grid gap-0 sm:grid-cols-2">
            {/* Strength */}
            <div
              className="px-4 py-3 sm:border-r"
              style={{ borderColor: "rgba(33,44,68,0.8)" }}
            >
              <p className="label-mono mb-1.5 text-[0.65rem]" style={{ color: JUSTICE_COLOR }}>
                <T v={{ en: "WHAT IT PROTECTS · 它保护什么", zh: "WHAT IT PROTECTS · 它保护什么" }} />
              </p>
              <p
                className={`text-sm leading-relaxed lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`strength-${lang}-${active.id}`}
                style={{ color: "#9fe9dd" }}
              >
                {active.strength[lang]}
              </p>
            </div>
            {/* Tension */}
            <div className="px-4 py-3">
              <p className="label-mono mb-1.5 text-[0.65rem]" style={{ color: POWER_COLOR }}>
                <T v={{ en: "ITS BLIND SPOT · 它的盲点", zh: "ITS BLIND SPOT · 它的盲点" }} />
              </p>
              <p
                className={`text-sm leading-relaxed lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`tension-${lang}-${active.id}`}
                style={{ color: "#ec8d9a" }}
              >
                {active.tension[lang]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Spectrum: Freedom FROM power ←→ Freedom FROM need ─── */}
      <div className="mb-2">
        <div className="mb-2 flex items-center justify-between text-[0.65rem] font-mono tracking-wider">
          <span style={{ color: LIBERTY_COLOR }}>
            <T v={{ en: "← FREEDOM FROM POWER", zh: "← 免于权力的自由" }} />
          </span>
          <span style={{ color: PROVISION_COLOR }}>
            <T v={{ en: "FREEDOM FROM NEED →", zh: "免于匮乏的自由 →" }} />
          </span>
        </div>

        {/* SVG track */}
        <div ref={specContainerRef} className="w-full touch-none select-none">
          <svg
            width={specW}
            height={specH}
            viewBox={`0 0 ${specW} ${specH}`}
            className="w-full overflow-visible"
            style={{ display: "block", cursor: isDragging ? "grabbing" : "grab" }}
            aria-label={t({ en: "Rights spectrum slider", zh: "权利光谱滑块" }, lang)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <linearGradient id="rl-track-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={LIBERTY_COLOR} stopOpacity="0.6" />
                <stop offset="50%" stopColor={JUSTICE_COLOR} stopOpacity="0.55" />
                <stop offset="100%" stopColor={PROVISION_COLOR} stopOpacity="0.6" />
              </linearGradient>
              <filter id="rl-thumb-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track background */}
            <rect
              x={specPadX} y={36}
              width={trackW} height={8}
              rx="4"
              fill="rgba(15,22,38,0.8)"
              stroke="rgba(79,156,240,0.1)"
              strokeWidth="1"
            />
            {/* Track fill */}
            <rect
              x={specPadX} y={36}
              width={trackW} height={8}
              rx="4"
              fill="url(#rl-track-grad)"
              opacity="0.7"
            />

            {/* Approach tick marks */}
            {APPROACHES.map((a) => {
              const tx = specPadX + (SPECTRUM_POS[a.id] / 100) * trackW;
              const isThis = a.id === activeId;
              return (
                <g key={a.id}>
                  <line
                    x1={tx} y1={30}
                    x2={tx} y2={52}
                    stroke={isThis ? readout.color : "rgba(127,141,176,0.35)"}
                    strokeWidth={isThis ? 2 : 1}
                  />
                  <text
                    x={tx}
                    y={isThis ? 22 : 24}
                    textAnchor="middle"
                    fontSize={isThis ? "9.5" : "8.5"}
                    fontFamily="IBM Plex Mono, monospace"
                    fill={isThis ? readout.color : "rgba(127,141,176,0.45)"}
                    fontWeight={isThis ? "600" : "400"}
                    style={{ pointerEvents: "none" }}
                  >
                    {a.label[lang]}
                  </text>
                </g>
              );
            })}

            {/* Thumb */}
            <circle
              cx={sliderX}
              cy={40}
              r={10}
              fill={readout.color}
              fillOpacity="0.92"
              stroke="rgba(243,247,253,0.85)"
              strokeWidth="1.5"
              filter="url(#rl-thumb-glow)"
              style={{ pointerEvents: "none" }}
            />
            {/* Thumb value label */}
            <text
              x={sliderX}
              y={67}
              textAnchor="middle"
              fontSize="9"
              fontFamily="IBM Plex Mono, monospace"
              fill={readout.color}
              style={{ pointerEvents: "none" }}
            >
              {sliderVal}
            </text>
          </svg>
        </div>

        {/* Readout */}
        <div
          className="mt-2 rounded-md border px-4 py-3 transition-all duration-400 rise"
          style={{
            borderColor: `${readout.color}44`,
            background: "rgba(10,15,28,0.7)",
            minHeight: "4.5rem",
          }}
          key={zone}
        >
          <p
            className={`text-sm leading-relaxed lang-fade ${lang === "zh" ? "zh" : ""}`}
            key={`zone-readout-${lang}-${zone}`}
            style={{ color: "rgba(188,200,222,0.9)" }}
          >
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{ background: readout.color, boxShadow: `0 0 6px ${readout.color}` }}
            />
            {readout[lang]}
          </p>
        </div>
      </div>

      {/* Footer note — fairness disclaimer */}
      <p className="mt-4 text-[0.68rem] leading-relaxed text-bone-500">
        <T
          v={{
            en: "Each column reflects a live tradition in political philosophy. None is presented as correct; the aim is to understand what each protects and what it costs.",
            zh: "每一栏都呈现政治哲学中的一个活的传统。没有哪一种被呈现为正确；目的在于理解每种传统保护什么，又付出什么代价。",
          }}
        />
      </p>
    </div>
  );
}
