import Link from "next/link";
import { prisma } from "@/lib/db";

interface RequestDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RequestDetailsPage({ params }: RequestDetailsPageProps) {
  const { id } = await params;

  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

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

  const typeLabel = request.type === "IN_PERSON" ? "Na miejscu" : "Zdalnie";

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
          <h1 className="text-[#6B21A8] font-extrabold text-xl font-headline tracking-tight">
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
              {request.address && (
                <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    location_on
                  </span>
                  <span>{request.address}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-8">
          <p className="text-on-surface-variant leading-relaxed text-[1rem]">
            {request.description}
          </p>
        </section>

        {/* Tags */}
        <section className="mb-8 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-xs font-bold uppercase tracking-wider">
            {typeLabel}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            request.status === "OPEN"
              ? "bg-primary-fixed text-primary"
              : request.status === "IN_PROGRESS"
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-surface-container-high text-on-surface"
          }`}>
            {request.status === "OPEN" ? "Otwarte" : request.status === "IN_PROGRESS" ? "W trakcie" : request.status}
          </span>
        </section>
      </main>

      {/* Floating CTA — only show for OPEN requests */}
      {request.status === "OPEN" && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#FBFBE2]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
          <Link
            href={`/feed/${request.id}/modal`}
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
      )}

      {/* If IN_PROGRESS and user is participant, show link to chat */}
      {request.status === "IN_PROGRESS" && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#FBFBE2]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
          <Link
            href={`/chat/${request.id}`}
            className="block w-full h-16 bg-secondary text-on-secondary rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 active:scale-95 transition-transform duration-150"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            Otwórz czat
          </Link>
        </div>
      )}
    </div>
  );
}
