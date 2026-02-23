"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  initialSearch?: string;
  height?: string;
  useAutoSearch?: boolean;
  isClearButtonActive?: boolean;
}

export default function SearchProductForm({
  height = "h-11 md:h-12",
  useAutoSearch = false,
  isClearButtonActive = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initialize state from URL to keep sync
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // 2. The Core Search Logic - Stable with useCallback
  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (term.trim()) {
        params.set("search", term.trim());
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      // We use router.push/replace directly for search to ensure instant URL feedback
      router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // 3. Optional: Handle Auto-search (Debounced)
  useEffect(() => {
    if (!useAutoSearch) return;

    const timer = setTimeout(() => {
      // Only search if the value is different from the current URL param
      if (value !== (searchParams.get("search") ?? "")) {
        handleSearch(value);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [value, useAutoSearch, handleSearch, searchParams]);

  // 4. Handle Form Submit (Manual Search)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
      <div
        className={`flex items-center flex-1 bg-white rounded-xl px-4 shadow-sm border border-primary/50 focus-within:border-primary transition ${height}`}
      >
        <Search className="text-gray-400 w-5 h-5 shrink-0" />

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Product"
          className="ml-3 w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />

        {isClearButtonActive && value && (
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!useAutoSearch && (
        <button
          type="submit"
          className={`px-4 rounded-xl bg-primary text-white font-medium transition duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0 ${height}`}
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Search className="w-5 h-5 lg:hidden" />
          <span className="hidden lg:block">Search</span>
        </button>
      )}
    </form>
  );
}
