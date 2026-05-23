"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { SURVEILLANCE, SurveillanceItem } from "./content";

/* ─── design token colours (matching globals) ─── */
const C = {
  void950: "#070a12",
  void900: "#0a0f1c",
  void800: "#0f1626",
  void700: "#172033",
  void600: "#212c44",
  void500: "#2d3a57",
  liberty500: "#4f9cf0",
  liberty400: "#74b4f6",
  liberty300: "#a6d0fb",
  dignity500: "#e9b54e",
  dignity400: "#f3c976",
  dignity300: "#fadfa6",
  justice500: "#3fc4b0",
  justice400: "#6cd9c8",
  justice300: "#9fe9dd",
  power500: "#e0556b",
  power400: "#ec7d8d",
  power300: "#f4abb5",
  bone50: "#f3f7fd",
  bone100: "#e6edf8",
  bone300: "#bcc8de",
  bone500: "#7f8db0",
};

/* ─── crowd canvas ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  r: number;
  hue: "liberty" | "dignity";
}

function makePt(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.25 + Math.random() * 0.45;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseVx: Math.cos(angle) * speed,
    baseVy: Math.sin(angle) * speed,
    r: 2.5 + Math.random() * 1.5,
    hue: Math.random() < 0.62 ? "liberty" : "dignity",
  };
}

const PARTICLE_COUNT = 64;

function CrowdCanvas({ surveillance }: { surveillance: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptsRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const svRef = useRef(surveillance);
  svRef.current = surveillance;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      // re-clamp existing points
      ptsRef.current.forEach((p) => {
        p.x = Math.min(p.x, rect.width);
        p.y = Math.min(p.y, rect.height);
      });
    };

    // init particles
    const rect = canvas.getBoundingClientRect();
    ptsRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makePt(rect.width, rect.height)
    );
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // eye node (centre)
    const eye = { x: rect.width / 2, y: rect.height / 2 };

    const tick = () => {
      const sv = svRef.current; // 0-100
      const sv01 = sv / 100;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      eye.x = w / 2;
      eye.y = h / 2;

      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = C.void900;
      ctx.fillRect(0, 0, w, h);

      // draw connections lines from each particle → eye when sv is high
      if (sv01 > 0.15) {
        ptsRef.current.forEach((p) => {
          const dist = Math.hypot(p.x - eye.x, p.y - eye.y);
          const maxDist = Math.hypot(w, h) * 0.62;
          const lineFade = Math.max(0, 1 - dist / maxDist) * sv01;
          if (lineFade < 0.03) return;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(eye.x, eye.y);
          // crimson scan beam
          ctx.strokeStyle = `rgba(224,85,107,${lineFade * 0.55})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        });

        // mesh: particles close to each other also connect (surveillance grid)
        const meshOpacity = sv01 * 0.22;
        for (let i = 0; i < ptsRef.current.length; i++) {
          for (let j = i + 1; j < ptsRef.current.length; j++) {
            const a = ptsRef.current[i];
            const b = ptsRef.current[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 72) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(224,85,107,${meshOpacity * (1 - d / 72)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      } else {
        // freedom: soft liberty threads between nearby particles
        for (let i = 0; i < ptsRef.current.length; i++) {
          for (let j = i + 1; j < ptsRef.current.length; j++) {
            const a = ptsRef.current[i];
            const b = ptsRef.current[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 80) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(79,156,240,${0.08 * (1 - d / 80)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // draw eye node
      if (sv01 > 0.18) {
        const eyeGlow = ctx.createRadialGradient(
          eye.x, eye.y, 0, eye.x, eye.y, 28 + sv01 * 14
        );
        eyeGlow.addColorStop(0, `rgba(224,85,107,${sv01 * 0.7})`);
        eyeGlow.addColorStop(0.4, `rgba(224,85,107,${sv01 * 0.25})`);
        eyeGlow.addColorStop(1, "rgba(224,85,107,0)");
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, 28 + sv01 * 14, 0, Math.PI * 2);
        ctx.fillStyle = eyeGlow;
        ctx.fill();

        // eye pupil
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, 5 + sv01 * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,85,107,${0.55 + sv01 * 0.4})`;
        ctx.fill();
      }

      // update + draw particles
      ptsRef.current.forEach((p) => {
        // chilling effect: speed drops as surveillance rises
        const freeze = 1 - sv01 * 0.88;
        p.vx = p.baseVx * freeze;
        p.vy = p.baseVy * freeze;

        p.x += p.vx;
        p.y += p.vy;

        // bounce off walls
        if (p.x < p.r) { p.x = p.r; p.baseVx = Math.abs(p.baseVx); }
        if (p.x > w - p.r) { p.x = w - p.r; p.baseVx = -Math.abs(p.baseVx); }
        if (p.y < p.r) { p.y = p.r; p.baseVy = Math.abs(p.baseVy); }
        if (p.y > h - p.r) { p.y = h - p.r; p.baseVy = -Math.abs(p.baseVy); }

        // dim when watched
        const dimFactor = 1 - sv01 * 0.55;
        const col =
          p.hue === "liberty"
            ? `rgba(116,180,246,${0.8 * dimFactor})`
            : `rgba(243,201,118,${0.8 * dimFactor})`;
        const glow =
          p.hue === "liberty"
            ? `rgba(79,156,240,${0.18 * dimFactor})`
            : `rgba(233,181,78,${0.18 * dimFactor})`;

        // halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}

/* ─── intensity bar ─── */
function IntensityBar({
  value,
  selected,
}: {
  value: number;
  selected: boolean;
}) {
  // color: power (crimson) at high intensity → justice (teal) at low
  const high = value > 65;
  const low = value < 35;
  const barColor = low
    ? C.justice400
    : high
    ? C.power400
    : C.dignity400;
  const glowColor = low
    ? "rgba(108,217,200,0.28)"
    : high
    ? "rgba(236,125,141,0.28)"
    : "rgba(243,201,118,0.22)";

  return (
    <div
      className="relative h-1.5 w-full rounded-full overflow-hidden"
      style={{ background: C.void600 }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: barColor,
          boxShadow: selected ? `0 0 8px 2px ${glowColor}` : "none",
        }}
      />
    </div>
  );
}

