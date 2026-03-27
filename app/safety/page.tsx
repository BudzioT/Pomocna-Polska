import Image from "next/image";
import Link from "next/link";

interface SafetyRule {
  icon: string;
  label: string;
}

const rules: SafetyRule[] = [
  { icon: "meeting_room", label: "Pierwsze spotkanie przed drzwiami" },
  { icon: "not_accessible", label: "Nie wpuszczaj do mieszkania" },
  { icon: "phone_in_talk", label: "Powiedz komuś bliskiemu o spotkaniu" },
  { icon: "badge", label: "Sprawdź profil i oceny wolontariusza" },
];

export default function SafetyPage() {
  return (
    <div className="relative mx-auto w-full max-w-[390px] h-screen bg-surface-bright flex flex-col overflow-hidden">
      {/* Hero image */}
      <div className="relative w-full h-[32%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-bright/40 z-10" />
        <Image
          alt="Bezpieczne spotkanie"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBJ_OuVo0dd9NzvbvBffL4yZcrYKFzNMGsIfjFER6rANaWpK8PVKn4L4UCS0pVXusUQPMGnEUpNWSqkeS64bBWoCCmxv_rHPtaVrMAj-kg_xnM73cR8wK8vgAD98Yq0ciMFs1ssTRyJOBDfXp39GgFUlgrL_LzGG34H6y25XIYxVjOBJC8jG9G_zHQbUqv2qYbphc8mf8noulz9EJKsoFR1tuohJhJT0aq19VCu5BE9YlLd059n55XKKTqzjoGh0uSlzJ7lUduMatL"
          fill
          sizes="390px"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-bright to-transparent z-20" />
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pt-4 pb-12 flex flex-col">
        <div className="mb-8">
          <h1 className="text-primary font-headline font-extrabold text-3xl leading-tight tracking-tight">
            Zanim się spotkasz
          </h1>
          <div className="h-1.5 w-16 bg-secondary mt-2 rounded-full" />
        </div>

        {/* Rules */}
        <div className="space-y-6 flex-1">
          {rules.map(({ icon, label }) => (
            <div key={icon} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-[28px]">
                  {icon}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-on-surface font-semibold text-lg leading-snug">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-8 flex flex-col gap-4">
          <Link
            href="/chat"
            className="w-full bg-primary py-5 rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="text-on-primary font-headline font-bold text-lg">
              Rozumiem, jestem bezpieczna
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
