import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { MediaType } from "../app/types/MediaType";

interface SideMenuProps {
  isOpen: boolean;
  onMenuToggle: () => void;
  onCheckboxChange: (checkedItems: MediaType[]) => void;
}

export default function SideMenu({ isOpen, onMenuToggle, onCheckboxChange }: SideMenuProps) {
  const [checkedMediaTypes, setCheckedMediaTypes] = useState<MediaType[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    let savedCheckedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]") as MediaType[];

    if (savedCheckedItems.length === 0) {
      savedCheckedItems = [MediaType.NationFlag];
      localStorage.setItem("checkedItems", JSON.stringify(savedCheckedItems));
    }

    return savedCheckedItems;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const value = event.target.value as MediaType;

    setCheckedMediaTypes((prevState) => {
      const nextState = !isChecked ? [...prevState, value] : prevState.filter((type) => type !== value);
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
            const isChecked = checkedMediaTypes.includes(mediaType);
            return (
              <label key={mediaType} className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                <span>{mediaType}</span>
                <input type="checkbox" value={mediaType} checked={!isChecked} onChange={handleChange} className="h-4 w-4" />
              </label>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
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
