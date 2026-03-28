import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import RequestCard from "@/components/ui/RequestCard";
import { canViewFeed } from "@/lib/permissions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  if (!canViewFeed(role)) {
    // SEEKER cannot view other people's requests
    redirect("/no-access?reason=feed");
  }

  const requests = await prisma.helpRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col w-full max-w-[390px] md:max-w-full mx-auto overflow-x-hidden relative pb-24">
      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
          backgroundSize: "24px 24px",
          opacity: 0.1,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8F000D]">volunteer_activism</span>
          <h1 className="font-headline font-extrabold text-xl text-[#8F000D] tracking-tight">Pomocna Polska</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#1B1D0E] hover:bg-[#F5F5DC] p-2 rounded-full transition-colors active:scale-95 duration-150">
            notifications
          </button>
        </div>
      </header>

      <main className="mt-[72px] px-4 flex-1">
        {/* Search + filters */}
        <section className="mt-4 mb-6">
          <div className="bg-surface-container-low rounded-xl flex items-center px-4 py-3 mb-4">
            <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body font-medium placeholder-on-surface-variant/60 w-full outline-none"
              placeholder="Czego szukasz?"
              type="text"
            />
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-2 -mx-4 px-4">
            <button className="whitespace-nowrap px-5 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-sm">
              Wszystkie
            </button>
            <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-high text-on-surface font-medium text-sm hover:bg-surface-variant transition-colors">
              Zakupy
            </button>
          </div>
        </section>

        {/* Requests list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {requests.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
                search_off
              </span>
              <p className="text-on-surface-variant font-medium">
                Brak otwartych próśb o pomoc
              </p>
            </div>
          )}
          {requests.map((request: any, index: number) => (
            <RequestCard
              key={request.id}
              request={{
                id: request.id,
                title: request.title,
                description: request.description,
                category: "other",
                type: request.type === "IN_PERSON" ? "in-person" : "remote",
                author: {
                  id: request.author.id,
                  name: request.author.name,
                  avatarUrl: request.author.avatarUrl ?? undefined,
                },
                createdAt: new Date(request.createdAt),
                status: "open",
              }}
              href={`/request/${request.id}`}
              accentColor={index % 2 === 0 ? "primary" : "secondary"}
            />
          ))}
        </div>
      </main>

      <BottomNav role={role} />
    </div>
  );
}
