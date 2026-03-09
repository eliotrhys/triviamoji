import { ReactNode } from "react";
import TopAdBanner from "./TopAdBanner";

interface AppShellProps {
  children: ReactNode;
  showAds?: boolean;
  adSlotId?: string;
}

export default function AppShell({ children, showAds = true, adSlotId }: AppShellProps) {
  return (
    <div className="tm-bg min-h-screen">
      <div className="mx-auto w-full max-w-[1480px] px-0 pb-10 pt-0 sm:px-6 lg:px-8">
        {showAds ? <TopAdBanner slotId={adSlotId} /> : null}
        <main className="relative z-10 mx-auto mt-3 w-full max-w-[1180px] px-4 sm:px-0">{children}</main>
      </div>
    </div>
  );
}
