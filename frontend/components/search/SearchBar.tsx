import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder: string;
};

export default function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search
        size={32}
        className="absolute text-slate font-bold left-0 flex items-center pl-3 pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="h-11 w-[320px] text-slate font-semibold text-small rounded-xl border-2 border-border bg-white px-3.5 shadow-[0px_6px_16px_-8px_rgba(0,0,0,0.0313726)] pl-10 pr-4 py-2 outline-none"
      />
    </div>
  );
}
