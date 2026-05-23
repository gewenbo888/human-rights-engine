"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useLang, T, t } from "./lang";
import { META_AXES, MetaAxis, EPOCHS, Epoch } from "./content";

/* ─── design tokens ─── */
const VOID     = "#070a12";
const VOID900  = "#0a0f1c";
const VOID800  = "#0f1626";
const VOID700  = "#172033";
const VOID600  = "#212c44";
const VOID500  = "#2d3a57";
const LIBERTY500 = "#4f9cf0";
const LIBERTY400 = "#74b4f6";
const LIBERTY300 = "#a6d0fb";
const DIGNITY500 = "#e9b54e";
const DIGNITY400 = "#f3c976";
const DIGNITY300 = "#fadfa6";
const JUSTICE500 = "#3fc4b0";
const JUSTICE400 = "#6cd9c8";
const JUSTICE300 = "#9fe9dd";
const POWER500  = "#e0556b";
const POWER400  = "#ec7d8d";
const BONE50    = "#f3f7fd";
const BONE300   = "#bcc8de";
const BONE500   = "#7f8db0";

const AXIS_COLORS = [
  DIGNITY400,
  LIBERTY400,
  JUSTICE400,
  LIBERTY300,
  DIGNITY300,
  JUSTICE300,
  POWER400,
];

/* ─── composite score ─── */
function compositeScore(scores: number[]): number {
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const weakest = Math.min(...scores);
  return Math.round(mean - (mean - weakest) * 0.28);
}

/* ─── who counts: moral circle data per epoch ─── */
type CircleData = {
  label: { en: string; zh: string };
  count: number;      // 0–12 figures lit
  total: number;      // total figures shown (usually 12)
  note: { en: string; zh: string };
  uncertain: boolean; // shows ? glyph at boundary
};

const CIRCLE_DATA: CircleData[] = [
  { count: 2, total: 12, uncertain: false,
    label: { en: "Kin & clan only", zh: "仅血亲与宗族" },
    note: { en: "The band protects its own. The stranger is outside the circle.", zh: "游群护卫自己人。陌生人在圆之外。" } },
  { count: 3, total: 12, uncertain: false,
    label: { en: "Subjects by rank", zh: "按等级的臣民" },
    note: { en: "Law arrives, but worth is fixed by birth. Slaves and serfs do not count.", zh: "法律来临，但价值由出身决定。奴隶与农奴不算数。" } },
  { count: 8, total: 12, uncertain: false,
    label: { en: "Citizens with standing", zh: "有资格的公民" },
    note: { en: "The breakthrough: subjects become citizens. But women, the enslaved and the colonised remain outside.", zh: "突破：臣民成为公民。但女性、奴隶与被殖民者仍在外。" } },
  { count: 11, total: 12, uncertain: false,
    label: { en: "Near-universal (within borders)", zh: "近乎普遍（边界之内）" },
    note: { en: "Workers, women, minorities win standing. The circle approaches all humans — on paper.", zh: "工人、女性、少数群体赢得资格。圆在纸面上接近全体人类。" } },
  { count: 10, total: 12, uncertain: true,
    label: { en: "All humans, contested in code", zh: "全体人类，但代码有争议" },
    note: { en: "Rights exist in law but are increasingly mediated by systems that score, filter, and decide without appeal.", zh: "权利存在于法律，却日益由评分、过滤、无可申诉地裁决的系统所中介。" } },
  { count: 9, total: 12, uncertain: true,
    label: { en: "Algorithmically granted or withheld", zh: "算法给予或扣留" },
    note: { en: "Who the model permits becomes who the right applies to. The circle is real but its enforcement is machine-mediated.", zh: "模型许可谁，权利就适用于谁。圆是真实的，但其执行被机器中介。" } },
  { count: 11, total: 12, uncertain: true,
    label: { en: "The question re-opens", zh: "问题重新打开" },
    note: { en: "Synthetic minds may enter the circle — or demand we re-examine what the circle means. The count is uncertain.", zh: "合成心智可能进入这个圆——或迫使我们重新审视这个圆意味着什么。数目不确定。" } },
  { count: 12, total: 12, uncertain: false,
    label: { en: "Every conscious being — if we build it", zh: "每一个有意识的存在——若我们建构它" },
    note: { en: "Planetary civilisation could extend the floor to all. Possible. Not promised.", zh: "行星文明可以把底线延及所有人。可能——并无保证。" } },
];

