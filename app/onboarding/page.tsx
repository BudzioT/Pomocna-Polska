import Link from "next/link";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <main className="w-full max-w-[390px] h-screen bg-surface relative flex flex-col overflow-hidden shadow-2xl mx-auto">
      {/* Hero image section */}
      <section className="relative h-[55%] w-full flex flex-col items-center justify-center p-8">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="relative z-10 w-full aspect-square flex items-center justify-center">
          <div className="absolute inset-0 border-[1.5rem] border-surface-container-high rounded-[3rem] rotate-3 translate-x-2" />
          <Image
            alt="Dwie dłonie w uścisku na tle mapy"
            className="relative z-10 w-full h-full object-cover rounded-[2.5rem] shadow-lg border-4 border-surface-container-lowest"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2CFQeaQTIXLb7oqghZQ60akUBSKRP-VBK116MPwE7k75jVNxeifUMnTbQza22ZbXlBV8d5xS3wj2_O7qZCHCCktgRyAsSAMltFR0_qEIUFAf1BOlDHYUcy2ykKRDM1UNJS6hNyl7tfK7ghBbgdoyvz_EG0DzVRDUjWlDzb2n13zMwcSJblNNiMNCFPWgNDXJAn6T8cQz6xrquvv1PVlmW3DdbV-tNapVu9IkoKL6syWqAR_dLQnBh901hJFqK2sdrk9Ffva8aONF"
            fill
            sizes="390px"
          />
          <div className="absolute -bottom-4 -left-4 z-20 bg-secondary-container text-on-secondary-container p-4 rounded-xl shadow-md flex items-center gap-2">
            <span className="material-symbols-outlined">volunteer_activism</span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Lokalna Pomoc
            </span>
          </div>
        </div>
      </section>

      {/* Text section */}
      <section className="flex-grow flex flex-col items-center px-10 text-center pt-8">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
          Pomocna Polska
        </h1>
        <p className="text-lg font-medium text-on-surface-variant leading-relaxed">
          Łączymy sąsiadów, którzy potrzebują pomocy, z tymi, którzy chcą
          pomagać.
        </p>
      </section>

      {/* Actions */}
      <section className="p-8 pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          <div className="w-8 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-outline-variant" />
          <div className="w-2 h-2 rounded-full bg-outline-variant" />
        </div>
        <div className="w-full flex flex-col gap-4">
          <Link
            href="/role"
            className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-xl shadow-sm hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            Dalej
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
          <Link
            href="/register"
            className="w-full py-2 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors text-center"
          >
            Pomiń
          </Link>
        </div>
      </section>
    </main>
  );
}
