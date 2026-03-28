"use client";

import Link from "next/link";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <main className="w-full h-screen bg-surface relative flex flex-col md:flex-row overflow-hidden shadow-2xl mx-auto">
      {/* Hero image section */}
      <section className="relative h-[55%] md:h-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-surface-container-lowest">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl md:w-96 md:h-96 md:-top-24 md:-right-24" />
        <div className="relative z-10 w-full max-w-[320px] md:max-w-md aspect-square flex items-center justify-center mt-4 md:mt-0">
          <div className="absolute inset-0 border-[1.5rem] border-surface-container-high rounded-[3rem] rotate-3 translate-x-2" />
          <Image
            alt="Dwie dłonie w uścisku na tle mapy"
            className="relative z-10 w-full h-full object-cover rounded-[2.5rem] shadow-lg border-4 border-surface-container-lowest"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2CFQeaQTIXLb7oqghZQ60akUBSKRP-VBK116MPwE7k75jVNxeifUMnTbQza22ZbXlBV8d5xS3wj2_O7qZCHCCktgRyAsSAMltFR0_qEIUFAf1BOlDHYUcy2ykKRDM1UNJS6hNyl7tfK7ghBbgdoyvz_EG0DzVRDUjWlDzb2n13zMwcSJblNNiMNCFPWgNDXJAn6T8cQz6xrquvv1PVlmW3DdbV-tNapVu9IkoKL6syWqAR_dLQnBh901hJFqK2sdrk9Ffva8aONF"
            fill
            sizes="(max-width: 768px) 390px, 500px"
          />
          <div className="absolute -bottom-4 -left-4 z-20 bg-secondary-container text-on-secondary-container p-4 rounded-xl shadow-md flex items-center gap-2 md:scale-110 md:-left-8">
            <span className="material-symbols-outlined">volunteer_activism</span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Lokalna Pomoc
            </span>
          </div>
        </div>
      </section>

      <div className="flex-grow md:w-1/2 flex flex-col justify-center bg-surface">
        {/* Text section */}
        <section className="flex flex-col items-center px-10 text-center pt-8 md:pt-0">
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
            Pomocna Polska
          </h1>
          <p className="text-lg md:text-xl font-medium text-on-surface-variant leading-relaxed max-w-md">
            Łączymy sąsiadów, którzy potrzebują pomocy, z tymi, którzy chcą
            pomagać.
          </p>
        </section>

        {/* Choice cards */}
        <section className="p-8 flex flex-col items-center gap-4 md:px-24 md:mt-8">
          <div className="w-full max-w-sm flex flex-col gap-4">
            {/* Register */}
            <Link
              href="/role"
              className="group w-full p-5 bg-primary text-on-primary rounded-2xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <div className="text-left">
                <p className="font-extrabold text-lg leading-tight">Zarejestruj się</p>
                <p className="text-sm text-on-primary/70 font-medium">Jestem tu po raz pierwszy</p>
              </div>
              <span className="material-symbols-outlined ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="group w-full p-5 bg-surface-container-lowest border-2 border-outline-variant/40 rounded-2xl hover:bg-surface-container-low active:scale-95 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-primary">login</span>
              </div>
              <div className="text-left">
                <p className="font-extrabold text-lg text-on-surface leading-tight">Zaloguj się</p>
                <p className="text-sm text-on-surface-variant font-medium">Mam już konto</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
