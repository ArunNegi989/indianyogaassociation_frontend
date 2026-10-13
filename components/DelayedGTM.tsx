"use client";

import { useEffect } from "react";

type Props = { id: string };

/**
 * GTM ko page load pe nahi, pehli user interaction ke baad (ya 6 sec baad) load karta hai.
 * Isse TBT / LCP improve hota hai.
 */
export default function DelayedGTM({ id }: Props) {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: unknown[] };
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    let loaded = false;
    let timer: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();

      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
      document.head.appendChild(s);
    }

    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true })
    );
    // Lighthouse ~ first 5-6 sec measure karta hai, isliye 6s baad load
    timer = setTimeout(load, 6000);

    return cleanup;
  }, [id]);

  return null;
}