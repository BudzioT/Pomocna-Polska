"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canViewFeed, canRequestHelp } from "@/lib/permissions";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  permission?: (role: string | undefined) => boolean;
}

const navItems: NavItem[] = [
  { href: "/map", icon: "location_on", label: "Mapa", permission: canViewFeed },
  { href: "/feed", icon: "list_alt", label: "Ogłoszenia", permission: canViewFeed },
  { href: "/new-request", icon: "add_circle", label: "Dodaj", permission: canRequestHelp },
  { href: "/profile", icon: "person", label: "Profil" },
];

export default function BottomNav({ role }: { role?: string }) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.permission || item.permission(role)
  );

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 bg-[#f5f5dd]/90 backdrop-blur-md rounded-t-[24px] border-t border-[#e2beba]/20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] w-full max-w-[390px] md:max-w-full mx-auto right-0">
      {visibleItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center transition-opacity hover:opacity-80 ${
              isActive
                ? "text-[#563d91] font-bold scale-110"
                : "text-[#1C1B1F]/60"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
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
