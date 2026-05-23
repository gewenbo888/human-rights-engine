import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Human Rights Engine · The Nature of Human Rights, Dignity, Freedom, Power & Civilizational Ethics";
const TITLE_ZH = "人权引擎 · 关于人权、尊严、自由、权力与文明伦理的本质";
const DESC =
  "A civilisation-scale, bilingual exploration of human rights, dignity, freedom, personhood, justice, power, surveillance and AI ethics — reading rights not as slogans but as civilisation's attempt to limit arbitrary power and protect conscious beings from domination.";

export const metadata: Metadata = {
  metadataBase: new URL("https://human-rights-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "human rights", "dignity", "freedom", "liberty", "personhood", "autonomy",
    "justice", "equality", "rule of law", "constitution", "natural rights",
    "civil liberties", "free speech", "privacy", "due process", "slavery",
    "abolition", "colonialism", "surveillance", "social credit", "digital rights",
    "AI rights", "AI personhood", "machine consciousness", "universal human rights",
    "UDHR", "political philosophy", "constitutional law", "civilization ethics",
    "人权", "尊严", "自由", "人格", "自主", "正义", "平等",
    "法治", "宪法", "自然权利", "言论自由", "隐私", "正当程序", "奴隶制",
    "殖民", "监控", "社会信用", "数字权利", "人工智能权利", "AI 人格",
    "世界人权宣言", "政治哲学", "宪政", "文明伦理",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Human Rights Engine · 人权引擎 — the nature of human rights, dignity, freedom, power & civilizational ethics",
      },
    ],
    title: TITLE_EN,
    description:
      "Humans were long treated as property, labour, subjects and soldiers. Human rights are civilisation's slow recognition that conscious beings hold dignity beyond state, tribe, class or power. A bilingual atlas of rights, dignity and the limits of power.",
    url: "https://human-rights-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description:
      "Dignity, freedom, law, slavery, surveillance, digital & AI rights — one bilingual model of how civilisations limit arbitrary power and protect conscious beings from domination.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#070a12" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://human-rights-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-bone-100 antialiased">
        {children}
        <Script
          src="https://analytics-dashboard-two-blue.vercel.app/tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
