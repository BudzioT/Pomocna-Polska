"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

type HelpType = "in-person" | "remote";

export default function NewRequestPage() {
  const router = useRouter();
  const [helpType, setHelpType] = useState<HelpType>("in-person");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    router.push("/feed");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen w-full w-full max-w-[390px] md:max-w-full mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#8F000D]">
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#8F000D] tracking-tight">
            Pomocna Polska
          </h1>
        </div>
      </header>

      <main className="flex-1 mt-20 px-6 pb-32">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-on-surface font-bold text-lg">Nowa prośba</h2>
            <span className="text-on-surface-variant text-sm font-medium">
              Krok 2 z 3
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: "66.6%" }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Description textarea */}
          <section>
            <h3 className="text-2xl font-extrabold tracking-tight mb-4 text-on-surface">
              Opisz swoją potrzebę
            </h3>
            <textarea
              className="w-full h-48 p-5 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 resize-none text-lg font-medium outline-none"
              placeholder="Napisz tutaj, w czym możemy Ci pomóc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

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
                      helpType === "in-person"
                        ? "text-white"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      home
                    </span>
                  </button>
                  <button
                    onClick={() => setHelpType("remote")}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${
                      helpType === "remote"
                        ? "text-white"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      phone_in_talk
                    </span>
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
              <Link
                href="/senior-home"
                className="flex-1 md:flex-none py-4 px-6 rounded-xl font-bold text-on-surface bg-surface-container-high hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Wstecz
              </Link>
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

      <BottomNav />
    </div>
  );
}
