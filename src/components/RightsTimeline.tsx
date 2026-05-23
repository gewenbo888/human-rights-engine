"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, T } from "./lang";
import { TIMELINE, TimelineEvent, Era } from "./content";

/* ── Era colour palette ────────────────────────────────────────────────── */
const ERA_COLOR: Record<Era, { dot: string; glow: string; label: { en: string; zh: string } }> = {
  tribal:        { dot: "#2d3a57", glow: "#4f9cf040", label: { en: "Tribal", zh: "部落" } },
  axial:         { dot: "#4f9cf0", glow: "#4f9cf055", label: { en: "Axial", zh: "轴心" } },
  medieval:      { dot: "#7f8db0", glow: "#7f8db040", label: { en: "Medieval", zh: "中世纪" } },
  enlightenment: { dot: "#e9b54e", glow: "#e9b54e55", label: { en: "Enlightenment", zh: "启蒙" } },
  modern:        { dot: "#f3c976", glow: "#f3c97655", label: { en: "Modern", zh: "现代" } },
  contemporary:  { dot: "#74b4f6", glow: "#74b4f655", label: { en: "Contemporary", zh: "当代" } },
  future:        { dot: "#3fc4b0", glow: "#3fc4b055", label: { en: "Future", zh: "未来" } },
};

const ERA_ORDER: Era[] = ["tribal","axial","medieval","enlightenment","modern","contemporary","future"];

/* ── Circle gauge (arc + radial fill) ─────────────────────────────────── */
function CircleGauge({ pct, size = 80 }: { pct: number; size?: number }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#172033" strokeWidth="4" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke="#4f9cf0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="#f3f7fd" fontSize="13" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
        {pct}%
      </text>
    </svg>
  );
}

/* ── Sparkline: circle values over time ───────────────────────────────── */
function CircleSparkline({ events, activeIdx }: { events: TimelineEvent[]; activeIdx: number }) {
  const W = 100, H = 28;
  const xs = events.map((_, i) => (i / (events.length - 1)) * W);
  const ys = events.map(e => H - (e.circle / 100) * H * 0.85 - 2);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath = path + ` L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 28 }} aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f9cf0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f9cf0" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="#4f9cf0" strokeWidth="1.2" strokeLinejoin="round" />
      {events.map((e, i) => (
        <circle
          key={i}
          cx={xs[i]}
          cy={ys[i]}
          r={i === activeIdx ? 3 : 1.5}
          fill={i === activeIdx ? "#74b4f6" : "#4f9cf080"}
        />
      ))}
    </svg>
  );
}

/* ── Node dot on the rail ─────────────────────────────────────────────── */
function TimelineNode({
  event,
  index,
  totalCount,
  isActive,
  onClick,
}: {
  event: TimelineEvent;
  index: number;
  totalCount: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const { lang } = useLang();
  const era = ERA_COLOR[event.era];
  // Node radius scales with circle value
  const dotR = 5 + (event.circle / 100) * 9;
  const isFuture = event.era === "future";

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className="group flex flex-col items-center gap-0 focus:outline-none"
      style={{ minWidth: 44 }}
    >
      {/* Year label above */}
      <span
        className={`text-[0.58rem] font-mono leading-tight text-center transition-colors duration-200 lang-fade${lang === "zh" ? " zh" : ""}`}
        key={lang}
        style={{ color: isActive ? "#f3f7fd" : "#7f8db0", width: 52, wordBreak: "keep-all" }}
      >
        {event.year[lang]}
      </span>

      {/* Dot */}
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: dotR * 2 + 8,
          height: dotR * 2 + 8,
          marginTop: 4,
        }}
      >
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: era.glow, filter: "blur(4px)" }}
          />
        )}
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width: dotR * 2,
            height: dotR * 2,
            background: isActive ? era.dot : `${era.dot}99`,
            border: isFuture
              ? `1.5px dashed ${era.dot}`
              : `2px solid ${isActive ? era.dot : era.dot + "66"}`,
            boxShadow: isActive ? `0 0 12px ${era.glow}` : "none",
          }}
        />
      </div>
    </button>
  );
}

/* ── Detail panel ─────────────────────────────────────────────────────── */
function DetailPanel({ event }: { event: TimelineEvent }) {
  const { lang } = useLang();
  const era = ERA_COLOR[event.era];
  const isFuture = event.era === "future";

  return (
    <div
      className="card relative p-5 flex flex-col gap-3 overflow-hidden"
      style={{ borderColor: `${era.dot}33` }}
    >
      {/* Era accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
        style={{ background: era.dot, opacity: isFuture ? 0.5 : 0.9 }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="label-mono" style={{ color: era.dot, opacity: 0.85 }}>
            {ERA_COLOR[event.era].label[lang]} ·{" "}
            <span key={lang} className={`lang-fade${lang === "zh" ? " zh" : ""}`}>
              {event.year[lang]}
            </span>
          </span>
          <h3
            className={`display text-xl font-semibold text-bone-50 lang-fade${lang === "zh" ? " zh" : ""}`}
            key={`title-${lang}`}
          >
            {event.title[lang]}
          </h3>
        </div>
        <div className="shrink-0">
          <CircleGauge pct={event.circle} size={68} />
          <p className="text-[0.6rem] font-mono text-bone-500 text-center mt-1 leading-tight">
            <T v={{ en: "who counts", zh: "谁算数" }} />
          </p>
        </div>
      </div>

      {/* Detail prose */}
      <p
        className={`text-sm text-bone-300 leading-relaxed lang-fade${lang === "zh" ? " zh" : ""}`}
        key={`detail-${lang}`}
      >
        {event.detail[lang]}
      </p>

      {/* Expanding circle bar */}
      <div className="flex items-center gap-3 mt-1">
        <span className="text-[0.65rem] font-mono text-bone-500 shrink-0">
          <T v={{ en: "circle breadth", zh: "圆的广度" }} />
        </span>
        <div className="flex-1 h-[3px] rounded-full bg-void-600 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${event.circle}%`,
              background: isFuture
                ? "linear-gradient(90deg, #3fc4b0, #3fc4b066)"
                : "linear-gradient(90deg, #4f9cf0, #74b4f6)",
            }}
          />
        </div>
        <span className="text-[0.65rem] font-mono text-liberty-400 shrink-0">{event.circle}%</span>
      </div>
    </div>
  );
}

