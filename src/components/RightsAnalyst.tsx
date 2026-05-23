"use client";

import { useState, useEffect, useRef } from "react";
import { useLang, T, t } from "./lang";
import { LENSES, Lens, ANALYST, AnalystQ } from "./content";

/* ─── Lens accent palette ─── */
const LENS_CONFIG: Record<
  string,
  {
    accent: string;
    accentSoft: string;
    border: string;
    glyph: string;
    glyphLabel: string;
  }
> = {
  philosopher: {
    accent: "#4f9cf0",       /* liberty-500 */
    accentSoft: "#4f9cf018",
    border: "#4f9cf040",
    glyph: "φ",
    glyphLabel: "Phi — first principles",
  },
  constitutional: {
    accent: "#3fc4b0",       /* justice-500 */
    accentSoft: "#3fc4b018",
    border: "#3fc4b040",
    glyph: "§",
    glyphLabel: "Section — law and structure",
  },
  historian: {
    accent: "#e9b54e",       /* dignity-500 */
    accentSoft: "#e9b54e18",
    border: "#e9b54e40",
    glyph: "Ω",
    glyphLabel: "Omega — the long view",
  },
  ethicist: {
    accent: "#ec7d8d",       /* power-400 (soft rose) */
    accentSoft: "#ec7d8d18",
    border: "#ec7d8d40",
    glyph: "ε",
    glyphLabel: "Epsilon — who is wronged",
  },
  theorist: {
    accent: "#74b4f6",       /* liberty-400 */
    accentSoft: "#74b4f618",
    border: "#74b4f640",
    glyph: "Θ",
    glyphLabel: "Theta — power and order",
  },
  governance: {
    accent: "#6cd9c8",       /* justice-400 */
    accentSoft: "#6cd9c818",
    border: "#6cd9c840",
    glyph: "⌘",
    glyphLabel: "Command — the next system",
  },
};

