"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.clear(); // Usunięcie wszystkich danych powiązanych z sesją
      router.push("/onboarding");
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-error-container text-on-error-container font-bold rounded-xl shadow-sm hover:bg-error/20 active:scale-95 transition-all text-sm mb-6"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      {loading ? "Wylogowywanie..." : "Wyloguj się"}
    </button>
  );
}
