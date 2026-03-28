import Link from "next/link";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import FinishRequestButton from "./FinishRequestButton";

interface RequestDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RequestDetailsPage({ params }: RequestDetailsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_id")?.value;

  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true, phoneNumber: true },
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

  // Fetch manually to avoid Prisma generic crash when volunteer User has been deleted from DB
  const rawConversations = await prisma.conversation.findMany({
    where: { requestId: id }
  });
  
  const volunteerIds = rawConversations.map((c: any) => c.volunteerId);
  const volunteers = await prisma.user.findMany({
    where: { id: { in: volunteerIds } },
    select: { id: true, name: true, avatarUrl: true }
  });

  const conversations = rawConversations.map((conv: any) => ({
    ...conv,
    volunteer: volunteers.find((v: any) => v.id === conv.volunteerId) || { id: conv.volunteerId, name: "Usunięty wolontariusz", avatarUrl: null }
  }));

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
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-on-surface">
                  {request.author.name}
                </h3>
                {request.type === "REMOTE" && currentUserId && request.authorId !== currentUserId && request.author.phoneNumber && (
                  <a href={`tel:${request.author.phoneNumber}`} className="flex items-center gap-1 text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    {request.author.phoneNumber}
                  </a>
                )}
              </div>
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
            {request.status === "OPEN" ? "Otwarte" : request.status === "IN_PROGRESS" ? "W trakcie" : request.status === "COMPLETED" ? "Zakończone" : request.status}
          </span>
        </section>

        {/* Helper tiles (only for author) */}
        {currentUserId === request.authorId && conversations.length > 0 && (
          <section className="mb-8 mt-4">
            <h3 className="text-xl font-bold mb-4">Osoby chcące pomóc:</h3>
            <div className="flex flex-col gap-3">
              {conversations.map((conv: any) => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {conv.volunteer.avatarUrl ? (
                      <img src={conv.volunteer.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border border-primary/20" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-on-primary-container">person</span>
                      </div>
                    )}
                    <span className="font-bold text-on-surface text-lg">{conv.volunteer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-primary">Rozmowa</span>
                     <span className="material-symbols-outlined text-primary">chat</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating CTA */}
      {(() => {
        const isAuthor = currentUserId === request.authorId;
        const volunteerConversation = conversations.find((c: any) => c.volunteerId === currentUserId);

        if (isAuthor) {
          if (request.status !== "COMPLETED") {
             return <FinishRequestButton requestId={request.id} />;
          }
          return null; 
        }

        if (volunteerConversation) {
          return (
            <div className="fixed bottom-0 left-0 w-full z-50 bg-[#f5f5dd]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
              <Link
                href={`/chat/${volunteerConversation.id}`}
                className="block w-full h-16 bg-secondary text-on-secondary rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 active:scale-95 transition-transform duration-150"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                Otwórz czat
              </Link>
            </div>
          );
        }

        if (request.status === "OPEN") {
          return (
            <div className="fixed bottom-0 left-0 w-full z-50 bg-[#f5f5dd]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
              <Link
                href={`/feed/${request.id}/modal`}
                className="block w-full h-16 bg-primary text-on-primary rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                Chcę pomóc
              </Link>
            </div>
          );
        }

        return null;
      })()}
    </div>
  );
}
