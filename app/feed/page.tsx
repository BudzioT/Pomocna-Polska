import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { canViewFeed } from "@/lib/permissions";
import FeedClient from "@/components/ui/FeedClient";
import type { FeedRequest } from "@/components/ui/FeedClient";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  if (!canViewFeed(role)) {
    // SEEKER cannot view other people's requests
    redirect("/no-access?reason=feed");
  }

  const raw = await prisma.helpRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  // Serialize for the client component (Dates → ISO strings)
  const requests: FeedRequest[] = raw.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category || "OTHER",
    type: r.type,
    address: r.address,
    tags: Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? JSON.parse(r.tags) : []),
    createdAt: r.createdAt.toISOString(),
    author: {
      id: r.author.id,
      name: r.author.name,
      avatarUrl: r.author.avatarUrl,
    },
  }));

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col w-full max-w-[390px] md:max-w-full mx-auto relative pb-24">
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
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#563d91]">volunteer_activism</span>
          <h1 className="font-headline font-extrabold text-xl text-[#563d91] tracking-tight">Pomocna Polska</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#1C1B1F] hover:bg-primary/10 p-2 rounded-full transition-colors active:scale-95 duration-150">
            notifications
          </button>
        </div>
      </header>

      <main className="mt-[72px] px-4 flex-1">
        <FeedClient requests={requests} />
      </main>

      <BottomNav role={role} />
    </div>
  );
}
