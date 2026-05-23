"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import { OPPRESSION, Oppression } from "./content";

/* ── Thin horizontal rule ─────────────────────────────────────────────── */
function HairlineRule() {
  return (
    <div
      className="w-full h-px"
      style={{
        background: "linear-gradient(90deg, transparent, #2d3a57 30%, #2d3a57 70%, transparent)",
      }}
    />
  );
}

/* ── Label eyebrow (MECHANISM · 机制, etc.) ───────────────────────────── */
function Eyebrow({
  en,
  zh,
  accent,
}: {
  en: string;
  zh: string;
  accent: "power" | "justice" | "dignity";
}) {
  const { lang } = useLang();
  const colorMap = {
    power:   "#e0556b",
    justice: "#3fc4b0",
    dignity: "#e9b54e",
  };
  return (
    <span
      className={`label-mono lang-fade${lang === "zh" ? " zh" : ""}`}
      key={lang}
      style={{ color: colorMap[accent], opacity: 0.9, fontSize: "0.62rem", letterSpacing: "0.08em" }}
    >
      {en} · {zh}
    </span>
  );
}

/* ── Detail plaque for selected oppression case ───────────────────────── */
function OpressionPlaque({ item }: { item: Oppression }) {
  const { lang } = useLang();

  return (
    <div className="card flex flex-col gap-4 p-5 relative overflow-hidden" style={{ borderColor: "#e0556b22" }}>
      {/* Left accent — thin crimson bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
        style={{ background: "linear-gradient(180deg, #e0556b 0%, #e0556b55 70%, transparent 100%)" }}
      />

      {/* Header: era badge + label */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block text-[0.6rem] font-mono px-2 py-0.5 rounded border lang-fade${lang === "zh" ? " zh" : ""}`}
              key={`era-${lang}`}
              style={{
                color: "#e0556b",
                borderColor: "#e0556b44",
                background: "#e0556b0d",
              }}
            >
              {item.era[lang]}
            </span>
          </div>
          <h3
            className={`display text-xl font-semibold text-bone-50 mt-0.5 lang-fade${lang === "zh" ? " zh" : ""}`}
            key={`label-${lang}`}
          >
            {item.label[lang]}
          </h3>
        </div>

        {/* Circle-broken icon: a ring with a gap, rendered in SVG */}
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
          <circle cx="22" cy="22" r="16" fill="none" stroke="#172033" strokeWidth="3" />
          {/* Broken arc — most of the circle */}
          <circle
            cx="22" cy="22" r="16"
            fill="none"
            stroke="#e0556b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="75 25"
            strokeDashoffset="6"
            opacity="0.7"
          />
          {/* Gap marker — tiny dot showing break point */}
          <circle cx="22" cy="6" r="2" fill="#e0556b" opacity="0.4" />
          <text x="22" y="26" textAnchor="middle" fill="#7f8db0" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            broken
          </text>
        </svg>
      </div>

      <HairlineRule />

      {/* Three structured fields */}
      <div className="flex flex-col gap-4">
        {/* MECHANISM */}
        <div className="flex flex-col gap-1.5">
          <Eyebrow en="MECHANISM" zh="机制" accent="power" />
          <p
            className={`text-sm text-bone-300 leading-relaxed lang-fade${lang === "zh" ? " zh" : ""}`}
            key={`mech-${lang}`}
          >
            {item.mechanism[lang]}
          </p>
        </div>

        <div className="h-px w-full" style={{ background: "#172033" }} />

        {/* JUSTIFIED AS */}
        <div className="flex flex-col gap-1.5">
          <Eyebrow en="JUSTIFIED AS" zh="正当化为" accent="power" />
          <p
            className={`text-sm leading-relaxed lang-fade${lang === "zh" ? " zh" : ""}`}
            key={`just-${lang}`}
            style={{ color: "#f4abb5" }}
          >
            {item.justification[lang]}
          </p>
          {/* italicised qualifier */}
          <p className="text-[0.68rem] font-mono italic" style={{ color: "#e0556b88" }}>
            <T v={{ en: "— once called natural, necessary, or eternal.", zh: "——曾被称为自然、必要，或永恒。" }} />
          </p>
        </div>

        <div className="h-px w-full" style={{ background: "#172033" }} />

        {/* UNDONE BY */}
        <div className="flex flex-col gap-1.5">
          <Eyebrow en="UNDONE BY" zh="被…废止" accent="justice" />
          <p
            className={`text-sm text-justice-300 leading-relaxed lang-fade${lang === "zh" ? " zh" : ""}`}
            key={`undo-${lang}`}
          >
            {item.undoing[lang]}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Catalog item (selectable row) ───────────────────────────────────── */
function CatalogRow({
  item,
  isActive,
  index,
  onClick,
}: {
  item: Oppression;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const { lang } = useLang();

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className="group w-full text-left flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-power-500/50"
      style={{
        background: isActive ? "#e0556b0d" : "transparent",
        borderLeft: `3px solid ${isActive ? "#e0556b" : "#2d3a57"}`,
      }}
    >
      {/* Index */}
      <span
        className="shrink-0 font-mono text-xs"
        style={{ color: isActive ? "#e0556b" : "#7f8db066", minWidth: "1.2rem" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Label */}
      <span
        className={`flex-1 text-sm font-medium lang-fade${lang === "zh" ? " zh" : ""}`}
        key={`row-${lang}`}
        style={{ color: isActive ? "#f3f7fd" : "#bcc8de" }}
      >
        {item.label[lang]}
      </span>

      {/* Era badge */}
      <span
        className={`shrink-0 text-[0.58rem] font-mono px-1.5 py-0.5 rounded lang-fade${lang === "zh" ? " zh" : ""}`}
        key={`badge-${lang}`}
        style={{
          color: "#7f8db0",
          background: "#0f1626",
          border: "1px solid #2d3a57",
          whiteSpace: "nowrap",
        }}
      >
        {item.era[lang]}
      </span>

      {/* Chevron */}
      <svg
        width="12" height="12" viewBox="0 0 12 12"
        style={{ color: isActive ? "#e0556b" : "#2d3a57", transition: "transform 0.2s", transform: isActive ? "rotate(90deg)" : "none" }}
        aria-hidden
      >
        <path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Closing statement ───────────────────────────────────────────────── */
function ClosingStatement() {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded"
      style={{ background: "#3fc4b008", border: "1px solid #3fc4b022" }}
    >
      {/* Teal vertical rule */}
      <div className="shrink-0 w-[2px] self-stretch rounded" style={{ background: "#3fc4b0", opacity: 0.7 }} />
      <p className="text-xs text-bone-500 leading-relaxed italic">
        <T
          v={{
            en: "Each of these systems was once called natural, divinely ordained, or the price of civilisation. Each was broken — by those who refused the story. This is a map of how the moral circle is shattered, so it can be defended.",
            zh: "这些体系中的每一个，都曾被称为自然的、神圣赐予的，或是文明的代价。每一个都被打破——被那些拒绝接受这套叙事的人打破。这是一张地图，记录道德之圆如何被打碎——以便它能被守护。",
          }}
        />
      </p>
    </div>
  );
}

/* ══ Main component ══════════════════════════════════════════════════════ */
export default function OppressionTimeline() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>(OPPRESSION[0].id);
  const activeItem = OPPRESSION.find(o => o.id === activeId) ?? OPPRESSION[0];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="label-mono">
          <T v={{ en: "SYSTEMS OF DOMINATION · HISTORICAL CATALOG", zh: "支配体系 · 历史目录" }} />
        </p>
        <p className="text-xs text-bone-500 leading-relaxed max-w-xl">
          <T
            v={{
              en: "A comparative record of how civilisations have defined groups as outside the circle of full personhood — and how each was eventually overturned.",
              zh: "一份比较性记录，记述各文明如何把群体界定在完整人格之圆以外——以及每一次最终如何被推翻。",
            }}
          />
        </p>
      </div>

      <HairlineRule />

      {/* Two-column layout on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: catalog list */}
        <div
          className="flex flex-col lg:w-[42%] shrink-0 rounded overflow-hidden"
          style={{ background: "#0a0f1c", border: "1px solid #172033" }}
        >
          {OPPRESSION.map((item, i) => (
            <div key={item.id}>
              <CatalogRow
                item={item}
                isActive={activeId === item.id}
                index={i}
                onClick={() => setActiveId(item.id)}
              />
              {i < OPPRESSION.length - 1 && (
                <div className="mx-4 h-px" style={{ background: "#172033" }} />
              )}
            </div>
          ))}
        </div>

        {/* Right: detail plaque */}
        <div className="flex-1 min-w-0">
          <OpressionPlaque key={activeItem.id} item={activeItem} />
        </div>
      </div>

      {/* Closing statement */}
      <ClosingStatement />
    </div>
  );
}
