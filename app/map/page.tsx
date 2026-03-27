import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";

interface MapPin {
  id: string;
  icon: string;
  href: string;
  style: React.CSSProperties;
}

const pins: MapPin[] = [
  {
    id: "p1",
    icon: "shopping_basket",
    href: "/request/r2",
    style: { top: "30%", left: "40%" },
  },
  {
    id: "p2",
    icon: "health_and_safety",
    href: "/request/r1",
    style: { top: "45%", left: "65%" },
  },
];

export default function MapPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen max-w-[390px] mx-auto overflow-hidden relative shadow-2xl">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm max-w-[390px]">
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
        <div className="absolute inset-0 bg-[#E4E4CC]">
          <Image
            alt="Mapa okolicy"
            className="w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdRciJaP9CKavlSOiptuCZZCahrjZdBcCnr2ZuDwiGM5MbXG-SWhnyW3Nj3X3xyWMUdQnz_7ymxh7vJYfA03vSsoL3tLafP8HJ1LIL6nxDPgce01Y6YHYRmaDOMUmfHL2KmydJn-B66uj2JkyelL5KR01X0flYGiPF0d-nIeHWLyoBtIZ9uuE8tuFpgXmI1z51gqYTem1-o79T-2qZDbTvUhdNTO1v7fGV0wQCm7FSGzIAmvztwFxvZ7BVT4KDLCDejYQ4zomRs53g"
            fill
            sizes="390px"
            priority
          />
        </div>

        {/* Map pins */}
        {pins.map(({ id, icon, href, style }) => (
          <Link
            key={id}
            href={href}
            className="absolute cursor-pointer z-10"
            style={style}
          >
            <div className="bg-primary text-on-primary rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-2 border-surface-container-lowest hover:scale-110 transition-transform active:scale-95">
              <span className="material-symbols-outlined">{icon}</span>
            </div>
          </Link>
        ))}

        {/* Bottom sheet */}
        <div className="absolute bottom-[20%] left-0 w-full bg-surface rounded-t-[32px] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] p-6 z-30 pb-32">
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
      </main>

      <BottomNav />
    </div>
  );
}
