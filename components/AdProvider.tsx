"use client";

import Script from "next/script";
import { createContext, useContext, useState } from "react";
import { adsEnabled, adsenseClient } from "@/lib/ads";

const AdReadyContext = createContext(false);
export function useAdReady() { return useContext(AdReadyContext); }

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <AdReadyContext.Provider value={ready}>
      {children}
      {adsEnabled && (
        <Script id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive" crossOrigin="anonymous" onReady={() => setReady(true)} />
      )}
    </AdReadyContext.Provider>
  );
}
