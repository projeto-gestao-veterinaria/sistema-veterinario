"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type SearchBarProps = {
  placeholder: string;
};

interface SearchBarViewProps {
  placeholder: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

function SearchBarView({
  placeholder,
  value = "",
  disabled = false,
  onChange,
}: SearchBarViewProps) {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search
        size={32}
        className="absolute text-slate font-bold left-0 flex items-center pl-3 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-[320px] text-slate font-semibold text-small rounded-xl border-2 border-border bg-white px-3.5 shadow-[0px_6px_16px_-8px_rgba(0,0,0,0.0313726)] pl-10 pr-4 py-2 outline-none"
      />
    </div>
  );
}

function SearchBarInput({ placeholder }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(() => searchParams.get("q") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(nextValue: string) {
    setValue(nextValue);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextValue.trim()) {
        params.set("q", nextValue);
      } else {
        params.delete("q");
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);
  }

  return (
    <SearchBarView
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}

export default function SearchBar({ placeholder }: SearchBarProps) {
  const pathname = usePathname();

  return (
    <Suspense
      fallback={<SearchBarView placeholder={placeholder} disabled />}
    >
      <SearchBarInput key={pathname} placeholder={placeholder} />
    </Suspense>
  );
}
