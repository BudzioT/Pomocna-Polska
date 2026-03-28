import Link from "next/link";
import { mockRequests } from "@/lib/mockData";
import type { HelpRequest } from "@/types";

interface RequestDetailsPageProps {
  params: Promise<{ id: string }>;
}

const fullDescriptions: Record<string, string> = {
  r1: "Dzień dobry, szukam kogoś, kto mógłby pomóc mi w przyniesieniu kilku podstawowych produktów ze sklepu. Mam ograniczoną mobilność i poruszanie się z ciężkimi siatkami jest dla mnie bardzo trudne.",
  r2: "Dzień dobry, szukam kogoś, kto mógłby pomóc mi z większymi zakupami w najbliższy czwartek. Mam problem z kolanem i wniesienie siatek na trzecie piętro (bez windy) jest dla mnie obecnie niemożliwe.",
};

export default async function RequestDetailsPage({ params }: RequestDetailsPageProps) {
  const { id } = await params;
  const request: HelpRequest | undefined = mockRequests.find(
    (r) => r.id === id
  );

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-[390px] md:max-w-full mx-auto px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
          search_off
        </span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          Nie znaleziono ogłoszenia
        </h2>
        <Link
          href="/feed"
          className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold"
        >
          Wróć do listy
        </Link>
      </div>
    );
  }

  const description = fullDescriptions[request.id] ?? request.description;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pb-40 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-4">
          <Link
            href="/feed"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-on-surface">
              arrow_back
            </span>
          </Link>
          <h1 className="text-[#8F000D] font-extrabold text-xl font-headline tracking-tight">
            Szczegóły
          </h1>
        </div>
      </nav>

      <main className="pt-24 px-6">
        {/* Title */}
        <section className="mb-8">
          <h2 className="text-3xl font-extrabold text-on-surface leading-tight mb-6">
            {request.title}
          </h2>
          <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                person
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                {request.author.name}
              </h3>
              {request.distanceKm && (
                <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    location_on
                  </span>
                  <span>{request.distanceKm} km od Ciebie</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-8">
          <p className="text-on-surface-variant leading-relaxed text-[1rem]">
            {description}
          </p>
        </section>

        {/* Tags */}
        <section className="mb-8 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">
            {request.category === "shopping" ? "Zakupy" : request.category}
          </span>
          <span className="px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-xs font-bold uppercase tracking-wider">
            {request.type === "in-person" ? "Na miejscu" : "Zdalnie"}
          </span>
          <span className="px-3 py-1 bg-primary-fixed text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            Pilne
          </span>
        </section>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#FBFBE2]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
        <Link
          href="/feed/modal"
          className="block w-full h-16 bg-primary text-on-primary rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            volunteer_activism
          </span>
          Chcę pomóc
        </Link>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return mockRequests.map((r) => ({ id: r.id }));
}
