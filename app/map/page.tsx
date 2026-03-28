import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "@/components/layout/BottomNav";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";

interface MapPin {
  id: string;
  icon: string;
  href: string;
  longitude: number;
  latitude: number;
}

const pins: MapPin[] = [
  {
    id: "p1",
    icon: "shopping_basket",
    href: "/request/r2",
    longitude: 21.02,
    latitude: 52.19,
  },
  {
    id: "p2",
    icon: "health_and_safety",
    href: "/request/r1",
    longitude: 21.03,
    latitude: 52.20,
  },
];

export default async function MapPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  // SEEKER sees only their own requests. For now, we mock an empty array or their own mock pins.
  // We'll show an empty array for SEEKER to demonstrate hiding other requests.
  const displayPins = role === "SEEKER" ? [] : pins;

  return (
    <div className="bg-surface text-on-surface min-h-screen w-full max-w-[390px] md:max-w-full mx-auto overflow-hidden relative shadow-2xl">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8F000D] text-2xl">
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl tracking-tight text-[#8F000D]">
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
                  Pomoc Sąsiedzka: Mokotów
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-outline text-sm">
                    distance
                  </span>
                  <span className="text-on-surface-variant text-sm font-medium">
                    450m stąd
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/request/r2"
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
