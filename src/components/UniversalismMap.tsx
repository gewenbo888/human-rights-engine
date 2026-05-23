"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { UNIVERSALISM_AXES, ValueAxis } from "./content";

/* ─── Design tokens (inline) ─── */
const LIBERTY = "#4f9cf0";
const DIGNITY = "#e9b54e";
const JUSTICE = "#3fc4b0";
const POWER = "#e0556b";
const BONE300 = "#bcc8de";
const BONE500 = "#7f8db0";

/* ─── Axis accent colors — one per axis ─── */
const AXIS_COLORS = [LIBERTY, JUSTICE, DIGNITY, POWER];

/* ─── Preset profiles (0 = full-left, 100 = full-right per axis) ─── */
// Axis order: ind-col, lib-ord, rights-duties, universal-local
type Preset = {
  id: string;
  label: { en: string; zh: string };
  values: [number, number, number, number];
  interp: { en: string; zh: string };
};

const PRESETS: Preset[] = [
  {
    id: "individualist",
    label: {
      en: "Individualist-liberal emphasis",
      zh: "个体—自由取向",
    },
    values: [12, 15, 18, 22],
    interp: {
      en: "Strong civil and political rights for the individual; liberty takes priority over social order; personal claims over communal duties. All of this is compatible with the universal floor — no torture, no arbitrary killing, no denial of basic dignity — which remains non-negotiable.",
      zh: "为个体设置强健的公民与政治权利；自由优先于社会秩序；个人主张优先于共同义务。这一切均与普遍底线相容——不施酷刑、不任意杀害、不剥夺基本尊严——该底线仍不可商量。",
    },
  },
  {
    id: "collective",
    label: {
      en: "Collective-harmony emphasis",
      zh: "集体—和谐取向",
    },
    values: [78, 72, 74, 68],
    interp: {
      en: "The community and its continuity are placed above the isolated individual; social harmony and duty are foregrounded. This is a genuine moral emphasis in many traditions — and is distinct from using 'harmony' as cover to suppress dissent and deny the universal floor to one's own people.",
      zh: "社群及其延续被置于孤立个体之上；社会和谐与义务被置于首位。这是许多传统中一种真实的道德取向——并不同于以「和谐」为名压制异见、把普遍底线否认于本国人民。",
    },
  },
  {
    id: "duty-order",
    label: {
      en: "Duty-and-order emphasis",
      zh: "义务—秩序取向",
    },
    values: [58, 80, 78, 52],
    interp: {
      en: "Order is the precondition for any liberty at all; duties to the whole precede individual claims. This can coexist with robust protections where the state itself is bound by law — the danger is when 'order' becomes code for unaccountable power, and duty is owed only upward.",
      zh: "秩序是一切自由得以可能的前提；对整体的义务先于个人主张。若国家本身受法律约束，这可与强健的保护共存——危险在于，「秩序」成为无从问责之权力的代名词，而义务只是向上单向流动。",
    },
  },
  {
    id: "universal-floor",
    label: {
      en: "Universalist floor",
      zh: "普遍主义底线",
    },
    values: [34, 38, 30, 10],
    interp: {
      en: "The shared minimum: however traditions differ in their architecture above, the floor — no torture, no arbitrary killing, no denial of basic personhood — is owed to every human being. This floor was recognised across cultures long before the Universal Declaration named it.",
      zh: "共享的最低限度：无论各传统在其上方的架构如何不同，底线——不施酷刑、不任意杀害、不剥夺基本人格——亏欠于每一个人。这道底线，早在《世界人权宣言》为其命名之前，便已在各文化中获得承认。",
    },
  },
];

/* ─── Compute a free interpretation from current slider values ─── */
function interpretValues(
  vals: [number, number, number, number],
  lang: "en" | "zh"
): string {
  // Detect if close to a preset (±15 per axis)
  for (const p of PRESETS) {
    const diff = p.values.reduce((acc, v, i) => acc + Math.abs(v - vals[i]), 0);
    if (diff < 50) return p.interp[lang];
  }
  // Generic description: read the dominant poles
  const [ic, lo, rd, ul] = vals;
  const enParts: string[] = [];
  const zhParts: string[] = [];
  if (ic < 40) {
    enParts.push("individual-centred");
    zhParts.push("以个体为中心");
  } else if (ic > 60) {
    enParts.push("community-centred");
    zhParts.push("以社群为中心");
  } else {
    enParts.push("balanced individual–collective");
    zhParts.push("个体与集体之间的平衡");
  }
  if (lo < 40) {
    enParts.push("liberty-first");
    zhParts.push("自由优先");
  } else if (lo > 60) {
    enParts.push("order-first");
    zhParts.push("秩序优先");
  }
  if (rd < 40) {
    enParts.push("rights-leading");
    zhParts.push("权利主导");
  } else if (rd > 60) {
    enParts.push("duty-leading");
    zhParts.push("义务主导");
  }
  if (ul > 60) {
    enParts.push("rooted in particular tradition");
    zhParts.push("植根于特殊传统");
  } else if (ul < 40) {
    enParts.push("universalist orientation");
    zhParts.push("普遍主义取向");
  }
  const suffix =
    lang === "en"
      ? ". In any position, the universal floor — no torture, no arbitrary killing, basic dignity — remains non-negotiable."
      : "。无论何种立场，普遍底线——不施酷刑、不任意杀害、基本尊严——始终不可商量。";
  const core = lang === "en" ? enParts.join(", ") : zhParts.join("、");
  return (lang === "en" ? "A profile that is " : "一种") + core + suffix;
}