/* ══ Main component ══════════════════════════════════════════════════════ */
export default function RightsTimeline() {
  const { lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(10); // default: 1948 UDHR
  const railRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active node into view on mount and change
  useEffect(() => {
    if (activeRef.current && railRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [activeIdx]);

  const activeEvent = TIMELINE[activeIdx];

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="label-mono mb-1">
            <T v={{ en: "RIGHTS EVOLUTION · TIMELINE", zh: "权利演进 · 时间轴" }} />
          </p>
          <p className="text-xs text-bone-500 leading-relaxed max-w-md">
            <T
              v={{
                en: "Each node's size reflects how broadly 'personhood' was recognised. Click any event.",
                zh: "每个节点的大小，反映「人格」被承认的广度。点击任意事件。",
              }}
            />
          </p>
        </div>

        {/* Sparkline */}
        <div className="flex flex-col gap-1 min-w-[160px] max-w-[220px]">
          <span className="text-[0.6rem] font-mono text-bone-500">
            <T v={{ en: "circle breadth over time", zh: "圆的广度随时间变化" }} />
          </span>
          <CircleSparkline events={TIMELINE} activeIdx={activeIdx} />
        </div>
      </div>

      {/* Timeline rail */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0" style={{ top: "50%", transform: "translateY(-50%)", height: 1 }}>
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg, #172033 0%, #2d3a57 20%, #2d3a57 80%, #172033 100%)",
            }}
          />
        </div>

        {/* Scrollable rail */}
        <div
          ref={railRef}
          className="overflow-x-auto pb-2 pt-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className="flex items-center gap-1 px-6"
            style={{ width: "max-content", minWidth: "100%" }}
          >
            {TIMELINE.map((ev, i) => (
              <div
                key={i}
                ref={i === activeIdx ? (el) => { (activeRef as React.MutableRefObject<HTMLButtonElement | null>).current = el as HTMLButtonElement | null; } : undefined}
              >
                <TimelineNode
                  event={ev}
                  index={i}
                  totalCount={TIMELINE.length}
                  isActive={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ minHeight: 160 }}>
        <DetailPanel event={activeEvent} />
      </div>

      {/* Era legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
        {ERA_ORDER.map(era => (
          <div key={era} className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: ERA_COLOR[era].dot,
                border: era === "future" ? `1.5px dashed ${ERA_COLOR[era].dot}` : "none",
                opacity: era === "tribal" ? 0.7 : 1,
              }}
            />
            <span
              className={`text-[0.62rem] font-mono text-bone-500 lang-fade${lang === "zh" ? " zh" : ""}`}
              key={`legend-${era}-${lang}`}
            >
              {ERA_COLOR[era].label[lang]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
