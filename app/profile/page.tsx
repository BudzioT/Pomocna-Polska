import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "@/components/layout/BottomNav";
import { prisma } from "@/lib/db";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  // Try to load real user from DB, fallback to cookie data
  let user = userId
    ? await prisma.user.findUnique({ 
        where: { id: userId },
        include: {
          requests: { orderBy: { createdAt: "desc" }, take: 5 },
          assignedTasks: { orderBy: { createdAt: "desc" }, take: 5 },
          _count: { select: { requests: true, assignedTasks: true } }
        }
      })
    : null;

  const requestsCount = user?._count?.requests || 0;
  const helpsCount = user?._count?.assignedTasks || 0;

  // Merge and sort history
  const history = [
    ...(user?.requests || []).map((r: any) => ({ ...r, roleInRequest: "AUTHOR" as const })),
    ...(user?.assignedTasks || []).map((r: any) => ({ ...r, roleInRequest: "VOLUNTEER" as const }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  const displayName = user?.name ?? cookieStore.get("user_name")?.value ?? "Użytkownik";
  const displayPhone = user?.phoneNumber ?? cookieStore.get("user_phone")?.value ?? "—";
  const displayRole = user?.role ?? cookieStore.get("user_role")?.value ?? "SEEKER";

  const roleLabel =
    displayRole === "VOLUNTEER"
      ? "Wolontariusz"
      : displayRole === "SEEKER"
      ? "Szukający pomocy"
      : displayRole;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#8F000D] text-2xl">volunteer_activism</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#8F000D] tracking-tight">Mój profil</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5DC] transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[#1B1D0E]">edit</span>
        </button>
      </header>

      <main className="pt-20 px-4">
        {/* Avatar + name */}
        <section className="mt-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-6xl">person</span>
            </div>
            <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-2 border-4 border-surface shadow-lg">
              <span
                className="material-symbols-outlined text-on-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">{displayName}</h2>
            <div className="flex items-center justify-center gap-1 text-on-surface-variant mt-1">
              <span className="material-symbols-outlined text-sm">phone</span>
              <span className="text-sm font-medium">{displayPhone}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                {displayRole === "VOLUNTEER" ? "favorite" : "front_hand"}
              </span>
              {roleLabel}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-primary/10">
            <p className="text-2xl font-extrabold text-primary">{helpsCount}</p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">Udzielona pomoc</p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-secondary/10">
            <p className="text-2xl font-extrabold text-secondary">{requestsCount}</p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">Otrzymana pomoc</p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-primary/10">
            <p className="text-2xl font-extrabold text-on-surface">0</p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">Poręczenia</p>
          </div>
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
          {history.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-2">Brak historii aktywności.</p>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.roleInRequest === "AUTHOR" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{item.roleInRequest === "AUTHOR" ? "front_hand" : "favorite"}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      {item.roleInRequest === "AUTHOR" ? "Potrzebuję pomocy" : "Udzielam pomocy"} • {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                    {item.status === "OPEN" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-full">Aktywne</span>
                    )}
                    {item.status === "COMPLETED" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">Zakończone</span>
                    )}
                  </div>
                </div>
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
