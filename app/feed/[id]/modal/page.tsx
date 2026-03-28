"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

interface FeedModalPageProps {
  params: Promise<{ id: string }>;
}

export default function FeedModalPage({ params }: FeedModalPageProps) {
  const { id: requestId } = use(params);
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("user_id"));
  }, []);

  const handleAccept = async () => {
    if (!currentUserId) {
      setError("Musisz być zalogowany, by nawiązać z kimś kontakt.");
      return;
    }
    
    setAccepting(true);
    setError(null);

    try {
      const res = await fetch(`/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, volunteerId: currentUserId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Nie udało się otworzyć konwersacji");
      }

      const conversation = await res.json();

      // Success — redirect to the new conversation chat
      router.push(`/chat/${conversation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
      setAccepting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[390px] md:max-w-full h-screen overflow-hidden bg-surface-dim">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #c4b5d6 1px, transparent 0)",
          backgroundSize: "24px 24px",
          opacity: 0.1,
        }}
      />

      {/* Blurred background content */}
      <header className="fixed top-0 w-full z-10 flex justify-between items-center px-6 py-4 bg-surface-container-low/80 backdrop-blur-md max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            volunteer_activism
          </span>
          <span className="font-headline font-extrabold text-xl tracking-tight text-primary">
            Pomocna Polska
          </span>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24 space-y-6 opacity-40 grayscale-[0.5]">
        <div className="p-6 bg-surface-container-lowest rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold text-on-surface">Ładowanie...</h3>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Potrzebuję pomocy...
          </p>
        </div>
      </main>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4 max-w-[390px] md:max-w-full mx-auto">
        <div className="w-full max-w-[358px] bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center p-8 relative">
          <h2 className="font-headline font-bold text-2xl text-on-surface text-center mt-2 mb-8">
            Zanim zaakceptujesz
          </h2>
          <div className="bg-surface-container-low rounded-2xl p-5 mb-8 text-center">
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
              Obie strony muszą się zgodzić, aby nawiązać kontakt.
            </p>
          </div>

          {error && (
            <div className="w-full mb-4 p-3 bg-error-container rounded-xl text-center">
              <p className="text-on-error-container text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          <div className="w-full space-y-4">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="block w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all duration-150 text-center disabled:opacity-60"
            >
              {accepting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Akceptowanie...
                </span>
              ) : (
                "Akceptuję i chcę pomóc"
              )}
            </button>
            <Link
              href="/feed"
              className="block w-full py-2 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors text-center"
            >
              Anuluj
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
