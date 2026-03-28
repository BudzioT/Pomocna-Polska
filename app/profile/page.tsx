import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { currentUser } from "@/lib/mockData";

export default function ProfilePage() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#8F000D] text-2xl">
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#8F000D] tracking-tight">
            Mój profil
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5DC] transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[#1B1D0E]">edit</span>
        </button>
      </header>

      <main className="pt-20 px-4">
        {/* Avatar + name */}
        <section className="mt-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-xl">
              {currentUser.avatarUrl && (
                <Image
                  alt="Avatar użytkownika"
                  className="w-full h-full object-cover"
                  src={currentUser.avatarUrl}
                  width={128}
                  height={128}
                />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-2 border-4 border-surface shadow-lg">
              <span
                className="material-symbols-outlined text-on-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {currentUser.name}
            </h2>
            <div className="flex items-center justify-center gap-1 text-on-surface-variant mt-1">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              <span className="text-sm font-medium">{currentUser.location}</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-primary/10">
            <p className="text-2xl font-extrabold text-primary">
              {currentUser.helpGiven}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">
              Udzielona pomoc
            </p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-secondary/10">
            <p className="text-2xl font-extrabold text-secondary">
              {currentUser.helpReceived}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">
              Otrzymana pomoc
            </p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm text-center border-b-2 border-primary/10">
            <p className="text-2xl font-extrabold text-on-surface">
              {currentUser.endorsements}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant leading-none mt-1">
              Poręczenia
            </p>
          </div>
        </section>

        {/* History */}
        <section className="mt-8 mb-6">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">
            Ostatnia historia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link
              href="/chat"
              className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">😇</div>
                <div>
                  <p className="font-bold text-on-surface leading-tight">
                    Wspólne zakupy
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    Z: Panią Marią
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">
                chat
              </span>
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
