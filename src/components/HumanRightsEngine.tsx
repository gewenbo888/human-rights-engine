"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, CONCEPTS } from "./content";

import DignityField from "./DignityField";
import RightsTimeline from "./RightsTimeline";
import MoralCircle from "./MoralCircle";
import FreedomPowerMap from "./FreedomPowerMap";
import ConstitutionLab from "./ConstitutionLab";
import OppressionTimeline from "./OppressionTimeline";
import RightsLadder from "./RightsLadder";
import SurveillanceLab from "./SurveillanceLab";
import AIRightsMap from "./AIRightsMap";
import UniversalismMap from "./UniversalismMap";
import RightsStabilityModel from "./RightsStabilityModel";
import RecursiveRightsEngine from "./RecursiveRightsEngine";
import RightsAnalyst from "./RightsAnalyst";

const VIS: Record<string, ReactNode> = {
  origin: <RightsTimeline />,
  dignity: <MoralCircle />,
  freedom: <FreedomPowerMap />,
  law: <ConstitutionLab />,
  oppression: <OppressionTimeline />,
  economic: <RightsLadder />,
  digital: <SurveillanceLab />,
  ai: <AIRightsMap />,
  universalism: <UniversalismMap />,
};

const NAV: { id: string; en: string; zh: string }[] = [
  { id: "origin", en: "Origin", zh: "起源" },
  { id: "dignity", en: "Dignity", zh: "尊严" },
  { id: "freedom", en: "Freedom", zh: "自由" },
  { id: "law", en: "Law", zh: "法治" },
  { id: "digital", en: "Digital", zh: "数字" },
  { id: "model", en: "Model", zh: "模型" },
  { id: "engine", en: "Engine", zh: "引擎" },
  { id: "analyst", en: "Analyst", zh: "分析" },
];

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <radialGradient id="logo-g" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#fadfa6" />
          <stop offset="45%" stopColor="#e9b54e" />
          <stop offset="100%" stopColor="#4f9cf0" />
        </radialGradient>
      </defs>
      <path d="M6 19 A10 10 0 0 1 26 19" fill="none" stroke="#4f9cf0" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
      <circle cx="16" cy="13.4" r="2.7" fill="url(#logo-g)" />
      <path d="M16 16 L16 21.5 M16 17.6 L12.4 19.4 M16 17.6 L19.6 19.4" stroke="url(#logo-g)" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <line x1="8" y1="25" x2="24" y2="25" stroke="#3fc4b0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Header() {
  const { lang } = useLang();
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-liberty-500/12 bg-void-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-liberty-500/25 bg-void-800">
          <Logo />
        </div>
        <div className="leading-tight">
          <div className="display text-base text-bone-50">Human Rights Engine</div>
          <div className="zh text-[0.6rem] text-bone-500">人权引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-500 lg:flex">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="hover:text-liberty-300">
            {lang === "zh" ? n.zh : n.en}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a
          href="https://psyverse.fun"
          className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-justice-400 hover:text-liberty-300 sm:block"
        >
          ← Psyverse
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <DignityField />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/30 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · the architecture of dignity & the limits of power</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone-500">
          EN · 中文 · dignity × freedom × law × power × surveillance × ai ethics × civilisation
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.92] text-bone-50 md:text-8xl">
          Human Rights <span className="glow-text">Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-bone-200 md:text-5xl">人权引擎</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-bone-100 md:text-xl">
          <T
            v={{
              en: "For most of history, human beings were treated as property, labour, subjects and soldiers. Human rights are civilisation's slow, unfinished recognition that a person holds dignity beyond state, tribe, class, religion or ruler. This is a bilingual atlas of how that recognition was won — and how it is kept.",
              zh: "在历史的大部分时间里，人被当作财产、劳力、臣民与士兵。人权，是文明缓慢而未竟的承认：人拥有一种超越国家、部落、阶级、宗教与统治者的尊严。这是一部双语图志，关于那份承认如何被赢得——又如何被守住。",
            }}
          />
        </p>

        <div className="mt-10 max-w-2xl rounded-lg border border-liberty-500/15 bg-void-900/70 p-6 backdrop-blur">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-bone-50 md:text-2xl">
            <T
              v={{
                en: "Human rights are not slogans, but a civilisation's standing answer to one permanent danger — that the powerful will treat the powerless as material. A right is a place where power is told 'no' in advance.",
                zh: "人权不是口号，而是一个文明对一种恒久危险所给出的长期答案——强者会把弱者当作材料。一项权利，是一处「权力被预先告知『不可』」之地。",
              }}
            />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-500">
          <span>10 systems · 十大系统</span>
          <span>1 unified model · 一个统一模型</span>
          <span>the circle of who counts keeps widening</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({
  num,
  id,
  title,
  sub,
  body,
  vis,
  concepts,
}: {
  num: string;
  id: string;
  title: any;
  sub: any;
  body: any;
  vis?: ReactNode;
  concepts?: { t: any; d: any }[];
}) {
  const { lang } = useLang();
  return (
    <section id={id} className="relative border-t border-liberty-500/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl text-liberty-500/30">{num}</span>
          <div>
            <h2 className="display text-4xl text-bone-50 md:text-5xl">
              <T v={title} />
            </h2>
            <h3 className="mt-1 text-lg text-justice-400">
              <T v={sub} />
            </h3>
          </div>
        </div>
        <div className="mt-5 rule-warm opacity-60" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
          <T v={body} />
        </p>
        {vis && <div className="mt-12">{vis}</div>}
        {concepts && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((c, i) => (
              <div key={i} className="card rounded-xl p-5">
                <div key={`t-${lang}`} className={`display text-lg text-dignity-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.t[lang]}
                </div>
                <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.d[lang]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  const unified = SECTIONS.find((s) => s.id === "unified")!;
  return (
    <main className="relative bg-void-950 text-bone-100">
      <Header />
      <Hero />

      {/* marquee */}
      <div className="overflow-hidden border-y border-liberty-500/12 bg-void-900/60 py-2.5">
        <div className="whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.3em] text-justice-400/80">
          {(lang === "zh"
            ? "尊严 · 自由 · 平等 · 法治 · 正当程序 · 隐私 · 良心 · 庇护 · 人人生而自由，在尊严与权利上一律平等 · 权利是对任意权力的约束 · "
            : "DIGNITY · FREEDOM · EQUALITY · RULE OF LAW · DUE PROCESS · PRIVACY · CONSCIENCE · ASYLUM · ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS · A RIGHT IS A CONSTRAINT ON ARBITRARY POWER · ").repeat(2)}
        </div>
      </div>

      {/* sections 01–09 */}
      {SECTIONS.filter((s) => s.id !== "unified").map((s) => (
        <SectionBlock
          key={s.id}
          num={s.num}
          id={s.id}
          title={s.title}
          sub={s.sub}
          body={s.body}
          vis={VIS[s.id]}
          concepts={CONCEPTS[s.id]}
        />
      ))}

      {/* Article 1 interlude */}
      <section id="article-1" className="relative border-t border-liberty-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="label-mono">Universal Declaration of Human Rights · 世界人权宣言 · Article 1</div>
          <p className="mx-auto mt-7 max-w-3xl font-serif text-2xl leading-relaxed text-bone-50 md:text-3xl">
            <T
              v={{
                en: "“All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.”",
                zh: "「人人生而自由，在尊严和权利上一律平等。他们赋有理性和良心，并应以兄弟关系的精神相对待。」",
              }}
            />
          </p>
          <p className="mt-7 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone-500">1948 · Paris · adopted by 48 nations</p>
        </div>
      </section>

      {/* unified meta-model */}
      <section id="model" className="relative border-t border-liberty-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-5xl text-liberty-500/30">{unified.num}</span>
            <div>
              <h2 className="display text-4xl text-bone-50 md:text-5xl">
                <T v={unified.title} />
              </h2>
              <h3 className="mt-1 text-lg text-justice-400">
                <T v={unified.sub} />
              </h3>
            </div>
          </div>
          <div className="mt-5 rule-warm opacity-60" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T v={unified.body} />
          </p>
          <div className="mt-8 max-w-3xl rounded-lg border border-dignity-500/20 bg-void-900/60 p-5">
            <div className="label-mono" style={{ color: "#fadfa6" }}>Meta-model · 元模型</div>
            <p className="mt-2 font-mono text-sm leading-relaxed text-bone-200">
              {lang === "zh"
                ? "人权稳定度 = 尊严的承认 + 制度性约束 + 法律保护 + 自由的存续 + 经济参与 + 信息自主 + 免于任意权力"
                : "Human Rights Stability = Dignity Recognition + Institutional Constraints + Legal Protection + Freedom Preservation + Economic Participation + Information Autonomy + Protection from Arbitrary Power"}
            </p>
          </div>
          <div className="mt-12">
            <RightsStabilityModel />
          </div>
        </div>
      </section>

      {/* recursive engine */}
      <section id="engine" className="relative border-t border-liberty-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The recursive engine · 递归引擎</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "How Rights Evolve Across Civilisations", zh: "权利如何跨越文明演化" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Run the same seven forces forward through history — from the tribal band to the agrarian empire, the constitutional order, industrial society, digital governance, AI-mediated systems, synthetic minds and a possible planetary civilisation. Watch which protections rise, which collapse, and how the circle of who counts re-opens at each new scale.",
                zh: "让同样的七种力量在历史中向前运行——从部落游群，到农耕帝国、宪政秩序、工业社会、数字治理、AI 中介的系统、合成心智，再到一种可能的行星文明。看哪些保护上升，哪些崩塌，以及「谁算数」之圆，如何在每一个新的尺度上重新打开。",
              }}
            />
          </p>
          <div className="mt-12">
            <RecursiveRightsEngine />
          </div>
        </div>
      </section>

      {/* AI layer */}
      <section id="analyst" className="relative border-t border-liberty-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">AI layer · 人工智能层</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "The Rights Analyst", zh: "人权分析师" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Ask a real question about rights, dignity or power, and hear it answered through six lenses at once — philosopher, constitutional scholar, historian, ethicist, political theorist and AI-governance analyst. Not slogans for any side, but the structure of the question, seen from six heights.",
                zh: "提出一个关于权利、尊严或权力的真实问题，听它同时从六重视角被回答——哲学家、宪法学者、历史学家、伦理学家、政治理论家，与 AI 治理分析师。不是为任何一方而设的口号，而是这个问题的结构，从六种高度被看见。",
              }}
            />
          </p>
          <div className="mt-12">
            <RightsAnalyst />
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="relative border-t border-liberty-500/10 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px w-40 rule-warm" />
          <h2 className="display text-4xl leading-snug text-bone-50 md:text-6xl">
            <T
              v={{
                en: "Rights are won slowly, and lost quickly. Every generation re-decides whether to keep them.",
                zh: "权利获得缓慢，失去迅速。每一代人，都在重新决定，是否要将它们留住。",
              }}
            />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-bone-300">
            <T
              v={{
                en: "Across philosophy, law, history and technology, the same pattern returns. A right is a place where power is told no. The arc of dignity is the slow widening of the circle of beings to whom that no applies — and the future of civilisation may hinge on whether our most powerful systems, states, markets and machines, keep saying it.",
                zh: "穿越哲学、法律、历史与技术，同一个模式一再回返。一项权利，是一处「权力被告知『不可』」之地。尊严的弧线，是「这声『不可』所适用的存在之圆」的缓慢扩大——而文明的未来，或许系于：我们最强大的系统，国家、市场与机器，是否仍在说出它。",
              }}
            />
          </p>
          <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-justice-400/70">
            Human Rights Engine · 人权引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-liberty-500/12 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-bone-50">Human Rights Engine</div>
            <div className="zh mt-1 text-sm text-bone-300">人权引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-500">
              <T
                v={{
                  en: "How dignity, freedom, law, oppression, surveillance and AI ethics converge into one model of how civilisations limit arbitrary power and protect conscious beings.",
                  zh: "尊严、自由、法律、压迫、监控与 AI 伦理，如何汇聚成一个模型——关于文明如何限制任意权力、护卫有意识的存在。",
                }}
              />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-bone-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-liberty-300">
                    {s.num} · <T v={s.title} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-bone-300">
              <li><a href="https://rule-of-law-engine.psyverse.fun" className="hover:text-liberty-300">Rule of Law Engine · 法治引擎</a></li>
              <li><a href="https://equality-engine.psyverse.fun" className="hover:text-liberty-300">Equality Engine · 平等引擎</a></li>
              <li><a href="https://great-convergence.psyverse.fun" className="hover:text-liberty-300">The Great Convergence · 大汇流</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-justice-400 hover:text-liberty-300">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-warm" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-bone-500">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · an atlas of dignity</div>
        </div>
      </footer>
    </main>
  );
}

export default function HumanRightsEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
