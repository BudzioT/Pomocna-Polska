"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { canRequestHelp } from "@/lib/permissions";

type HelpType = "in-person" | "remote";

export default function NewRequestPage() {
  const router = useRouter();
  const [helpType, setHelpType] = useState<HelpType>("in-person");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Read the user_role cookie on the client side
    const match = document.cookie.match(/(?:^|; )user_role=([^;]*)/);
    const userRole = match ? decodeURIComponent(match[1]) : undefined;
    
    if (!canRequestHelp(userRole)) {
      router.replace("/no-access?reason=request");
    } else {
      setRole(userRole);
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = () => {
    if (!description.trim()) return;
    router.push(role === "SEEKER" ? "/profile" : "/map");
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-surface" />; // Pusty ekran podczas szybkiego przekierowania
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#563d91]">volunteer_activism</span>
          <h1 className="font-headline font-extrabold text-xl text-[#563d91] tracking-tight">
            Nowa prośba
          </h1>
        </div>
      </header>

      <main className="pt-20 px-6 pb-8">
        <div className="space-y-8">
          {/* Description textarea */}
          <section>
            <h3 className="text-2xl font-extrabold tracking-tight mb-4 text-on-surface">
              Opisz swoją potrzebę
            </h3>
            <textarea
              className="w-full h-48 p-5 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 resize-none text-lg font-medium outline-none shadow-inner"
              placeholder="Napisz tutaj, w czym możemy Ci pomóc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

          {/* Location input */}
          {helpType === "in-person" && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xl font-extrabold tracking-tight mb-3 text-on-surface">
                Lokalizacja
              </h3>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 text-md font-medium outline-none shadow-inner placeholder:truncate"
                  placeholder="ul. Wiosenna 12, Warszawa"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">
                  location_on
                </span>
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary flex items-center gap-1 active:scale-95"
                  onClick={() => setLocation("Moja bieżąca lokalizacja (GPS)")}
                >
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-on-surface-variant px-1">
                Wpisz adres lub użyj swojej obecnej lokalizacji.
              </p>
            </section>
          )}

          <div className="flex flex-col md:flex-row md:justify-between items-stretch md:items-start gap-8 md:gap-12 w-full">
            {/* Help type toggle */}
            <section className="bg-surface-container-low p-6 rounded-xl space-y-4 flex-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-on-surface font-bold">Rodzaj pomocy</span>
                <div className="flex bg-surface-container-highest p-1 rounded-full w-48 relative">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-300 ${
                      helpType === "in-person" ? "left-1" : "left-[calc(50%+2px)]"
                    }`}
                  />
                  <button
                    onClick={() => setHelpType("in-person")}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${
                      helpType === "in-person" ? "text-white" : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">home</span>
                  </button>
                  <button
                    onClick={() => setHelpType("remote")}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${
                      helpType === "remote" ? "text-white" : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant font-medium">
                {helpType === "in-person"
                  ? "Pomoc na miejscu — wolontariusz przyjedzie do Ciebie."
                  : "Pomoc zdalna — przez telefon lub wideorozmowę."}
              </p>
            </section>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-4 md:w-[40%] shrink-0 md:justify-end mt-4 md:mt-0">
              <button
                onClick={() => router.back()}
                className="flex-1 md:flex-none py-4 px-6 rounded-xl font-bold text-on-surface bg-surface-container-high hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Wstecz
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] md:flex-none py-4 px-6 rounded-xl font-bold text-on-primary bg-primary hover:bg-primary-container transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                Gotowe
                <span className="material-symbols-outlined">check</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role={role} />
    </div>
  );
}
