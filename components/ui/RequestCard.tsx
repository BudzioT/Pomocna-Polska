import Link from "next/link";
import type { HelpRequest } from "@/types";

interface RequestCardProps {
  request: HelpRequest;
  href: string;
  accentColor?: "primary" | "secondary";
}

const categoryIcons: Record<string, string> = {
  shopping: "shopping_basket",
  medicine: "health_and_safety",
  transport: "directions_car",
  companionship: "favorite",
  education: "school",
  animals: "pets",
  household: "cleaning_services",
  other: "help",
};

export default function RequestCard({
  request,
  href,
  accentColor = "primary",
}: RequestCardProps) {
  const borderClass =
    accentColor === "primary" ? "border-primary" : "border-secondary";
  const iconBgClass =
    accentColor === "primary" ? "bg-primary-fixed" : "bg-secondary-fixed";
  const iconColorClass =
    accentColor === "primary" ? "text-primary" : "text-secondary";

  return (
    <Link
      href={href}
      className={`block bg-surface-container-lowest rounded-[12px] shadow-sm overflow-hidden relative border-l-4 ${borderClass} hover:bg-surface-container-low transition-colors`}
    >
      <div className="p-4 w-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center`}
            >
              <span className={`material-symbols-outlined ${iconColorClass}`}>
                {categoryIcons[request.category] ?? "help"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-on-surface">
                  {request.author.name}
                </span>
              </div>
              {request.distanceKm && (
                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant/80">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      location_on
                    </span>{" "}
                    {request.distanceKm} km
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <h3 className="text-on-surface font-bold text-lg leading-tight mb-1">
          {request.title}
        </h3>
        <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
          {request.description}
        </p>
      </div>
    </Link>
  );
}