/* ─── Animated answer panel ─── */
function AnswerPanel({
  answer,
  accentColor,
  visible,
}: {
  answer: string;
  accentColor: string;
  visible: boolean;
}) {
  const [displayed, setDisplayed] = useState(answer);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (answer === displayed) return;
    setFading(true);
    const t = setTimeout(() => {
      setDisplayed(answer);
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [answer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative overflow-hidden transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, height: visible ? "auto" : 0 }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
        style={{ background: accentColor }}
      />
      <p
        className="font-serif text-[0.97rem] leading-[1.85] text-bone-100 pl-5 pr-1 transition-opacity duration-200"
        style={{
          opacity: fading ? 0 : 1,
          color: "#e6edf8",
          fontFamily: "'Spectral', Georgia, serif",
          lineHeight: "1.85",
          fontSize: "0.975rem",
        }}
      >
        {displayed}
      </p>
    </div>
  );
}

/* ─── Scholar card (grid layout) ─── */
function ScholarCard({
  lens,
  answer,
  active,
  onClick,
  lang,
}: {
  lens: Lens;
  answer: string;
  active: boolean;
  onClick: () => void;
  lang: "en" | "zh";
}) {
  const cfg = LENS_CONFIG[lens.id] ?? LENS_CONFIG["philosopher"];
  const isZh = lang === "zh";

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="text-left w-full rounded-xl border transition-all duration-300 focus:outline-none focus-visible:ring-2"
      style={{
        background: active ? cfg.accentSoft : "rgba(15,22,38,0.6)",
        borderColor: active ? cfg.accent : "rgba(44,58,87,0.6)",
        boxShadow: active
          ? `0 0 0 1px ${cfg.border}, 0 4px 24px ${cfg.accentSoft}`
          : "none",
        ["--tw-ring-color" as string]: cfg.accent,
      }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Glyph badge */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-lg font-bold select-none"
          style={{
            background: `${cfg.accent}22`,
            color: cfg.accent,
            border: `1px solid ${cfg.border}`,
          }}
          aria-label={cfg.glyphLabel}
        >
          {cfg.glyph}
        </div>

        {/* Labels */}
        <div className="min-w-0">
          <div
            className="font-semibold text-[0.82rem] leading-tight tracking-wide truncate"
            style={{
              color: cfg.accent,
              fontFamily: isZh
                ? "'Noto Serif SC', 'Spectral', serif"
                : "inherit",
              fontWeight: isZh ? 600 : 700,
              letterSpacing: isZh ? "0.02em" : "0.06em",
              textTransform: isZh ? "none" : "uppercase",
            }}
          >
            {lens.label[lang]}
          </div>
          <div
            className="text-[0.7rem] mt-0.5 truncate"
            style={{ color: "rgba(127,141,176,0.8)", fontFamily: "IBM Plex Mono, monospace" }}
          >
            {lens.tone[lang]}
          </div>
        </div>

        {/* Active dot */}
        <div className="ml-auto flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: active ? cfg.accent : "transparent",
              boxShadow: active ? `0 0 6px ${cfg.accent}` : "none",
              border: active ? "none" : `1px solid rgba(127,141,176,0.3)`,
            }}
          />
        </div>
      </div>

      {/* Answer body — always visible in grid mode, highlighted when active */}
      <div
        className="px-4 pb-4 border-t"
        style={{ borderColor: active ? cfg.border : "rgba(44,58,87,0.3)" }}
      >
        <div
          className="relative pt-3"
        >
          <div
            className="absolute left-0 top-3 bottom-0 w-[2px] rounded-full transition-opacity duration-300"
            style={{ background: cfg.accent, opacity: active ? 1 : 0.25 }}
          />
          <p
            className="pl-4 text-[0.875rem] leading-relaxed transition-all duration-300"
            style={{
              color: active ? "#e6edf8" : "rgba(188,200,222,0.75)",
              fontFamily: isZh
                ? "'Noto Serif SC', 'Spectral', Georgia, serif"
                : "'Spectral', Georgia, serif",
              lineHeight: "1.8",
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ─── Question chip ─── */
function QuestionChip({
  q,
  active,
  onClick,
  lang,
  index,
}: {
  q: AnalystQ;
  active: boolean;
  onClick: () => void;
  lang: "en" | "zh";
  index: number;
}) {
  const isZh = lang === "zh";
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="text-left group relative rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-liberty-400"
      style={{
        background: active
          ? "rgba(79,156,240,0.10)"
          : "rgba(15,22,38,0.55)",
        borderColor: active
          ? "rgba(79,156,240,0.55)"
          : "rgba(44,58,87,0.55)",
        boxShadow: active ? "0 0 0 1px rgba(79,156,240,0.2)" : "none",
      }}
    >
      {/* Index badge */}
      <span
        className="inline-block font-mono text-[0.65rem] mr-2 mb-0.5 align-middle"
        style={{ color: active ? "#74b4f6" : "#7f8db0", letterSpacing: "0.05em" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="text-[0.875rem] leading-snug transition-colors duration-200"
        style={{
          color: active ? "#a6d0fb" : "#bcc8de",
          fontFamily: isZh
            ? "'Noto Serif SC', 'Spectral', serif"
            : "'Spectral', Georgia, serif",
          fontWeight: isZh ? 500 : 400,
        }}
      >
        {q.q[lang]}
      </span>
    </button>
  );
}

/* ─── Main component ─── */
export default function RightsAnalyst() {
  const { lang } = useLang();
  const [activeQ, setActiveQ] = useState<string>(ANALYST[0].id);
  const [activeLens, setActiveLens] = useState<string>(LENSES[0].id);
  const [panelKey, setPanelKey] = useState(0);
  const prevQ = useRef(activeQ);
  const prevLang = useRef(lang);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentQ = ANALYST.find((q) => q.id === activeQ) ?? ANALYST[0];
  const currentLens = LENSES.find((l) => l.id === activeLens) ?? LENSES[0];

  /* Trigger panel fade when question or language changes */
  useEffect(() => {
    if (prevQ.current !== activeQ || prevLang.current !== lang) {
      setPanelKey((k) => k + 1);
      prevQ.current = activeQ;
      prevLang.current = lang;
    }
  }, [activeQ, lang]);

  const handleSelectQ = (id: string) => {
    setActiveQ(id);
    /* Scroll panel into view on mobile */
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const isZh = lang === "zh";

  return (
    <section className="w-full py-8 md:py-12">
      {/* ── Section header ── */}
      <header className="mb-8 md:mb-10">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
          style={{
            background: "rgba(79,156,240,0.08)",
            border: "1px solid rgba(79,156,240,0.25)",
          }}
        >
          <span
            className="font-mono text-[0.65rem] tracking-widest uppercase"
            style={{ color: "#74b4f6" }}
          >
            AI Layer
          </span>
        </div>

        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{
            fontFamily: isZh
              ? "'Noto Serif SC', 'Newsreader', Georgia, serif"
              : "'Newsreader', Georgia, serif",
            color: "#e6edf8",
            letterSpacing: isZh ? "0.02em" : "-0.01em",
          }}
        >
          <T v={{ en: "Rights Analyst", zh: "权利分析师" }} />
        </h2>

        <p
          className="text-[0.9rem] leading-relaxed max-w-2xl"
          style={{ color: "#7f8db0", fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit" }}
        >
          <T
            v={{
              en: "Ask a question about rights, dignity, or power — and hear six scholarly lenses answer at once.",
              zh: "提出一个关于权利、尊严或权力的问题——同时听取六位学者视角的回答。",
            }}
          />
        </p>

        {/* Six-lenses framing line */}
        <div
          className="mt-5 flex items-center gap-3"
        >
          <div
            className="h-px flex-1 max-w-[3rem]"
            style={{ background: "rgba(79,156,240,0.3)" }}
          />
          <p
            className="text-[0.78rem] italic"
            style={{
              color: "#7f8db0",
              fontFamily: isZh
                ? "'Noto Serif SC', 'Spectral', serif"
                : "'Spectral', Georgia, serif",
            }}
          >
            <T
              v={{
                en: "Six lenses, not one verdict.",
                zh: "六重视角，而非一个定论。",
              }}
            />
          </p>
          <div
            className="h-px flex-1 max-w-[3rem]"
            style={{ background: "rgba(79,156,240,0.3)" }}
          />
        </div>
      </header>

      {/* ── Two-column layout: questions + panel ── */}
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">

        {/* ── Left column: question chips ── */}
        <aside className="xl:w-[340px] flex-shrink-0">
          <div
            className="rounded-xl border p-1 flex flex-col gap-1"
            style={{
              background: "rgba(10,15,28,0.7)",
              border: "1px solid rgba(44,58,87,0.5)",
            }}
          >
            <div
              className="px-3 pt-2 pb-1 font-mono text-[0.62rem] tracking-widest uppercase"
              style={{ color: "#7f8db0" }}
            >
              <T v={{ en: "Select a question", zh: "选择一个问题" }} />
            </div>
            {ANALYST.map((q, i) => (
              <QuestionChip
                key={q.id}
                q={q}
                index={i}
                active={q.id === activeQ}
                onClick={() => handleSelectQ(q.id)}
                lang={lang}
              />
            ))}
          </div>
        </aside>

        {/* ── Right column: scholar grid ── */}
        <div ref={panelRef} className="flex-1 min-w-0">
          {/* Current question display */}
          <div
            className="mb-5 px-5 py-4 rounded-xl border"
            style={{
              background: "rgba(10,15,28,0.8)",
              borderColor: "rgba(79,156,240,0.25)",
            }}
          >
            <div
              className="font-mono text-[0.62rem] tracking-widest uppercase mb-2"
              style={{ color: "#74b4f6" }}
            >
              <T v={{ en: "Question", zh: "问题" }} />
            </div>
            <p
              key={`${activeQ}-${lang}`}
              className={`text-[1rem] leading-snug lang-fade${isZh ? " zh" : ""}`}
              style={{
                color: "#e6edf8",
                fontFamily: isZh
                  ? "'Noto Serif SC', 'Spectral', serif"
                  : "'Spectral', Georgia, serif",
                fontWeight: isZh ? 500 : 400,
                fontSize: "1.025rem",
              }}
            >
              {currentQ.q[lang]}
            </p>
          </div>

          {/* Mobile/tablet: tabbed lens picker + single answer */}
          <div className="block lg:hidden mb-5">
            {/* Lens tabs */}
            <div
              className="flex flex-wrap gap-2 mb-4"
              role="tablist"
              aria-label={isZh ? "选择学者视角" : "Select a scholarly lens"}
            >
              {LENSES.map((lens) => {
                const cfg = LENS_CONFIG[lens.id];
                const isActive = lens.id === activeLens;
                return (
                  <button
                    key={lens.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-pressed={isActive}
                    onClick={() => setActiveLens(lens.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.78rem] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2"
                    style={{
                      background: isActive ? `${cfg.accent}18` : "rgba(15,22,38,0.6)",
                      border: `1px solid ${isActive ? cfg.accent : "rgba(44,58,87,0.5)"}`,
                      color: isActive ? cfg.accent : "#7f8db0",
                      ["--tw-ring-color" as string]: cfg.accent,
                    }}
                  >
                    <span
                      className="font-mono font-bold text-[0.9rem]"
                      style={{ color: cfg.accent }}
                    >
                      {cfg.glyph}
                    </span>
                    <span
                      style={{
                        fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit",
                        fontSize: isZh ? "0.8rem" : "0.78rem",
                      }}
                    >
                      {lens.label[lang]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Single answer panel */}
            {(() => {
              const cfg = LENS_CONFIG[currentLens.id];
              const answer = currentQ.answers[currentLens.id]?.[lang] ?? "";
              return (
                <div
                  key={`${activeQ}-${activeLens}-${lang}`}
                  className="rounded-xl border p-5 lang-fade"
                  style={{
                    background: `${cfg.accent}0c`,
                    borderColor: cfg.border,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                      style={{
                        background: `${cfg.accent}22`,
                        color: cfg.accent,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      {cfg.glyph}
                    </div>
                    <div>
                      <div
                        className="font-bold text-[0.78rem] tracking-wide"
                        style={{
                          color: cfg.accent,
                          fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit",
                          textTransform: isZh ? "none" : "uppercase",
                          letterSpacing: isZh ? "0.02em" : "0.07em",
                        }}
                      >
                        {currentLens.label[lang]}
                      </div>
                      <div
                        className="text-[0.68rem] mt-0.5"
                        style={{ color: "#7f8db0", fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {currentLens.tone[lang]}
                      </div>
                    </div>
                  </div>
                  <div
                    className="relative pl-5"
                    style={{ borderLeft: `2px solid ${cfg.accent}` }}
                  >
                    <p
                      className={`text-[0.94rem] leading-relaxed${isZh ? " zh" : ""}`}
                      style={{
                        color: "#e6edf8",
                        fontFamily: isZh
                          ? "'Noto Serif SC', 'Spectral', Georgia, serif"
                          : "'Spectral', Georgia, serif",
                        lineHeight: "1.85",
                      }}
                    >
                      {answer}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Desktop: full 2×3 grid of scholar cards */}
          <div className="hidden lg:grid grid-cols-2 xl:grid-cols-2 gap-3 2xl:grid-cols-3">
            {LENSES.map((lens) => {
              const answer = currentQ.answers[lens.id]?.[lang] ?? "";
              return (
                <ScholarCard
                  key={`${lens.id}-${activeQ}-${lang}`}
                  lens={lens}
                  answer={answer}
                  active={lens.id === activeLens}
                  onClick={() => setActiveLens(lens.id)}
                  lang={lang}
                />
              );
            })}
          </div>

          {/* Desktop: expanded reading panel for focused lens */}
          <div className="hidden lg:block mt-4">
            {(() => {
              const cfg = LENS_CONFIG[currentLens.id];
              const answer = currentQ.answers[currentLens.id]?.[lang] ?? "";
              return (
                <div
                  key={`expand-${activeQ}-${activeLens}-${lang}-${panelKey}`}
                  className="rounded-xl border p-6 lang-fade rise"
                  style={{
                    background: "rgba(10,15,28,0.75)",
                    borderColor: cfg.border,
                  }}
                >
                  {/* Panel header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xl flex-shrink-0"
                      style={{
                        background: `${cfg.accent}1a`,
                        color: cfg.accent,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      {cfg.glyph}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-bold text-[0.8rem] tracking-wide mb-0.5"
                        style={{
                          color: cfg.accent,
                          fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit",
                          textTransform: isZh ? "none" : "uppercase",
                          letterSpacing: isZh ? "0.02em" : "0.08em",
                        }}
                      >
                        {currentLens.label[lang]}
                      </div>
                      <div
                        className="text-[0.68rem]"
                        style={{ color: "#7f8db0", fontFamily: "IBM Plex Mono, monospace" }}
                      >
                        {currentLens.tone[lang]}
                        <span style={{ color: "rgba(127,141,176,0.4)", marginLeft: 8 }}>
                          {isZh ? "· 展开阅读" : "· expanded view"}
                        </span>
                      </div>
                    </div>

                    {/* Lens navigation pills */}
                    <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end max-w-[200px]">
                      {LENSES.map((l) => {
                        const lCfg = LENS_CONFIG[l.id];
                        const isActive = l.id === activeLens;
                        return (
                          <button
                            key={l.id}
                            onClick={() => setActiveLens(l.id)}
                            aria-pressed={isActive}
                            title={l.label[lang]}
                            className="w-7 h-7 rounded-md font-mono text-sm font-bold transition-all duration-200 focus:outline-none"
                            style={{
                              background: isActive ? `${lCfg.accent}25` : "transparent",
                              color: isActive ? lCfg.accent : "#7f8db0",
                              border: `1px solid ${isActive ? lCfg.accent : "rgba(44,58,87,0.5)"}`,
                            }}
                          >
                            {lCfg.glyph}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Answer prose */}
                  <div
                    className="relative pl-6"
                    style={{ borderLeft: `2px solid ${cfg.accent}` }}
                  >
                    <p
                      className={`text-[0.98rem] leading-[1.9] max-w-[72ch]${isZh ? " zh" : ""}`}
                      style={{
                        color: "#e6edf8",
                        fontFamily: isZh
                          ? "'Noto Serif SC', 'Spectral', Georgia, serif"
                          : "'Spectral', Georgia, serif",
                        lineHeight: "1.9",
                      }}
                    >
                      {answer}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── Six lenses legend ── */}
          <div
            className="mt-5 rounded-lg border px-4 py-3 flex flex-wrap gap-x-5 gap-y-2"
            style={{
              background: "rgba(10,15,28,0.5)",
              borderColor: "rgba(44,58,87,0.4)",
            }}
          >
            {LENSES.map((lens) => {
              const cfg = LENS_CONFIG[lens.id];
              return (
                <div key={lens.id} className="flex items-center gap-1.5">
                  <span
                    className="font-mono text-[0.82rem] font-bold"
                    style={{ color: cfg.accent }}
                  >
                    {cfg.glyph}
                  </span>
                  <span
                    className="text-[0.68rem]"
                    style={{
                      color: "#7f8db0",
                      fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit",
                    }}
                  >
                    {lens.label[lang]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Epistemic footer ── */}
      <footer
        className="mt-8 px-5 py-4 rounded-xl border"
        style={{
          background: "rgba(10,15,28,0.5)",
          borderColor: "rgba(44,58,87,0.35)",
        }}
      >
        <p
          className="text-[0.75rem] leading-relaxed"
          style={{
            color: "#7f8db0",
            fontFamily: isZh ? "'Noto Serif SC', serif" : "inherit",
          }}
        >
          <T
            v={{
              en: "These answers represent six distinct scholarly traditions, each with genuine strengths and genuine limits. No single perspective holds the complete truth. The goal is not consensus but clarity — to see the same question from angles that otherwise talk past each other.",
              zh: "以上回答代表六种各有真实优势与局限的不同学术传统。没有哪一种视角掌握完整的真相。目标不是共识，而是清晰——从彼此往往擦肩而过的角度，看同一个问题。",
            }}
          />
        </p>
      </footer>
    </section>
  );
}
