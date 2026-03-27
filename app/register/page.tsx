"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/senior-home");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center max-w-[390px] mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm max-w-[390px]">
        <Link
          href="/role"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">
            arrow_back
          </span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight text-primary">
          Utwórz konto
        </h1>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-[390px] px-8 pt-24 pb-12 flex flex-col flex-grow relative overflow-hidden">
        {/* Decorative background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />

        {/* Heading */}
        <div className="mb-10 relative z-10">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">
              volunteer_activism
            </span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface leading-tight">
            Zacznijmy od <br />
            podstaw
          </h2>
          <p className="text-on-surface-variant mt-3 font-medium">
            Dołącz do społeczności wzajemnej pomocy w Twojej okolicy.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">
              Imię
            </label>
            <div className="relative group">
              <input
                className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                placeholder="Wpisz swoje imię"
                type="text"
                required
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                person
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">
              Numer telefonu
            </label>
            <div className="flex h-14 space-x-3">
              <div className="flex items-center space-x-2 bg-surface-container-highest rounded-xl px-4 border-none shrink-0">
                <span className="font-bold text-on-surface">+48</span>
              </div>
              <div className="relative flex-grow">
                <input
                  className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                  placeholder="000 000 000"
                  type="tel"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                  smartphone
                </span>
              </div>
            </div>
          </div>

          <button
            className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-xl shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4"
            type="submit"
          >
            <span>Wyślij kod SMS</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10 relative z-10">
          <div className="flex-grow h-px bg-outline-variant/30" />
          <span className="px-4 text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
            lub
          </span>
          <div className="flex-grow h-px bg-outline-variant/30" />
        </div>

        {/* Profil Zaufany */}
        <div className="space-y-4 relative z-10">
          <Link
            href="/senior-home"
            className="w-full h-14 border-2 border-outline-variant/40 bg-white/50 backdrop-blur-sm text-on-surface font-bold rounded-xl flex items-center justify-center space-x-3 hover:bg-surface-container-low transition-colors active:scale-[0.98]"
          >
            Zaloguj przez Profil Zaufany
          </Link>
        </div>
      </main>
    </div>
  );
}
