"use client";

import { useEffect, useState } from "react";

const campaigns = [
  { brand: "LEVEL UP", category: "ACCESORIOS GAMING", title: "Tu próxima", accent: "gran partida.", copy: "Dale otro nivel a tu setup.", action: "Explora el equipo", theme: "gaming" },
  { brand: "NOVA AUDIO", category: "SONIDO SIN LÍMITES", title: "Dale play", accent: "a tu mundo.", copy: "Tu música. Tu ritmo. Tu momento.", action: "Descubre Nova", theme: "audio" },
  { brand: "MODO FINDE", category: "ESCÁPATE DE LA RUTINA", title: "Menos rutina.", accent: "Más aventura.", copy: "Tu próximo plan empieza aquí.", action: "Encuentra tu plan", theme: "travel" }
] as const;

function CampaignArt({ theme }: { theme: typeof campaigns[number]["theme"] }) {
  if (theme === "gaming") return (
    <svg viewBox="0 0 240 160" fill="none" aria-hidden="true">
      <ellipse cx="120" cy="143" rx="77" ry="9" fill="black" opacity=".25" />
      <g transform="rotate(-12 120 80)">
        <path d="M74 47C49 47 40 72 33 111C30 132 49 139 63 122L83 103H157L177 122C191 139 210 132 207 111C200 72 191 47 166 47C151 47 149 54 120 54C91 54 89 47 74 47Z" fill="#e4e9f3" stroke="#fff" strokeWidth="3" />
        <path d="M76 66V96M61 81H91" stroke="#23283c" strokeWidth="9" strokeLinecap="round" />
        <circle cx="168" cy="70" r="6" fill="#a78bfa" /><circle cx="182" cy="84" r="6" fill="#38bdf8" />
        <circle cx="154" cy="84" r="6" fill="#fb7185" /><circle cx="168" cy="98" r="6" fill="#34d399" />
        <circle cx="104" cy="101" r="12" fill="#30364d" /><circle cx="136" cy="101" r="12" fill="#30364d" />
        <rect x="109" y="71" width="22" height="5" rx="2.5" fill="#a78bfa" />
      </g>
      <path d="M29 31H41M35 25V37M201 28H213M207 22V34" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
  if (theme === "audio") return (
    <svg viewBox="0 0 240 160" fill="none" aria-hidden="true">
      <ellipse cx="120" cy="146" rx="65" ry="8" fill="black" opacity=".2" />
      <g transform="rotate(12 120 80)">
        <path d="M66 101V75C66 3 174 3 174 75V101" stroke="#142e41" strokeWidth="19" strokeLinecap="round" />
        <path d="M66 78V73C66 9 174 9 174 73V78" stroke="#d2f7f1" strokeWidth="11" strokeLinecap="round" />
        <rect x="51" y="79" width="34" height="57" rx="16" fill="#d2f7f1" /><rect x="155" y="79" width="34" height="57" rx="16" fill="#d2f7f1" />
        <rect x="73" y="82" width="16" height="50" rx="8" fill="#183a4a" /><rect x="151" y="82" width="16" height="50" rx="8" fill="#183a4a" />
        <path d="M58 95V119M182 95V119" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      </g>
      <path d="M28 65V93M18 73V85M212 65V93M222 73V85" stroke="#5eead4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg viewBox="0 0 240 160" fill="none" aria-hidden="true">
      <circle cx="166" cy="48" r="27" fill="#ffd685" />
      <path d="M14 118L76 43L129 118" fill="#1d766f" /><path d="M72 118L126 66L185 118" fill="#32968a" />
      <path d="M58 65L76 43L93 67L77 61L70 69Z" fill="#d9f6dd" />
      <path d="M13 122C55 101 81 136 122 117C163 98 191 115 227 109V154H13Z" fill="#68c7bc" />
      <path d="M13 139C59 120 75 153 123 136C162 122 197 141 227 127" stroke="#c8f5dc" strokeWidth="4" />
      <path d="M29 37Q38 27 47 37M190 81Q199 71 208 81" stroke="#e9fff1" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DemoAd({ compact = false, large = false, offset = 0 }: { compact?: boolean; large?: boolean; offset?: number }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interval = window.setInterval(() => {
      if (!document.hidden && !preference.matches) setStep((current) => (current + 1) % campaigns.length);
    }, 10_000);
    return () => window.clearInterval(interval);
  }, []);

  const campaign = campaigns[(step + offset) % campaigns.length];

  return (
    <aside aria-label="Publicidad de demostración" className={`demo-ad demo-ad--${compact ? "compact" : large ? "large" : "standard"}`}>
      <article key={campaign.theme} className={`demo-ad__campaign demo-ad--${campaign.theme}`}>
        <div className="demo-ad__glow" aria-hidden="true" />
        <div className="demo-ad__brand"><span className="demo-ad__brand-mark" aria-hidden="true" />{campaign.brand}</div>
        <div className="demo-ad__content">
          <p className="demo-ad__category">{campaign.category}</p>
          <p className="demo-ad__title">{campaign.title}<br /><span>{campaign.accent}</span></p>
          {!compact && <p className="demo-ad__copy">{campaign.copy}</p>}
        </div>
        <div className="demo-ad__art"><CampaignArt theme={campaign.theme} /></div>
        <span className="demo-ad__cta">{campaign.action}<span aria-hidden="true">↗</span></span>
        <div className="demo-ad__footer"><span>Publicidad · Demo</span><div aria-hidden="true" className="demo-ad__dots">{campaigns.map((item) => <i key={item.theme} className={item.theme === campaign.theme ? "is-active" : ""} />)}</div></div>
      </article>
    </aside>
  );
}