/* ─── Radar (spider chart) ─── */
function RadarChart({
  values,
  axes,
  size,
  lang,
}: {
  values: [number, number, number, number];
  axes: ValueAxis[];
  size: number;
  lang: "en" | "zh";
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const N = axes.length;
  const angleOf = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Data polygon
  const dataPoints = values.map((v, i) => {
    const angle = angleOf(i);
    const ratio = v / 100;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  });
  const dataPath =
    "M" +
    dataPoints.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" L") +
    " Z";

  // Axis endpoints (outer)
  const outerPts = Array.from({ length: N }, (_, i) => ({
    x: cx + r * Math.cos(angleOf(i)),
    y: cy + r * Math.sin(angleOf(i)),
  }));

  // Label positions (slightly beyond outer)
  const labelR = r * 1.22;
  const labelPts = Array.from({ length: N }, (_, i) => ({
    x: cx + labelR * Math.cos(angleOf(i)),
    y: cy + labelR * Math.sin(angleOf(i)),
  }));

  const LABELS_LEFT = ["Individual\n个体", "Liberty\n自由", "Rights\n权利", "Universal\n普遍"];
  const LABELS_RIGHT = ["Collective\n集体", "Order\n秩序", "Duties\n义务", "Particular\n特殊"];

  // For each axis i: if value < 50 → closer to left pole, else → closer to right pole
  const axisLabels = axes.map((ax, i) => {
    const v = values[i];
    const leftLabel = ax.left[lang];
    const rightLabel = ax.right[lang];
    const dominant = v < 50 ? leftLabel : rightLabel;
    const dominantRatio = v < 50 ? (50 - v) / 50 : (v - 50) / 50;
    return { dominant, dominantRatio, leftLabel, rightLabel };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full"
      style={{ display: "block" }}
      aria-label={t({ en: "Civilisation profile radar", zh: "文明剖面雷达图" }, lang)}
    >
      <defs>
        <radialGradient id="um-radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={JUSTICE} stopOpacity="0.35" />
          <stop offset="100%" stopColor={LIBERTY} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      {/* Grid rings */}
      {rings.map((rr, ri) => {
        const ringPts = Array.from({ length: N }, (_, i) => ({
          x: cx + r * rr * Math.cos(angleOf(i)),
          y: cy + r * rr * Math.sin(angleOf(i)),
        }));
        const d =
          "M" +
          ringPts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" L") +
          " Z";
        return (
          <path
            key={ri}
            d={d}
            fill="none"
            stroke="rgba(79,156,240,0.1)"
            strokeWidth="1"
            strokeDasharray={ri === rings.length - 1 ? "none" : "2 4"}
          />
        );
      })}
      {/* Axis spokes */}
      {outerPts.map((pt, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={pt.x} y2={pt.y}
          stroke={AXIS_COLORS[i]}
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      ))}
      {/* Data polygon fill */}
      <path d={dataPath} fill="url(#um-radar-fill)" stroke={JUSTICE} strokeWidth="1.8" strokeOpacity="0.75" />
      {/* Data vertices */}
      {dataPoints.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x} cy={pt.y}
          r={4}
          fill={AXIS_COLORS[i]}
          stroke="rgba(7,10,18,0.8)"
          strokeWidth="1.5"
        />
      ))}
      {/* Axis labels: left pole bottom-left, right pole bottom-right */}
      {axes.map((ax, i) => {
        const lp = labelPts[i];
        const angle = angleOf(i) * (180 / Math.PI);
        // Anchor: if x > cx → start, else end, else middle
        const anchor =
          lp.x > cx + 10 ? "start" : lp.x < cx - 10 ? "end" : "middle";

        // Show left/right pole label based on which is closer
        const leftFrac = values[i] / 100; // 0 = full left
        const leftOpacity = 0.35 + 0.65 * (1 - leftFrac);
        const rightOpacity = 0.35 + 0.65 * leftFrac;

        return (
          <g key={i}>
            {/* Left pole label (at the negative/start of axis — but we draw at spoke tip since 0=left means short spoke) */}
            {/* We instead label both poles of each axis at fixed positions */}
            <text
              x={lp.x} y={lp.y}
              textAnchor={anchor}
              fontSize="8.5"
              fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace"}
              fill={AXIS_COLORS[i]}
              opacity="0.75"
            >
              {/* Show the dominant label */}
              {values[i] < 50 ? ax.left[lang] : ax.right[lang]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Single axis slider ─── */
function AxisSlider({
  axis,
  value,
  color,
  onChange,
  lang,
}: {
  axis: ValueAxis;
  value: number;
  color: string;
  onChange: (v: number) => void;
  lang: "en" | "zh";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const computeVal = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const raw = (clientX - rect.left) / rect.width;
      return Math.round(Math.min(100, Math.max(0, raw * 100)));
    },
    [value]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    onChange(computeVal(e.clientX));
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onChange(computeVal(e.clientX));
  };
  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const pct = value;

  return (
    <div className="mb-4">
      {/* Pole labels */}
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className={`text-xs font-mono tracking-wide lang-fade ${lang === "zh" ? "zh" : ""}`}
          key={`left-${lang}-${axis.id}`}
          style={{ color: value <= 50 ? color : BONE500, transition: "color 0.3s" }}
        >
          {axis.left[lang]}
        </span>
        <span
          className={`text-xs font-mono tracking-wide lang-fade ${lang === "zh" ? "zh" : ""}`}
          key={`right-${lang}-${axis.id}`}
          style={{ color: value >= 50 ? color : BONE500, transition: "color 0.3s" }}
        >
          {axis.right[lang]}
        </span>
      </div>
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-3 cursor-grab touch-none select-none rounded-full active:cursor-grabbing"
        style={{
          background: "rgba(15,22,38,0.8)",
          border: "1px solid rgba(79,156,240,0.12)",
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`${axis.left[lang]} ↔ ${axis.right[lang]}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Fill from center */}
        {value < 50 ? (
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              right: "50%",
              width: `${50 - pct}%`,
              background: `linear-gradient(to left, ${color}80, ${color}30)`,
            }}
          />
        ) : (
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              left: "50%",
              width: `${pct - 50}%`,
              background: `linear-gradient(to right, ${color}80, ${color}30)`,
            }}
          />
        )}
        {/* Center tick */}
        <div
          className="absolute top-0 h-full w-px"
          style={{ left: "50%", background: "rgba(127,141,176,0.25)" }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${pct}%`,
            background: color,
            border: "2px solid rgba(243,247,253,0.8)",
            boxShadow: `0 0 10px ${color}88`,
            transition: isDragging.current ? "none" : "left 0.15s",
          }}
        />
      </div>
      {/* Axis note */}
      <p
        className={`mt-1 text-[0.68rem] leading-snug lang-fade ${lang === "zh" ? "zh" : ""}`}
        key={`note-${lang}-${axis.id}`}
        style={{ color: "rgba(127,141,176,0.5)" }}
      >
        {axis.note[lang]}
      </p>
    </div>
  );
}

export default function UniversalismMap() {
  const { lang } = useLang();

  // Four axis values: [ind-col, lib-ord, rights-duties, universal-local]
  const [values, setValues] = useState<[number, number, number, number]>([
    34, 38, 30, 10,
  ]);
  const [activePreset, setActivePreset] = useState<string | null>("universal-floor");

  const updateAxis = (i: number, v: number) => {
    setValues((prev) => {
      const next = [...prev] as [number, number, number, number];
      next[i] = v;
      return next;
    });
    setActivePreset(null);
  };

  const applyPreset = (p: Preset) => {
    setValues([...p.values] as [number, number, number, number]);
    setActivePreset(p.id);
  };

  const interpretation = interpretValues(values, lang);

  /* ─── Radar size ─── */
  const radarContainerRef = useRef<HTMLDivElement>(null);
  const [radarSize, setRadarSize] = useState(220);
  useEffect(() => {
    const el = radarContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setRadarSize(Math.max(160, Math.min(260, w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="label-mono mb-1" style={{ color: DIGNITY }}>
          <T v={{ en: "Universalism vs Cultural Difference", zh: "普遍主义与文化差异" }} />
        </p>
        <h3 className="display text-xl text-bone-100">
          <T v={{ en: "How Traditions Weight the Values Differently", zh: "各传统如何以不同方式权衡价值" }} />
        </h3>
        <p className="mt-1 text-sm text-bone-500">
          <T
            v={{
              en: "Drag the sliders or choose a civilisational emphasis. The floor — no torture, no arbitrary killing, basic dignity — is universal regardless of position.",
              zh: "拖动滑块或选择一种文明取向。底线——不施酷刑、不任意杀害、基本尊严——无论立场如何，均具普遍性。",
            }}
          />
        </p>
      </div>

      {/* Two-column layout: sliders left, radar right */}
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
        {/* Sliders */}
        <div className="min-w-0 flex-1">
          {UNIVERSALISM_AXES.map((ax, i) => (
            <AxisSlider
              key={ax.id}
              axis={ax}
              value={values[i]}
              color={AXIS_COLORS[i]}
              onChange={(v) => updateAxis(i, v)}
              lang={lang}
            />
          ))}
        </div>

        {/* Radar */}
        <div
          ref={radarContainerRef}
          className="flex shrink-0 flex-col items-center justify-center"
          style={{ minWidth: 160, maxWidth: 280, width: "100%" }}
        >
          <RadarChart
            values={values}
            axes={UNIVERSALISM_AXES}
            size={radarSize}
            lang={lang}
          />
          <p className="mt-1 text-center text-[0.65rem] font-mono tracking-wider" style={{ color: BONE500 }}>
            <T v={{ en: "CIVILISATION PROFILE", zh: "文明剖面" }} />
          </p>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 mt-1">
        <p className="label-mono mb-2 text-[0.65rem]" style={{ color: BONE500 }}>
          <T v={{ en: "CIVILISATIONAL ARCHETYPES · 文明原型", zh: "CIVILISATIONAL ARCHETYPES · 文明原型" }} />
        </p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))" }}
        >
          {PRESETS.map((p, pi) => {
            const isActive = activePreset === p.id;
            const col = AXIS_COLORS[pi % AXIS_COLORS.length];
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                aria-pressed={isActive}
                className="rounded-lg border px-3 py-2 text-left transition-all duration-300"
                style={{
                  borderColor: isActive ? `${col}66` : "rgba(79,156,240,0.12)",
                  background: isActive
                    ? `rgba(15,22,38,0.9)`
                    : "rgba(10,15,28,0.5)",
                  boxShadow: isActive ? `inset 0 0 0 1px ${col}33, 0 0 14px ${col}15` : "none",
                }}
              >
                <span
                  className={`block text-[0.68rem] font-mono leading-snug lang-fade ${lang === "zh" ? "zh" : ""}`}
                  key={`preset-label-${lang}-${p.id}`}
                  style={{ color: isActive ? col : BONE500 }}
                >
                  {p.label[lang]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interpretation readout */}
      <div
        className="rounded-lg border px-4 py-4 transition-all duration-500"
        style={{
          borderColor: "rgba(63,196,176,0.18)",
          background: "linear-gradient(150deg, rgba(15,22,38,0.9), rgba(10,15,28,0.95))",
          minHeight: "5rem",
        }}
      >
        <p className="label-mono mb-2 text-[0.65rem]" style={{ color: JUSTICE }}>
          <T v={{ en: "PROFILE READING · 剖面解读", zh: "PROFILE READING · 剖面解读" }} />
        </p>
        <p
          className={`text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}
          key={`interp-${lang}-${values.join("-")}`}
        >
          {interpretation}
        </p>
      </div>

      {/* Universal floor callout */}
      <div
        className="mt-4 rounded-md border px-4 py-3"
        style={{
          borderColor: "rgba(233,181,78,0.2)",
          background: "rgba(233,181,78,0.04)",
        }}
      >
        <p className="label-mono mb-1 text-[0.65rem]" style={{ color: DIGNITY }}>
          <T v={{ en: "THE UNIVERSAL FLOOR · 普遍底线", zh: "THE UNIVERSAL FLOOR · 普遍底线" }} />
        </p>
        <p className="text-[0.72rem] leading-relaxed" style={{ color: "rgba(188,200,222,0.75)" }}>
          <T
            v={{
              en: "Whatever position the sliders take, no tradition genuinely defends torture, arbitrary murder, or the denial of basic personhood to its own people. The architecture above this floor may legitimately differ — the floor itself does not move. 'Culture' becomes a regime's alibi exactly when it is used to deny this floor to the governed.",
              zh: "无论滑块处于何种位置，没有哪个传统真正为酷刑、任意杀害，或对本国人民否认基本人格而辩护。这道底线之上的架构可以合理地有所不同——底线本身不会移动。正当「文化」被用来把这道底线否认于被治理者时，它便成了政权的不在场证明。",
            }}
          />
        </p>
      </div>
    </div>
  );
}
