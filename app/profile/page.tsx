import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import BottomNav from "@/components/layout/BottomNav";
import { prisma } from "@/lib/db";
import LogoutButton from "@/components/ui/LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return <div className="p-4 bg-surface text-on-surface h-screen">Zaloguj się, aby zobaczyć profil.</div>;
  }

  // Try to load real user from DB
  let user = await prisma.user.findUnique({ 
    where: { id: userId },
    include: {
      requests: { orderBy: { createdAt: "desc" }, take: 5 },
      assignedTasks: { orderBy: { createdAt: "desc" }, take: 5 },
    }
  });

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
    take: 5
  });

  const volunteerRequests = Array.from(
    new Map(userConversations.map((c: any) => [c.requestId, c.request])).values()
  );

  // Merge and sort history
  const historyRequests = [
    ...(user?.requests || []).map((r: any) => ({ ...r, roleInRequest: "AUTHOR" as const })),
    ...volunteerRequests.map((r: any) => ({ ...r, roleInRequest: "VOLUNTEER" as const }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  const displayName = user?.name ?? cookieStore.get("user_name")?.value ?? "Użytkownik";
  const displayPhone = user?.phoneNumber ?? cookieStore.get("user_phone")?.value ?? "—";
  const displayRole = user?.role ?? cookieStore.get("user_role")?.value ?? "SEEKER";
  const avatarUrl = user?.avatarUrl ?? null;

  const roleLabel =
    displayRole === "VOLUNTEER"
      ? "Wolontariusz"
      : displayRole === "SEEKER"
      ? "Szukający pomocy"
      : displayRole === "BOTH"
      ? "Wolontariusz i Szukający"
      : displayRole;

  // Fetch all active conversations where this user is author or volunteer
  const activeChats = await prisma.conversation.findMany({
    where: {
      request: { status: "IN_PROGRESS" },
      OR: [
        { request: { authorId: userId } },
        { volunteerId: userId },
      ],
    },
    include: {
      request: {
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } }
        }
      },
      volunteer: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#563d91] text-2xl">volunteer_activism</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#563d91] tracking-tight">Mój profil</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[#1C1B1F]">edit</span>
        </button>
      </header>

      <main className="pt-20 px-4">
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
                <span
                  className="material-symbols-outlined text-on-secondary text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <h2 className="text-2xl font-extrabold text-on-surface tracking-tight leading-tight">{displayName}</h2>
              <div className="flex items-center justify-center gap-1.5 text-on-surface-variant mt-1.5">
                <span className="material-symbols-outlined text-sm">phone</span>
                <span className="text-sm font-medium">{displayPhone}</span>
              </div>
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
            <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm text-center border-r-4 border-primary/10 flex flex-col justify-center transition-transform hover:scale-105">
              <p className="text-xl font-extrabold text-on-surface leading-none">0</p>
              <p className="text-[10px] font-bold text-on-surface-variant leading-tight mt-1">Poręczenia</p>
            </div>
          </section>
        </div>

        {/* Active Chats */}
        <section className="mt-8 mb-6">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">
            Aktywne rozmowy
          </h3>
          {activeChats.length === 0 ? (
            <div className="bg-surface-container-lowest p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                chat_bubble_outline
              </span>
              <p className="text-on-surface-variant font-medium text-sm">
                Brak aktywnych rozmów
              </p>
              <Link
                href="/feed"
                className="inline-block mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm"
              >
                Przeglądaj prośby
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeChats.map((chat: any) => {
                const partner =
                  chat.request.authorId === userId
                    ? chat.volunteer
                    : chat.request.author;
                const partnerName = partner?.name ?? "Rozmówca";
                const isVolunteer = chat.volunteerId === userId;

                return (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-4">
                       <div className="text-3xl">
                         {isVolunteer ? "😇" : "🤝"}
                       </div>
                       <div>
                         <p className="font-bold text-on-surface leading-tight">
                           {chat.request.title}
                         </p>
                        <p className="text-[12px] text-on-surface-variant">
                          Z: {partnerName}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                      chat
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Role settings */}
        <section className="mt-8 mb-6">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">Ustawienia roli</h3>
          <div className="bg-surface-container-lowest p-4 rounded-2xl space-y-3">
            <p className="text-sm text-on-surface-variant font-medium">
              Twoja aktualna rola: <span className="text-on-surface font-bold">{roleLabel}</span>
            </p>
            <Link
              href="/role?edit=true"
              className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Zmień rolę
            </Link>
          </div>
        </section>

        {/* History */}
        <section className="mt-2 mb-2">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">Ostatnia historia</h3>
          {historyRequests.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-2">Brak historii aktywności.</p>
          ) : (
             <div className="space-y-3">
              {historyRequests.map(item => (
                <Link key={item.id} href={`/request/${item.id}`} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex items-start gap-4 hover:bg-surface-container-low transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.roleInRequest === "AUTHOR" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{item.roleInRequest === "AUTHOR" ? "front_hand" : "favorite"}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface text-sm">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      {item.roleInRequest === "AUTHOR" ? "Potrzebuję pomocy" : "Udzielam pomocy"} • {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                    {item.status === "OPEN" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-full">Aktywne</span>
                    )}
                    {item.status === "IN_PROGRESS" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-secondary-container bg-secondary-container/20 px-2 py-1 rounded-full">W trakcie</span>
                    )}
                    {item.status === "COMPLETED" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">Zakończone</span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-primary/50 self-center">chevron_right</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <LogoutButton />
      </main>

      <BottomNav role={displayRole} />
    </div>
  );
}
