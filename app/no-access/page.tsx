"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const reasons: Record<string, { icon: string; title: string; description: string }> = {
  feed: {
    icon: "list_alt",
    title: "Brak dostępu do ogłoszeń",
    description:
      'Aby przeglądać prośby o pomoc innych użytkowników, musisz mieć rolę "Wolontariusz". Zmień swoją rolę w ustawieniach profilu.',
  },
  request: {
    icon: "add_circle",
    title: "Brak dostępu do tworzenia próśb",
    description:
      'Aby prosić o pomoc, musisz mieć rolę "Szukający pomocy". Zmień swoją rolę w ustawieniach profilu.',
  },
};

function NoAccessContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "feed";
  const info = reasons[reason] ?? reasons.feed;

  return (
    <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center px-8 text-center">
      <div className="w-24 h-24 bg-error-container rounded-3xl flex items-center justify-center mb-6 shadow-lg">
        <span className="material-symbols-outlined text-on-error-container text-5xl">{info.icon}</span>
      </div>
      <h1 className="text-2xl font-extrabold text-on-surface mb-3">{info.title}</h1>
      <p className="text-on-surface-variant font-medium leading-relaxed max-w-sm mb-8">
        {info.description}
      </p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link
          href="/role"
          className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all text-center"
        >
          Zmień rolę
        </Link>
        <Link
          href="/senior-home"
          className="w-full py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors text-center"
        >
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}

export default function NoAccessPage() {
  return (
    <Suspense>
      <NoAccessContent />
    </Suspense>
  );
}
