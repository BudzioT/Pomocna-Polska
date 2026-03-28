"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const [roles, setRoles] = useState<{ seeker: boolean; volunteer: boolean }>({
    seeker: false,
    volunteer: false,
  });

  useEffect(() => {
    if (isEditing) {
      const currentRole = localStorage.getItem("user_role");
      if (currentRole === "SEEKER") setRoles({ seeker: true, volunteer: false });
      else if (currentRole === "VOLUNTEER") setRoles({ seeker: false, volunteer: true });
      else if (currentRole === "BOTH") setRoles({ seeker: true, volunteer: true });
    }
  }, [isEditing]);

  const toggleRole = (role: "seeker" | "volunteer") => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const isValid = roles.seeker || roles.volunteer;

  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!isValid) return;

    if (isEditing) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/update-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seeker: roles.seeker, volunteer: roles.volunteer })
        });
        if (res.ok) {
          const { role } = await res.json();
          localStorage.setItem("user_role", role);
          router.push("/profile");
        } else {
          setLoading(false);
          alert("Wystąpił błąd podczas zmiany roli.");
        }
      } catch (err) {
        setLoading(false);
        alert("Błąd sieci.");
      }
      return;
    }

    const params = new URLSearchParams();
    if (roles.seeker) params.append("seeker", "1");
    if (roles.volunteer) params.append("volunteer", "1");
    router.push(`/register?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 bg-surface font-body text-on-surface flex flex-col w-full max-w-[390px] md:max-w-full mx-auto overflow-hidden overscroll-none">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center px-8 py-6 bg-surface/80 backdrop-blur-sm max-w-[390px] md:max-w-full gap-3">
        <Link href="/onboarding" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">volunteer_activism</span>
          <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">Pomocna Polska</h1>
        </div>
        {/* Steps: only show during registration */}
        {!isEditing && <span className="ml-auto text-xs font-bold text-on-surface-variant">Krok 1 z 3</span>}
      </header>

      {/* Main */}
      <main className="flex flex-col justify-center h-full px-8 pt-16 pb-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #c4b5d6 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />
        <div className="max-w-md mx-auto relative z-10 w-full">
          <section className="mb-10">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-2 tracking-tight">
              {isEditing ? "Edycja roli" : "Kim jesteś?"}
            </h2>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              {isEditing ? "Aktualizuj swoje preferencje dostępu w aplikacji." : "Możesz zaznaczyć obie opcje. Zmienisz to w dowolnym momencie."}
            </p>
          </section>

          <div className="space-y-4">
            {/* Help seeker */}
            <div
              onClick={() => toggleRole("seeker")}
              className={`relative flex items-center justify-between p-6 bg-surface-container-lowest rounded-[24px] cursor-pointer transition-all ${
                roles.seeker
                  ? "border-2 border-primary shadow-lg"
                  : "border-2 border-transparent hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${roles.seeker ? "bg-primary-fixed text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-3xl">front_hand</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Potrzebuję pomocy</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Szukam wsparcia w codzienności.</p>
                </div>
              </div>
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${roles.seeker ? "border-primary bg-primary" : "border-outline-variant"}`}>
                {roles.seeker && <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>check</span>}
              </div>
            </div>

            {/* Volunteer */}
            <div
              onClick={() => toggleRole("volunteer")}
              className={`relative flex items-center justify-between p-6 bg-surface-container-lowest rounded-[24px] cursor-pointer transition-all ${
                roles.volunteer
                  ? "border-2 border-primary shadow-lg"
                  : "border-2 border-transparent hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${roles.volunteer ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Chcę pomagać</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Chcę dzielić się swoim czasem.</p>
                </div>
              </div>
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${roles.volunteer ? "border-primary bg-primary" : "border-outline-variant"}`}>
                {roles.volunteer && <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>check</span>}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 px-8 pb-10 pt-6 bg-surface/90 backdrop-blur-md z-50 max-w-[390px] md:max-w-full mx-auto">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className={`block w-full py-5 font-headline font-bold text-lg rounded-xl shadow-lg text-center transition-all active:scale-95 ${
              isValid
                ? "bg-primary text-on-primary shadow-primary/20 hover:bg-primary/90"
                : "bg-surface-container text-on-surface-variant cursor-not-allowed"
            }`}
          >
            {loading ? <span className="material-symbols-outlined xl animate-spin">progress_activity</span> : (isEditing ? "Zapisz zmiany" : "Kontynuuj")}
          </button>
          {!isEditing && (
            <p className="text-center mt-4 text-xs text-on-surface-variant font-medium">
              Krok 1 z 3
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense>
      <RoleSelectionContent />
    </Suspense>
  );
}
