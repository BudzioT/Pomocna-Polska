import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "@/components/layout/BottomNav";

export default async function SeniorHomePage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen w-full max-w-[390px] md:max-w-full mx-auto relative pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-5 bg-[#f5f5dd] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[#563d91]"
            style={{ fontSize: "2.5rem" }}
          >
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl tracking-tight text-[#563d91]">
            Pomocna Polska
          </h1>
        </div>
        <button className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-95">
          <span
            className="material-symbols-outlined text-[#563d91]"
            style={{ fontSize: "2.5rem" }}
          >
            notifications
          </span>
        </button>
      </header>

      <main className="pt-28 px-5">
        {/* Primary CTA */}
        <section className="mb-8">
          <Link
            href="/new-request"
            className="w-full h-24 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-4 shadow-[0_8px_30px_rgba(27,29,14,0.08)] active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: "'FILL' 1",
                fontSize: "2.5rem",
              }}
            >
              add_circle
            </span>
            <span className="text-2xl font-bold">Poproś o pomoc</span>
          </Link>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 px-1">Czego szukasz?</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/feed"
              className="flex flex-col items-center justify-center p-6 bg-surface-container-high rounded-3xl shadow-[0_8px_30px_rgba(27,29,14,0.08)] border-2 border-transparent active:border-primary"
            >
              <span
                className="material-symbols-outlined text-secondary mb-2"
                style={{ fontSize: "2.5rem" }}
              >
                shopping_basket
              </span>
              <span className="text-lg font-bold">Zakupy</span>
            </Link>
            <Link
              href="/feed"
              className="flex flex-col items-center justify-center p-6 bg-surface-container-high rounded-3xl shadow-[0_8px_30px_rgba(27,29,14,0.08)] border-2 border-transparent active:border-primary"
            >
              <span
                className="material-symbols-outlined text-secondary mb-2"
                style={{ fontSize: "2.5rem" }}
              >
                health_and_safety
              </span>
              <span className="text-lg font-bold">Leki</span>
            </Link>
          </div>
        </section>

        {/* Recent listings */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold mb-4 px-1">Ostatnie ogłoszenia</h2>
          <div className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_8px_30px_rgba(27,29,14,0.08)] flex flex-col gap-4 relative overflow-hidden border-l-8 border-secondary-container">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-secondary-container"
                  style={{ fontSize: "2.5rem" }}
                >
                  shopping_cart
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-on-surface">
                  Anna
                </h3>
                <p className="text-lg font-medium text-secondary">
                  200 metrów stąd
                </p>
              </div>
            </div>
            <p className="text-xl leading-relaxed text-on-surface-variant font-medium">
              Potrzebuję pomocy przy wniesieniu zakupów na 3 piętro.
            </p>
            <Link
              href="/request/r2"
              className="w-full h-16 bg-primary-container text-on-primary-container rounded-2xl text-xl font-bold mt-2 active:scale-95 transition-transform flex items-center justify-center"
            >
              Pomóż Annie
            </Link>
          </div>
        </section>
      </main>

      <BottomNav role={role} />
    </div>
  );
}