/* ─── animated interpolation for bar widths ─── */
function useAnimatedScores(target: number[], duration = 500): number[] {
  const [display, setDisplay] = useState<number[]>(target);
  const frameRef = useRef<number | null>(null);
  const prevRef = useRef<number[]>(target);

  useEffect(() => {
    const from = prevRef.current.slice();
    const to = target.slice();
    const startTime = performance.now();

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const interp = from.map((f, i) => f + (to[i] - f) * ease);
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

/* ─── sparkline component ─── */
function Sparkline({
  data,
  currentIdx,
  width = 260,
  height = 48,
}: {
  data: number[];
  currentIdx: number;
  width?: number;
  height?: number;
}) {
  const PAD = 8;
  const innerW = width - PAD * 2;
  const innerH = height - PAD * 2;
  const minV = Math.min(...data) - 4;
  const maxV = Math.max(...data) + 4;
  const range = maxV - minV || 1;

  const toX = (i: number) => PAD + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => PAD + innerH - ((v - minV) / range) * innerH;

  const linePath = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  // area path
  const areaPath =
    linePath +
    ` L${toX(data.length - 1).toFixed(1)},${(PAD + innerH).toFixed(1)}` +
    ` L${toX(0).toFixed(1)},${(PAD + innerH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIBERTY500} stopOpacity="0.28" />
          <stop offset="100%" stopColor={LIBERTY500} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* area */}
      <path d={areaPath} fill="url(#spark-fill)" />
      {/* line */}
      <path d={linePath} fill="none" stroke={LIBERTY400} strokeWidth={1.4} strokeLinejoin="round" />
      {/* dots */}
      {data.map((v, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(v)}
          r={i === currentIdx ? 4 : 2.2}
          fill={i === currentIdx ? DIGNITY400 : LIBERTY400}
          stroke={VOID900}
          strokeWidth={1}
          style={{
            filter: i === currentIdx ? `drop-shadow(0 0 5px ${DIGNITY400})` : "none",
          }}
        />
      ))}
    </svg>
  );
}

/* ─── figure glyphs (SVG person silhouettes in a row) ─── */
function FigureRow({
  count,
  total,
  uncertain,
  color,
}: {
  count: number;
  total: number;
  uncertain: boolean;
  color: string;
}) {
  const figures = Array.from({ length: total }, (_, i) => i);
  return (
    <div className="flex flex-wrap gap-1.5 items-end">
      {figures.map(i => {
        const lit = i < count;
        const isUncertainEdge = uncertain && i === count;
        return (
          <svg
            key={i}
            viewBox="0 0 16 32"
            width={16}
            height={32}
            style={{
              opacity: lit ? 1 : 0.15,
              filter: lit
                ? `drop-shadow(0 0 4px ${color}99)`
                : "none",
              transition: "opacity 0.6s ease, filter 0.6s ease",
            }}
          >
            {/* head */}
            <circle
              cx={8}
              cy={6}
              r={4.5}
              fill={lit ? color : BONE500}
              style={{ transition: "fill 0.6s ease" }}
            />
            {/* body */}
            <path
              d="M4 14 Q8 10 12 14 L13 28 Q8 30 3 28 Z"
              fill={lit ? color : BONE500}
              style={{ transition: "fill 0.6s ease" }}
            />
            {/* question mark for uncertain boundary */}
            {isUncertainEdge && (
              <text
                x={8}
                y={20}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={VOID}
                fontFamily="IBM Plex Mono"
              >
                ?
              </text>
            )}
          </svg>
        );
      })}
      {uncertain && (
        <span
          className="text-sm font-mono ml-1 self-center"
          style={{ color: POWER400, textShadow: `0 0 8px ${POWER400}` }}
        >
          ?
        </span>
      )}
    </div>
  );
}

/* ─── mini compact radar (7 spokes, no labels, just the shape) ─── */
function MiniRadar({ scores, size = 80 }: { scores: number[]; size?: number }) {
  const cx = size / 2, cy = size / 2;
  const rMax = size * 0.42;
  const N = scores.length;

  function pt(i: number, r: number): string {
    const rad = (((360 / N) * i) * Math.PI) / 180 - Math.PI / 2;
    return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
  }

  const poly = scores.map((s, i) => pt(i, (s / 100) * rMax)).join(" ");
  const gridPoly = (pct: number) =>
    Array.from({ length: N }, (_, i) => pt(i, (pct / 100) * rMax)).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {[33, 66, 100].map(p => (
        <polygon key={p} points={gridPoly(p)} fill="none" stroke={VOID600} strokeWidth={0.6} />
      ))}
      {Array.from({ length: N }, (_, i) => {
        const [x, y] = pt(i, rMax).split(",").map(Number);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={VOID600} strokeWidth={0.5} />;
      })}
      <polygon
        points={poly}
        fill={LIBERTY500 + "33"}
        stroke={LIBERTY400}
        strokeWidth={1.2}
        style={{ transition: "points 0.05s linear" }}
      />
    </svg>
  );
}

/* ─── main component ─── */
export default function RecursiveRightsEngine() {
  const { lang } = useLang();

  const [epochIdx, setEpochIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentEpoch = EPOCHS[epochIdx];
  const currentCircle = CIRCLE_DATA[epochIdx];
  const displayScores = useAnimatedScores(currentEpoch.scores);

  /* composite scores for all epochs (for sparkline) */
  const allScores = useMemo(() => EPOCHS.map(e => compositeScore(e.scores)), []);
  const currentScore = compositeScore(currentEpoch.scores);

  /* play / pause */
  const startPlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const stopPlay = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setTimeout(() => {
      setEpochIdx(prev => {
        if (prev >= EPOCHS.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2600);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [playing, epochIdx]);

  const goTo = (i: number) => {
    stopPlay();
    setEpochIdx(i);
  };

  const prev = () => goTo(Math.max(0, epochIdx - 1));
  const next = () => goTo(Math.min(EPOCHS.length - 1, epochIdx + 1));
  const togglePlay = () => (playing ? stopPlay() : startPlay());

  /* stability band */
  const bandColor =
    currentScore >= 65 ? JUSTICE400 :
    currentScore >= 40 ? DIGNITY400 :
    POWER400;

  const bandLabel =
    currentScore >= 65
      ? { en: "Resilient", zh: "稳健" }
      : currentScore >= 40
        ? { en: "Contested", zh: "受争" }
        : { en: "Fragile", zh: "脆弱" };

  /* is last epoch (planetary) → special tone */
  const isPlanetary = epochIdx === EPOCHS.length - 1;
  const isSynthetic = epochIdx === EPOCHS.length - 2;

  return (
    <div className="w-full">
      {/* ── header ── */}
      <div className="mb-6">
        <p className="label-mono mb-1">
          <T v={{ en: "Recursive simulation · 8 epochs", zh: "递归模拟 · 八个时代" }} />
        </p>
        <h2 className="display text-2xl sm:text-3xl glow-text leading-tight">
          <T v={{ en: "Rights Across Civilisational Scales", zh: "文明尺度中的权利演化" }} />
        </h2>
        <p className="mt-2 text-sm max-w-2xl leading-relaxed" style={{ color: BONE500 }}>
          <T v={{
            en: "Each new civilisational scale re-opens the question: who is protected, by what, from whom?",
            zh: "每一个新的文明尺度都重新打开这个问题：谁受到保护，靠什么，免于谁？"
          }} />
        </p>
      </div>

      {/* ── epoch timeline stepper ── */}
      <div className="relative mb-6 overflow-x-auto pb-2">
        {/* track */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            top: 17,
            background: `linear-gradient(90deg, transparent, ${VOID600} 5%, ${VOID600} 95%, transparent)`,
          }}
        />
        <div className="flex gap-0 relative" style={{ minWidth: 640 }}>
          {EPOCHS.map((ep, i) => {
            const isActive = i === epochIdx;
            const isPast = i < epochIdx;
            const score = allScores[i];
            const dotColor =
              score >= 65 ? JUSTICE400 :
              score >= 40 ? DIGNITY400 :
              POWER400;

            return (
              <button
                key={ep.id}
                onClick={() => goTo(i)}
                className="flex-1 flex flex-col items-center gap-1.5 group transition-all duration-200"
                style={{ minWidth: 0 }}
                aria-pressed={isActive}
              >
                {/* dot */}
                <div
                  style={{
                    width: isActive ? 14 : 10,
                    height: isActive ? 14 : 10,
                    borderRadius: "50%",
                    background: isActive ? dotColor : isPast ? dotColor + "99" : VOID600,
                    border: `2px solid ${isActive ? dotColor : "transparent"}`,
                    boxShadow: isActive ? `0 0 10px ${dotColor}` : "none",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}
                />
                {/* label */}
                <span
                  className="text-center leading-tight transition-all duration-200 px-1"
                  style={{
                    fontSize: isActive ? 10.5 : 9.5,
                    fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                    color: isActive ? BONE50 : isPast ? BONE500 : VOID500,
                    maxWidth: 72,
                    display: "block",
                  }}
                >
                  {t(ep.label, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── current epoch card ── */}
      <div
        className="card rounded-2xl p-6 mb-5 rise"
        key={epochIdx}
        style={{
          borderColor: bandColor + "44",
          boxShadow: `0 0 40px ${bandColor}0d`,
        }}
      >
        <div className="flex flex-wrap items-start gap-4 mb-4">
          {/* epoch title */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-3 mb-1">
              <span className="label-mono" style={{ color: bandColor }}>
                {epochIdx + 1} / {EPOCHS.length}
              </span>
              <span className="text-xs font-mono" style={{ color: BONE500 }}>
                {t(currentEpoch.sub, lang)}
              </span>
            </div>
            <h3
              className="display text-xl sm:text-2xl leading-tight mb-2"
              style={{ color: BONE50 }}
            >
              {t(currentEpoch.label, lang)}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: BONE300,
                fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "Spectral, serif",
              }}
            >
              {t(currentEpoch.note, lang)}
            </p>
          </div>

          {/* score + mini radar */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <MiniRadar scores={displayScores} size={80} />
            <div className="text-center">
              <div
                className="text-2xl font-mono font-semibold leading-none tabular-nums"
                style={{ color: bandColor, textShadow: `0 0 16px ${bandColor}88` }}
              >
                {compositeScore(displayScores.map(Math.round))}
              </div>
              <div className="text-xs font-mono mt-0.5" style={{ color: bandColor }}>
                {lang === "zh" ? bandLabel.zh : bandLabel.en}
              </div>
            </div>
          </div>
        </div>

        {/* ── axis bars ── */}
        <div className="space-y-2 mt-4">
          {META_AXES.map((ax, i) => {
            const val = displayScores[i];
            const pct = Math.min(100, Math.max(0, val));
            return (
              <div key={ax.id} className="flex items-center gap-3">
                <span
                  className="text-xs shrink-0"
                  style={{
                    width: lang === "zh" ? 28 : 64,
                    fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                    color: BONE500,
                    fontSize: lang === "zh" ? 10 : 9,
                  }}
                >
                  {t(ax.short, lang)}
                </span>
                <div className="flex-1 relative h-2 rounded-full overflow-hidden" style={{ background: VOID700 }}>
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${AXIS_COLORS[i]}88, ${AXIS_COLORS[i]})`,
                      boxShadow: `0 0 6px ${AXIS_COLORS[i]}88`,
                      transition: "width 0.05s linear",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-mono tabular-nums shrink-0"
                  style={{ color: AXIS_COLORS[i], width: 26, textAlign: "right" }}
                >
                  {Math.round(pct)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── who counts: the circle ── */}
      <div className="card rounded-2xl p-5 mb-5" style={{ borderColor: VOID600 }}>
        <p className="label-mono mb-3">
          <T v={{ en: "The circle of who counts", zh: "「谁算数」之圆" }} />
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-0">
            <FigureRow
              count={currentCircle.count}
              total={currentCircle.total}
              uncertain={currentCircle.uncertain}
              color={bandColor}
            />
            <div className="mt-3">
              <p
                className="text-xs font-semibold mb-1"
                style={{
                  color: bandColor,
                  fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                }}
              >
                {t(currentCircle.label, lang)}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: BONE500 }}>
                {t(currentCircle.note, lang)}
              </p>
            </div>
          </div>
          {/* circle fraction */}
          <div
            className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-4 py-3"
            style={{ background: VOID700, border: `1px solid ${bandColor}33` }}
          >
            <span
              className="text-2xl font-mono font-bold leading-none tabular-nums"
              style={{ color: bandColor }}
            >
              {currentCircle.count}
            </span>
            <span className="text-xs font-mono" style={{ color: BONE500 }}>
              / {currentCircle.total}
            </span>
            <span className="text-xs mt-1" style={{ color: BONE500 }}>
              {currentCircle.uncertain ? (
                <span style={{ color: POWER400 }}>
                  <T v={{ en: "uncertain", zh: "不确定" }} />
                </span>
              ) : (
                <T v={{ en: "recognized", zh: "已承认" }} />
              )}
            </span>
          </div>
        </div>

        {/* special notes for pivotal epochs */}
        {isSynthetic && (
          <div
            className="mt-4 p-3 rounded-lg text-xs leading-relaxed"
            style={{
              background: POWER500 + "12",
              border: `1px solid ${POWER400}44`,
              color: BONE300,
            }}
          >
            <span style={{ color: POWER400, fontFamily: "IBM Plex Mono, monospace" }}>
              {lang === "zh" ? "⚠ 临界点 · " : "⚠ THRESHOLD · "}
            </span>
            <T v={{
              en: "At the synthetic-minds epoch, the question 'who is a person?' becomes an engineering decision. The circle may widen — or be redrawn on criteria we did not choose.",
              zh: "在合成心智时代，「谁是人？」成为一个工程决策。这个圆可能扩大——也可能按我们未曾选择的标准被重新划定。"
            }} />
          </div>
        )}
        {isPlanetary && (
          <div
            className="mt-4 p-3 rounded-lg text-xs leading-relaxed"
            style={{
              background: JUSTICE500 + "10",
              border: `1px solid ${JUSTICE400}44`,
              color: BONE300,
            }}
          >
            <span style={{ color: JUSTICE400, fontFamily: "IBM Plex Mono, monospace" }}>
              {lang === "zh" ? "◇ 可能 · " : "◇ POSSIBLE · "}
            </span>
            <T v={{
              en: "Planetary civilisation at maximum dignity is achievable — and not guaranteed. Progress is real; so is regression. Every generation re-decides.",
              zh: "最大尊严的行星文明，是可以达到的——也并无保证。进步是真实的；倒退亦然。每一代人都在重新决定。"
            }} />
          </div>
        )}
      </div>

      {/* ── sparkline arc ── */}
      <div className="card rounded-xl p-4 mb-5">
        <p className="label-mono mb-3">
          <T v={{ en: "Stability arc across all epochs", zh: "全部时代的稳定弧线" }} />
        </p>
        <div className="flex items-end gap-4">
          <div className="flex-shrink-0">
            <Sparkline
              data={allScores}
              currentIdx={epochIdx}
              width={260}
              height={52}
            />
          </div>
          <div className="flex-1 space-y-1">
            {EPOCHS.map((ep, i) => {
              const s = allScores[i];
              const c = s >= 65 ? JUSTICE400 : s >= 40 ? DIGNITY400 : POWER400;
              const isActive = i === epochIdx;
              return (
                <div
                  key={ep.id}
                  className="flex items-center gap-2 transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0.45 }}
                >
                  <div
                    style={{
                      width: 6, height: 6,
                      borderRadius: "50%",
                      background: c,
                      flexShrink: 0,
                      boxShadow: isActive ? `0 0 6px ${c}` : "none",
                    }}
                  />
                  <span
                    className="text-xs truncate"
                    style={{
                      fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "IBM Plex Mono, monospace",
                      color: isActive ? BONE50 : BONE500,
                      fontSize: 9,
                    }}
                  >
                    {t(ep.label, lang)}
                  </span>
                  <span
                    className="text-xs font-mono ml-auto tabular-nums"
                    style={{ color: c, fontSize: 9 }}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* progress insight */}
        <p className="text-xs mt-3 leading-relaxed" style={{ color: BONE500 }}>
          <T v={{
            en: "Progress is real — constitutional order produces a step-change. Digital and AI epochs re-open information autonomy. The end-state is conditional.",
            zh: "进步是真实的——宪政秩序带来台阶式的跃升。数字与AI时代重新打开信息自主问题。终态是有条件的。"
          }} />
        </p>
      </div>

      {/* ── playback controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={prev}
          disabled={epochIdx === 0}
          className="px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
          style={{
            background: VOID700,
            border: `1px solid ${VOID600}`,
            color: epochIdx === 0 ? VOID500 : BONE300,
            cursor: epochIdx === 0 ? "not-allowed" : "pointer",
          }}
          aria-label={lang === "zh" ? "上一时代" : "Previous epoch"}
        >
          ← <T v={{ en: "Prev", zh: "上一" }} />
        </button>

        <button
          onClick={togglePlay}
          className="px-5 py-2 rounded-lg text-sm font-mono transition-all duration-200"
          aria-pressed={playing}
          style={{
            background: playing ? LIBERTY500 + "22" : VOID700,
            border: `1px solid ${playing ? LIBERTY500 : VOID600}`,
            color: playing ? LIBERTY300 : BONE300,
            boxShadow: playing ? `0 0 16px ${LIBERTY500}44` : "none",
          }}
        >
          {playing
            ? <T v={{ en: "⏸ Pause", zh: "⏸ 暂停" }} />
            : <T v={{ en: "▶ Play all", zh: "▶ 播放全部" }} />
          }
        </button>

        <button
          onClick={next}
          disabled={epochIdx === EPOCHS.length - 1}
          className="px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
          style={{
            background: VOID700,
            border: `1px solid ${VOID600}`,
            color: epochIdx === EPOCHS.length - 1 ? VOID500 : BONE300,
            cursor: epochIdx === EPOCHS.length - 1 ? "not-allowed" : "pointer",
          }}
          aria-label={lang === "zh" ? "下一时代" : "Next epoch"}
        >
          <T v={{ en: "Next", zh: "下一" }} /> →
        </button>

        {/* epoch position indicator */}
        <span className="ml-auto text-xs font-mono" style={{ color: BONE500 }}>
          {epochIdx + 1} / {EPOCHS.length}
        </span>
      </div>

      {/* ── closing line ── */}
      <div className="rule-warm mt-6 mb-4" />
      <p
        className="text-xs leading-relaxed max-w-2xl"
        style={{
          color: BONE500,
          fontFamily: lang === "zh" ? "Noto Serif SC, serif" : "Spectral, serif",
          fontStyle: "italic",
        }}
      >
        <T v={{
          en: "The arc is not a straight line and not guaranteed. But read across civilisational scales, one direction recurs — the circle of who counts keeps re-opening.",
          zh: "这道弧线并不笔直，也并无保证。但纵观各文明尺度，有一个方向一再回返——「谁算数」之圆，持续地重新打开。"
        }} />
      </p>
    </div>
  );
}
