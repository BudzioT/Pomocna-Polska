"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function PasswordCheck({ password }: { password: string }) {
  const checks = [
    { label: "Minimum 8 znaków", ok: password.length >= 8 },
    { label: "Minimum 1 wielka litera", ok: /[A-Z]/.test(password) },
    { label: "Minimum 1 cyfra", ok: /[0-9]/.test(password) },
  ];
  return (
    <ul className="space-y-1 mt-2">
      {checks.map((c) => (
        <li key={c.label} className={`flex items-center gap-2 text-sm font-medium transition-colors ${c.ok ? "text-primary" : "text-on-surface-variant"}`}>
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: c.ok ? "'FILL' 1" : "'FILL' 0" }}>
            {c.ok ? "check_circle" : "radio_button_unchecked"}
          </span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

function PassForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const seeker = searchParams.get("seeker") === "1";
  const volunteer = searchParams.get("volunteer") === "1";

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber: phone, password, seeker, volunteer }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Coś poszło nie tak.");
        return;
      }

      const userData = await res.json();
      localStorage.setItem("user_id", userData.userId);
      localStorage.setItem("user_name", userData.name);
      localStorage.setItem("user_phone", userData.phoneNumber);
      localStorage.setItem("user_role", userData.role);

      router.push(userData.role === "SEEKER" ? "/new-request" : "/map");
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
          href={`/register?${searchParams.toString()}`}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight text-primary">Utwórz hasło</h1>
        <span className="text-xs font-bold text-on-surface-variant">Krok 3 z 3</span>
      </header>

      <main className="w-full px-8 pt-24 pb-12 flex flex-col flex-grow relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />

        <div className="mb-10 relative z-10">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">lock</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface leading-tight">
            Ustaw hasło,<br /> {name ? name.split(" ")[0] : ""}
          </h2>
          <p className="text-on-surface-variant mt-3 font-medium">
            Hasło zabezpiecza Twoje konto. Nikt inny go nie zobaczy.
          </p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">Hasło</label>
            <div className="relative group">
              <input
                className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 pr-14 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                placeholder="Wpisz hasło"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">{showPass ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {password.length > 0 && <PasswordCheck password={password} />}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || !isValid}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Utwórz konto</span>
                <span className="material-symbols-outlined">check</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function PassPage() {
  return (
    <Suspense>
      <PassForm />
    </Suspense>
  );
}