/* ─── main component ─── */
export default function SurveillanceLab() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<string>(SURVEILLANCE[0].id);
  const [globalSv, setGlobalSv] = useState<number>(60);

  const selectedItem = SURVEILLANCE.find((s) => s.id === selected) ?? SURVEILLANCE[0];

  // Derive a "crowd surveillance" level from the selected tech's intensity + the slider
  const crowdLevel = Math.round(
    selectedItem.intensity * 0.5 + globalSv * 0.5
  );

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalSv(Number(e.target.value));
    },
    []
  );

  // caption text
  const watched = crowdLevel > 54;
  const caption = {
    en: watched
      ? "When everyone is watched, people self-censor — surveillance shrinks freedom without a single arrest."
      : "In the open network, movement is free — the crowd disperses into a field of mutual recognition.",
    zh: watched
      ? "当所有人都被监视，人们会自我审查——监控无需一次逮捕，便已收缩自由。"
      : "在开放的网络里，运动是自由的——人群散入彼此承认的场域之中。",
  };

  return (
    <section
      className="w-full"
      style={{ background: C.void950, color: C.bone100 }}
      aria-label={lang === "zh" ? "监控实验室" : "Surveillance Lab"}
    >
      {/* ── header ── */}
      <div
        className="border-b px-6 py-5"
        style={{ borderColor: `${C.void600}` }}
      >
        <p
          className="label-mono mb-1"
          style={{ color: C.bone500, fontSize: "0.65rem", letterSpacing: "0.12em" }}
        >
          <T v={{ en: "SECTION 07 · DIGITAL RIGHTS", zh: "第 07 节 · 数字权利" }} />
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(1.35rem,3vw,2rem)", color: C.bone50, lineHeight: 1.15 }}
        >
          <T v={{ en: "Surveillance Lab", zh: "监控实验室" }} />
        </h2>
        <p
          className="mt-1"
          style={{ color: C.bone500, fontSize: "0.82rem", maxWidth: 560 }}
        >
          <T
            v={{
              en: "None of these tools is evil by nature. The century's question is procedural: who sees, who decides, who can appeal.",
              zh: "这些工具没有一件天生邪恶。本世纪的问题是程序性的：谁在看，谁来决定，谁能申诉。",
            }}
          />
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0">
        {/* ── LEFT: technology list ── */}
        <div
          className="border-r flex flex-col"
          style={{ borderColor: C.void600 }}
        >
          {/* privacy slider */}
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: C.void700 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="label-mono"
                style={{ fontSize: "0.62rem", color: C.bone500, letterSpacing: "0.1em" }}
              >
                <T v={{ en: "VISIBILITY LEVEL", zh: "能见度水平" }} />
              </span>
              <span
                className="font-mono"
                style={{ fontSize: "0.7rem", color: globalSv > 54 ? C.power400 : C.justice400 }}
              >
                {globalSv}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={globalSv}
              onChange={handleSlider}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${C.justice400} 0%, ${C.power400} 100%)`,
                accentColor: globalSv > 54 ? C.power400 : C.justice400,
              }}
              aria-label={lang === "zh" ? "能见度滑块" : "Visibility slider"}
            />
            <div
              className="flex justify-between mt-1"
              style={{ fontSize: "0.58rem", color: C.bone500 }}
            >
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? "← 私密" : "← Private"}
              </span>
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? "可见 →" : "Visible →"}
              </span>
            </div>
          </div>

          {/* tech cards */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 420 }}>
            {SURVEILLANCE.map((item) => {
              const isSelected = item.id === selected;
              const low = item.intensity < 35;
              const high = item.intensity > 65;
              const accentColor = low
                ? C.justice400
                : high
                ? C.power400
                : C.dignity400;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  aria-pressed={isSelected}
                  className="w-full text-left px-6 py-4 border-b transition-all duration-200 focus-visible:outline-none"
                  style={{
                    borderColor: C.void700,
                    background: isSelected ? C.void800 : "transparent",
                    borderLeft: isSelected
                      ? `3px solid ${accentColor}`
                      : "3px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`font-medium ${lang === "zh" ? "zh" : ""}`}
                      style={{
                        color: isSelected ? C.bone50 : C.bone300,
                        fontSize: "0.88rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {t(item.label, lang)}
                    </span>
                    <span
                      className="font-mono shrink-0 mt-0.5"
                      style={{
                        fontSize: "0.65rem",
                        color: accentColor,
                        background: `${accentColor}18`,
                        border: `1px solid ${accentColor}44`,
                        borderRadius: 4,
                        padding: "1px 5px",
                      }}
                    >
                      {item.intensity}
                    </span>
                  </div>
                  <IntensityBar value={item.intensity} selected={isSelected} />
                  <div
                    className="mt-1.5 flex justify-between"
                    style={{ fontSize: "0.58rem", color: C.bone500 }}
                  >
                    <span className={lang === "zh" ? "zh" : ""}>
                      {lang === "zh" ? "← 低影响" : "← Low reach"}
                    </span>
                    <span className={lang === "zh" ? "zh" : ""}>
                      {lang === "zh" ? "高影响 →" : "High reach →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: detail + canvas ── */}
        <div className="flex flex-col">
          {/* detail panel */}
          <div
            className="px-6 py-5 border-b"
            style={{ borderColor: C.void700 }}
          >
            <h3
              key={`${selected}-${lang}`}
              className={`lang-fade font-semibold mb-4 ${lang === "zh" ? "zh" : ""}`}
              style={{ fontSize: "clamp(1rem,2.2vw,1.3rem)", color: C.bone50 }}
            >
              {t(selectedItem.label, lang)}
            </h3>

            {/* benefit */}
            <div
              className="rounded-lg p-4 mb-3"
              style={{ background: `${C.justice500}0d`, border: `1px solid ${C.justice500}30` }}
            >
              <p
                className="label-mono mb-2"
                style={{ fontSize: "0.6rem", color: C.justice400, letterSpacing: "0.12em" }}
              >
                <T v={{ en: "WHAT IT ENABLES · 它成就什么", zh: "它成就什么 · WHAT IT ENABLES" }} />
              </p>
              <p
                key={`benefit-${selected}-${lang}`}
                className={`lang-fade leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ fontSize: "0.84rem", color: C.bone100 }}
              >
                {t(selectedItem.benefit, lang)}
              </p>
            </div>

            {/* risk */}
            <div
              className="rounded-lg p-4"
              style={{ background: `${C.power500}0d`, border: `1px solid ${C.power500}30` }}
            >
              <p
                className="label-mono mb-2"
                style={{ fontSize: "0.6rem", color: C.power400, letterSpacing: "0.12em" }}
              >
                <T v={{ en: "WHAT IT COSTS · 它的代价", zh: "它的代价 · WHAT IT COSTS" }} />
              </p>
              <p
                key={`risk-${selected}-${lang}`}
                className={`lang-fade leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ fontSize: "0.84rem", color: C.bone100 }}
              >
                {t(selectedItem.risk, lang)}
              </p>
            </div>
          </div>

          {/* canvas */}
          <div className="flex-1 relative" style={{ minHeight: 240 }}>
            <CrowdCanvas surveillance={crowdLevel} />

            {/* crowd level indicator */}
            <div
              className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none"
              style={{
                background: `${C.void900}cc`,
                borderRadius: 6,
                padding: "4px 10px",
                border: `1px solid ${C.void600}`,
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "0.6rem",
                  color: crowdLevel > 54 ? C.power400 : C.justice400,
                  letterSpacing: "0.1em",
                }}
              >
                {crowdLevel > 54 ? "●" : "○"}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: "0.6rem", color: C.bone500 }}
              >
                {lang === "zh"
                  ? crowdLevel > 54
                    ? "监控场景"
                    : "自由场景"
                  : crowdLevel > 54
                  ? "surveillance mode"
                  : "open network"}
              </span>
            </div>

            {/* chilling effect caption */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${C.void900}f0 0%, transparent 100%)`,
              }}
            >
              <p
                key={`caption-${watched}-${lang}`}
                className={`lang-fade text-center ${lang === "zh" ? "zh" : ""}`}
                style={{
                  fontSize: "0.72rem",
                  color: watched ? C.power300 : C.justice300,
                  lineHeight: 1.5,
                  maxWidth: 380,
                  margin: "0 auto",
                }}
              >
                {caption[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── footer note ── */}
      <div
        className="px-6 py-4 border-t"
        style={{ borderColor: C.void700 }}
      >
        <p
          className={`text-center ${lang === "zh" ? "zh" : ""}`}
          style={{ fontSize: "0.75rem", color: C.bone500, maxWidth: 640, margin: "0 auto" }}
        >
          <T
            v={{
              en: "Intensity scores model each technology's structural reach over private life — not a verdict on any specific deployment. The thesis holds across all: the design of oversight matters more than the tool itself.",
              zh: "强度分值，量度各项技术对私人生活的结构性触达——而非对任何具体部署的裁决。论点贯穿所有：监督机制的设计，比工具本身更要紧。",
            }}
          />
        </p>
      </div>
    </section>
  );
}
