"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/map", icon: "location_on", label: "Mapa" },
  { href: "/feed", icon: "list_alt", label: "Feed" },
  { href: "/new-request", icon: "add_circle", label: "Dodaj" },
  { href: "/profile", icon: "person", label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 bg-[#FBFBE2]/90 backdrop-blur-md rounded-t-[24px] border-t border-[#E2BEBA]/20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] w-full max-w-[390px] md:max-w-full mx-auto right-0">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center transition-opacity hover:opacity-80 ${
              isActive
                ? "text-[#8F000D] font-bold scale-110"
                : "text-[#1B1D0E]/60"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {icon}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[12px]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
