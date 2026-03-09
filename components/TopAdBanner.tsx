"use client";

import { useEffect } from "react";

interface TopAdBannerProps {
  slotId?: string;
}

export default function TopAdBanner({ slotId }: TopAdBannerProps) {
  const shouldRenderAd = Boolean(slotId);

  useEffect(() => {
    if (!shouldRenderAd || typeof window === "undefined") {
      return;
    }

    try {
      const queue = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = queue;
      queue.push({});
    } catch {
      // Ignore ad failures to keep gameplay uninterrupted.
    }
  }, [shouldRenderAd]);

  return (
    <section className="tm-top-ad" aria-label="Advertisement">
      <div className="tm-ad-label">Advertisement</div>
      {shouldRenderAd ? (
        <ins
          className="adsbygoogle block h-full w-full"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8259590562391591"
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="tm-ad-placeholder">Wide Ad Slot</div>
      )}
    </section>
  );
}
