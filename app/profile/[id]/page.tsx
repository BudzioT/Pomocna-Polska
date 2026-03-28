import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PublicProfileProps {
  params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const { id: userId } = await params;

  if (!userId) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      requests: { orderBy: { createdAt: "desc" }, take: 10 },
    }
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
          person_off
        </span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Użytkownik nie istnieje</h2>
        <Link href="/feed" className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold">
          Wróć do listy
        </Link>
      </div>
    );
  }

  const requestsCount = await prisma.helpRequest.count({
    where: { authorId: userId, status: "COMPLETED" },
  });
  const helpsCount = await prisma.conversation.count({
    where: { volunteerId: userId, request: { status: "COMPLETED" } },
  });

  const userConversations = await prisma.conversation.findMany({
    where: { volunteerId: userId },
    include: { request: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const volunteerRequests = Array.from(
    new Map(userConversations.map((c: any) => [c.requestId, c.request])).values()
  );

  // Merge and sort history (exclude OPEN requests, show only completed/in progress realistically, or show all)
  const historyRequests = [
    ...(user.requests || []).map((r: any) => ({ ...r, roleInRequest: "AUTHOR" as const })),
    ...volunteerRequests.map((r: any) => ({ ...r, roleInRequest: "VOLUNTEER" as const }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  const displayName = user.name || "Użytkownik";
  const displayRole = user.role || "SEEKER";
  const avatarUrl = user.avatarUrl || null;

  const roleLabel =
    displayRole === "VOLUNTEER"
      ? "Wolontariusz"
      : displayRole === "SEEKER"
      ? "Szukający pomocy"
      : displayRole === "BOTH"
      ? "Wolontariusz i Szukający"
      : displayRole;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <Link href="/feed" className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-150">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
          <span className="material-symbols-outlined text-[#563d91] text-2xl">person</span>
          <h1 className="font-headline font-extrabold text-xl text-[#563d91] tracking-tight">{displayName}</h1>
        </div>
      </nav>

      <main className="pt-24 px-4">
        <div className="mt-4 flex flex-row items-start justify-between gap-4">
          {/* Avatar + name (Left) */}
          <section className="flex flex-col items-center text-center w-1/2">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-xl">
                {avatarUrl ? (
                  <Image
                    alt="Avatar użytkownika"
                    className="w-full h-full object-cover"
                    src={avatarUrl}
                    width={112}
                    height={112}
                  />
                ) : (
                  <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl">person</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-2 border-4 border-surface shadow-lg">
                <span className="material-symbols-outlined text-on-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <h2 className="text-xl font-extrabold text-on-surface tracking-tight leading-tight">{displayName}</h2>
              <div className="mt-2.5 inline-flex items-center justify-center gap-1 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {displayRole === "VOLUNTEER" ? "favorite" : "front_hand"}
                </span>
                {roleLabel}
              </div>
            </div>
          </section>

          {/* Stats (Right) */}
          <section className="flex flex-col gap-3 w-1/2">
            <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm text-center border-r-4 border-primary/20 flex flex-col justify-center transition-transform hover:scale-105">
              <p className="text-xl font-extrabold text-primary leading-none">{helpsCount}</p>
              <p className="text-[10px] font-bold text-on-surface-variant leading-tight mt-1">Udzielona pomoc</p>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm text-center border-r-4 border-secondary/20 flex flex-col justify-center transition-transform hover:scale-105">
              <p className="text-xl font-extrabold text-secondary leading-none">{requestsCount}</p>
              <p className="text-[10px] font-bold text-on-surface-variant leading-tight mt-1">Otrzymana pomoc</p>
            </div>
          </section>
        </div>

        {/* History */}
        <section className="mt-12 mb-2">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">Ostatnia historia aktywności</h3>
          {historyRequests.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-2">Brak historii aktywności.</p>
          ) : (
             <div className="space-y-3">
              {historyRequests.map((item: any) => (
                <div key={item.id} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.roleInRequest === "AUTHOR" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{item.roleInRequest === "AUTHOR" ? "front_hand" : "favorite"}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface text-sm">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      {item.roleInRequest === "AUTHOR" ? "Potrzebowali pomocy" : "Udzielili pomocy"} • {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                    {item.status === "COMPLETED" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">Zakończone</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
