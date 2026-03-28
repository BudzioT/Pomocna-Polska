"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import RequestCard from "@/components/ui/RequestCard";
import type { HelpCategory } from "@/types";

/* ── Serializable request shape coming from the server component ── */
export interface FeedRequest {
  id: string;
  title: string;
  description: string;
  type: "IN_PERSON" | "REMOTE";
  category: string;
  address: string | null;
  createdAt: string; // ISO string
  author: { id: string; name: string; avatarUrl: string | null };
}

interface FeedClientProps {
  requests: FeedRequest[];
}

export default function FeedClient({ requests }: FeedClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Derive unique locations from the data ── */
  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const r of requests) {
      const city = extractCity(r.address);
      if (city) set.add(city);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pl"));
  }, [requests]);

  /* ── Filter logic ── */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return requests.filter((r) => {
      // text search – matches title, description, or author name
      if (q) {
        const haystack = `${r.title} ${r.description} ${r.author.name}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // location filter
      if (selectedLocation) {
        const city = extractCity(r.address);
        if (city !== selectedLocation) return false;
      }
      
      // category filter
      if (selectedCategory && r.category !== selectedCategory) return false;
      
      return true;
    });
  }, [requests, query, selectedLocation, selectedCategory]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* ── Search + filters ── */}
      <section className="mt-4 mb-6">
        {/* Search bar */}
        <div className="bg-surface-container-low rounded-xl flex items-center px-4 py-3 mb-4 shadow-sm ring-1 ring-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-200">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">
            search
          </span>
          <input
            id="feed-search"
            className="bg-transparent border-none focus:ring-0 text-body font-medium placeholder-on-surface-variant/60 w-full outline-none"
            placeholder="Czego szukasz?"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface transition-colors ml-1 text-[20px]"
              aria-label="Wyczyść wyszukiwanie"
            >
              close
            </button>
          )}
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-2 -mx-4 px-4 overflow-x-auto hide-scrollbar relative">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
              selectedCategory === null
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
            }`}
          >
            Wszystkie
          </button>
          {[
            { id: "SHOPPING", label: "Zakupy" },
            { id: "MEDICINE", label: "Medycyna" },
            { id: "TRANSPORT", label: "Transport" },
            { id: "COMPANIONSHIP", label: "Towarzystwo" },
            { id: "EDUCATION", label: "Edukacja" },
            { id: "ANIMALS", label: "Zwierzęta" },
            { id: "HOUSEHOLD", label: "Dom" },
            { id: "OTHER", label: "Inne" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
                selectedCategory === cat.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Additional Filters row */}
        <div className="flex items-center gap-2 -mx-4 px-4 relative mt-3">
          {/* Location filter dropdown */}
          <div className="relative z-50" ref={dropdownRef}>
            <button
              id="location-filter-btn"
              onClick={() => setLocationOpen((v) => !v)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
                selectedLocation
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              {selectedLocation
                ? truncate(selectedLocation, 20)
                : "Lokalizacja"}
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                  locationOpen ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {/* Dropdown panel */}
            {locationOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 max-h-60 overflow-y-auto bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-[100] animate-in fade-in slide-in-from-top-1">
                {/* Clear option */}
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setLocationOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                    !selectedLocation
                      ? "bg-primary-fixed text-primary font-bold"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    public
                  </span>
                  Wszystkie lokalizacje
                </button>

                {locations.length === 0 && (
                  <div className="px-4 py-3 text-sm text-on-surface-variant/60 italic">
                    Brak lokalizacji
                  </div>
                )}

                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                      selectedLocation === loc
                        ? "bg-primary-fixed text-primary font-bold"
                        : "text-on-surface hover:bg-surface-container-low font-medium"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

          {/* Active filters indicator */}
          {(query || selectedLocation || selectedCategory) && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedLocation(null);
                setSelectedCategory(null);
              }}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-error-container text-on-error-container font-semibold text-sm flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_alt_off
              </span>
              Wyczyść filtry
            </button>
          )}
      </section>

      {/* ── Results counter ── */}
      {(query || selectedLocation || selectedCategory) && (
        <div className="mb-3 text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">
            filter_list
          </span>
          Znaleziono{" "}
          <span className="font-bold text-on-surface">{filtered.length}</span>{" "}
          {pluralizeResults(filtered.length)}
        </div>
      )}

      {/* ── Request cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
              search_off
            </span>
            <p className="text-on-surface-variant font-medium">
              {query || selectedLocation || selectedCategory
                ? "Nie znaleziono pasujących próśb"
                : "Brak otwartych próśb o pomoc"}
            </p>
            {(query || selectedLocation || selectedCategory) && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedLocation(null);
                  setSelectedCategory(null);
                }}
                className="mt-3 text-primary font-bold text-sm hover:underline"
              >
                Wyczyść filtry
              </button>
            )}
          </div>
        )}
        {filtered.map((request, index) => (
          <div
            key={request.id}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
          >
            <RequestCard
              request={{
                id: request.id,
                title: request.title,
                description: request.description,
                category: (request.category || "OTHER").toLowerCase() as HelpCategory,
                type: request.type === "IN_PERSON" ? "in-person" : "remote",
                author: {
                  id: request.author.id,
                  name: request.author.name,
                  avatarUrl: request.author.avatarUrl ?? undefined,
                },
                createdAt: new Date(request.createdAt),
                status: "open",
              }}
              href={`/request/${request.id}`}
              accentColor={index % 2 === 0 ? "primary" : "secondary"}
            />
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Helpers ── */
function extractCity(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(",");
  let lastPart = parts[parts.length - 1].trim();
  // match something like 31-123 Kraków and just return Kraków
  lastPart = lastPart.replace(/^\d{2}-\d{3}\s*/, "");
  return lastPart || null;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function pluralizeResults(n: number): string {
  if (n === 1) return "prośbę";
  if (n >= 2 && n <= 4) return "prośby";
  return "próśb";
}
