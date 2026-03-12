import Link from "next/link";
import { useEffect, useState } from "react";
import { MediaType } from "../app/types/MediaType";
import DarkModeToggle from "./DarkModeToggle";
import MailingListButton from "./MailingListButton";

interface SideMenuProps {
  isOpen: boolean;
  onMenuToggle: () => void;
  onCheckboxChange: (checkedItems: MediaType[]) => void;
}

export default function SideMenu({ isOpen, onMenuToggle, onCheckboxChange }: SideMenuProps) {
  const [checkedMediaTypes, setCheckedMediaTypes] = useState<MediaType[]>([]);

  useEffect(() => {
    let savedCheckedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]") as MediaType[];

    if (savedCheckedItems.length === 0) {
      savedCheckedItems = [MediaType.NationFlag];
      localStorage.setItem("checkedItems", JSON.stringify(savedCheckedItems));
    }

    setCheckedMediaTypes(savedCheckedItems);
  }, []);

  const handleToggle = (mediaType: MediaType) => {
    setCheckedMediaTypes((prevState) => {
      const isDisabled = prevState.includes(mediaType);
      const nextState = isDisabled ? prevState.filter((type) => type !== mediaType) : [...prevState, mediaType];
      onCheckboxChange(nextState);
      return nextState;
    });
  };

  return (
    <>
      <div className={`tm-drawer-overlay ${isOpen ? "open" : ""}`} onClick={onMenuToggle} />
      <aside className={`tm-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="tm-title text-2xl">Options</h2>
            <p className="text-xs text-slate-500">Disable categories you do not want.</p>
          </div>
          <button type="button" onClick={onMenuToggle} className="tm-btn-ghost !px-3 !py-1.5 text-sm">
            Close
          </button>
        </div>

        <div className="space-y-2">
          {Object.values(MediaType).map((mediaType) => {
            const isDisabled = checkedMediaTypes.includes(mediaType);
            const isEnabled = !isDisabled;
            return (
              <div key={mediaType} className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                <span>{mediaType}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={`${mediaType} ${isEnabled ? "enabled" : "disabled"}`}
                  onClick={() => handleToggle(mediaType)}
                  className={`tm-toggle ${isEnabled ? "tm-toggle-on" : "tm-toggle-off"}`}
                >
                  <span className="tm-toggle-thumb" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <DarkModeToggle />
            <a href="https://x.com/eliothectorson" target="_blank" rel="noreferrer" className="tm-link-chip tm-pill-hover inline-flex items-center gap-2">
              <img src="/images/blurryface_small.jpg" alt="Profile photo for @eliothectorson on X" className="h-5 w-5 rounded-full object-cover" />
              <span>𝕏 Follow @eliothectorson</span>
            </a>
            <MailingListButton />
          </div>
          <Link href="/about" className="tm-link block">
            About
          </Link>
          <Link href="/privacy-policy" className="tm-link block">
            Privacy
          </Link>
          <Link href="/terms" className="tm-link block">
            Terms
          </Link>
          <Link href="/contact" className="tm-link block">
            Contact
          </Link>
        </div>
      </aside>
    </>
  );
}
