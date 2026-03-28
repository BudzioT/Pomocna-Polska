import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "@/components/layout/BottomNav";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { prisma } from "@/lib/db";

interface MapPin {
  id: string;
  icon: string;
  href: string;
  longitude: number;
  latitude: number;
  title: string;
  address: string | null;
}

function getIconForCategory(category: string): string {
  switch (category) {
    case "SHOPPING": return "shopping_basket";
    case "MEDICINE": return "health_and_safety";
    case "TRANSPORT": return "directions_car";
    case "COMPANIONSHIP": return "diversity_1";
    default: return "live_help";
  }
}

export default async function MapPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  const rawRequests = await prisma.helpRequest.findMany({
    where: { 
      status: "OPEN",
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: { createdAt: "desc" }
  });

  const displayPins: MapPin[] = role === "SEEKER" ? [] : (rawRequests as any[]).map(req => ({
    id: req.id,
    icon: getIconForCategory(req.category),
    href: `/request/${req.id}`,
    latitude: req.latitude!,
    longitude: req.longitude!,
    title: req.title,
    address: req.address,
  }));

  return (
    <div className="bg-surface text-on-surface min-h-screen w-full max-w-[390px] md:max-w-full mx-auto overflow-hidden relative shadow-2xl">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#563d91] text-2xl">
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl tracking-tight text-[#563d91]">
            Pomocna Polska
          </h1>
        </div>
      </header>

      <main className="relative h-screen pt-[64px] w-full overflow-hidden">
        {/* Map background */}
        <div className="absolute inset-0 z-0">
          <Map
            theme="light"
            viewport={{ center: [21.025, 52.195], zoom: 13 }}
            className="w-full h-full"
          >
            {displayPins.map(({ id, icon, href, longitude, latitude }) => (
              <MapMarker key={id} longitude={longitude} latitude={latitude}>
                <MarkerContent>
                  <Link href={href} className="block cursor-pointer">
                    <div className="bg-primary text-on-primary rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-2 border-surface-container-lowest hover:scale-110 transition-transform active:scale-95">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                  </Link>
                </MarkerContent>
              </MapMarker>
            ))}
            <MapControls position="top-right" showCompass showZoom />
          </Map>
        </div>

        {/* Bottom sheet */}
        {displayPins.length > 0 ? (
          <div className="absolute bottom-0 left-0 w-full bg-surface rounded-t-[32px] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] p-6 z-30 pb-32">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-secondary font-bold text-xs tracking-widest uppercase">
                  Najbliżej Ciebie
                </span>
                <h2 className="text-2xl font-extrabold text-on-surface leading-tight">
                  {displayPins[0].title || "Pomoc Sąsiedzka"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-outline text-sm">
                    distance
                  </span>
                  <span className="text-on-surface-variant text-sm font-medium">
                    {displayPins[0].address || "W twojej okolicy"}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href={displayPins[0].href}
              className="mt-4 block w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-center active:scale-95 transition-transform"
            >
              Zobacz szczegóły
            </Link>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 w-full bg-surface rounded-t-[32px] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] p-6 z-30 pb-32 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-2">location_off</span>
            <h2 className="text-xl font-extrabold text-on-surface leading-tight">
              Brak zgłoszeń
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">
              Nie masz aktywnych próśb o pomoc w swojej okolicy.
            </p>
          </div>
        )}
      </main>

      <BottomNav role={role} />
    </div>
  );
}
