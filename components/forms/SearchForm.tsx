import { Search } from "lucide-react";

export default function SearchProductForm({ height = "h-11 md:h-12" }) {
  return (
    <div className="flex items-center gap-2 w-full">
      {/* Search Input Container */}
      <div
        className={`flex items-center flex-1 bg-white rounded-xl px-4 shadow-sm border border-primary/50 focus-within:border-primary transition ${height}`}
      >
        <Search className="text-gray-400 w-5 h-5 shrink-0" />
        <input
          type="text"
          placeholder="Search Product"
          className="ml-3 w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Search Button */}
      <button
        className={`px-4 rounded-xl bg-primary text-white font-medium transition duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0 ${height}`}
      >
        <Search className="w-5 h-5 lg:hidden" />
        <span className="hidden lg:block">Search</span>
      </button>
    </div>
  );
}
