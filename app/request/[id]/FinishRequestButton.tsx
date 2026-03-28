"use client";

import { useRouter } from "next/navigation";

export default function FinishRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();

  const handleFinish = async () => {
    if (confirm("Czy na pewno chcesz zakończyć to zgłoszenie? Wszystkie podłączone do niego konwersacje wolontariuszy zostaną zamknięte i przeniesione do archiwum (Zakończone). Po tej akcji uczestnikom zostaną przypisane punkty wsparcia.")) {
      try {
        const res = await fetch(`/api/requests/${requestId}/complete`, { method: "POST" });
        if (res.ok) {
          router.refresh(); // Odśwież widok strony, by uaktualnić status 
        } else {
          alert("Nie udało się zaktualizować statusu.");
        }
      } catch (err) {
        console.error(err);
        alert("Wystąpił błąd");
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#f5f5dd]/95 backdrop-blur-md rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-6 pb-8 pt-4 w-full max-w-[390px] md:max-w-full mx-auto right-0">
      <button
        onClick={handleFinish}
        className="w-full h-16 bg-primary text-on-primary rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
        Zakończ Sprawę (Przyznaj Punkty)
      </button>
    </div>
  );
}
