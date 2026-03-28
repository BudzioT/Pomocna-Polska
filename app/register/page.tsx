"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seeker = searchParams.get("seeker") === "1";
  const volunteer = searchParams.get("volunteer") === "1";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Format phone: allow only digits, insert "-" every 3 digits → 123-456-789
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    const parts = digits.match(/.{1,3}/g) ?? [];
    setPhone(parts.join("-"));
  };

  const isPhoneValid = phone.replace(/-/g, "").length === 9;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !isPhoneValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: `+48${phone.replace(/-/g, "")}`,
          seeker,
          volunteer,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Coś poszło nie tak.");
        return;
      }

      // Pass data forward to /pass
      const params = new URLSearchParams();
      params.set("name", name.trim());
      params.set("phone", `+48${phone.replace(/-/g, "")}`);
      if (seeker) params.set("seeker", "1");
      if (volunteer) params.set("volunteer", "1");
      router.push(`/pass?${params.toString()}`);
    } catch {
      setError("Błąd sieci. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center w-full max-w-[390px] md:max-w-full mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f5f5dd] shadow-sm max-w-[390px] md:max-w-full">
        <Link
          href="/role"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight text-primary">Utwórz konto</h1>
        <span className="text-xs font-bold text-on-surface-variant">Krok 2 z 3</span>
      </header>

      <main className="w-full px-8 pt-24 pb-12 flex flex-col flex-grow relative overflow-hidden">
        {/* Decorative background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />

        {/* Heading */}
        <div className="mb-10 relative z-10">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">volunteer_activism</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface leading-tight">
            Zacznijmy od <br />podstaw
          </h2>
          <p className="text-on-surface-variant mt-3 font-medium">
            Dołącz do społeczności wzajemnej pomocy w Twojej okolicy.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">Imię</label>
            <div className="relative group">
              <input
                className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                placeholder="Wpisz swoje imię"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">person</span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">Numer telefonu</label>
            <div className="flex h-14 space-x-3">
              <div className="flex items-center space-x-2 bg-surface-container-highest rounded-xl px-4 border-none shrink-0">
                <span className="font-bold text-on-surface">+48</span>
              </div>
              <div className="relative flex-grow">
                <input
                  className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                  placeholder="123-456-789"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">smartphone</span>
              </div>
            </div>
            {phone.length > 0 && !isPhoneValid && (
              <p className="text-xs text-error px-1 font-medium">Podaj pełny numer (9 cyfr), np. 123-456-789</p>
            )}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || !name.trim() || !isPhoneValid}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Dalej</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
