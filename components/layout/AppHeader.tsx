import Link from "next/link";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export default function AppHeader({
  title,
  showBack = false,
  backHref,
  rightSlot,
}: AppHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm max-w-[390px]">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link
            href={backHref ?? "/"}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">
              arrow_back
            </span>
          </Link>
        )}
        {!showBack && (
          <>
            <span className="material-symbols-outlined text-[#8F000D]">
              volunteer_activism
            </span>
            <span className="font-headline font-extrabold text-xl tracking-tight text-[#8F000D]">
              {title ?? "Pomocna Polska"}
            </span>
          </>
        )}
        {showBack && title && (
          <h1 className="font-headline font-bold text-lg tracking-tight text-primary">
            {title}
          </h1>
        )}
      </div>
      {rightSlot && <div>{rightSlot}</div>}
      {!rightSlot && <div className="w-10" />}
    </header>
  );
}
