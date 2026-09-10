"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FiltersContainerProps {
  searchPlaceholder?: string;
  statusLabel?: string;
  statusValue?: string;
  sortLabel?: string;
  sortValue?: string;
}

const statusOptions = ["Ativos", "Inativos", "Todos"];
const sortOptions = [
  "Nome (A-Z)",
  "Nome (Z-A)",
  "Mais recentes",
  "Mais antigos",
];

export default function FiltersContainer({
  searchPlaceholder = "Buscar por nome, CPF ou e-mail...",
  statusLabel = "Status:",
  statusValue = "Ativos",
  sortLabel = "Ordenar por:",
  sortValue = "Nome (A-Z)",
}: FiltersContainerProps) {
  const [status, setStatus] = useState(statusValue);
  const [sort, setSort] = useState(sortValue);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-20 w-full items-center gap-4 rounded-2xl border border-border bg-linear-to-r from-white to-page p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="flex h-12 w-90 items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-2 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]">
        <Search size={18} strokeWidth={2} className="shrink-0 text-slate" />

        <input
          type="text"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-small text-dark-gray outline-none placeholder:text-slate"
        />
      </div>

      <div ref={statusRef} className="relative w-42.5">
        <button
          type="button"
          onClick={() => {
            setStatusOpen((open) => !open);
            setSortOpen(false);
          }}
          aria-expanded={statusOpen}
          className="flex h-12 w-full items-center gap-2 rounded-xl border border-border bg-white px-4 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
        >
          <span className="shrink-0 whitespace-nowrap text-small font-normal text-light-gray">
            {statusLabel}
          </span>

          <span className="min-w-0 flex-1 truncate text-left text-small font-semibold text-dark-gray">
            {status}
          </span>

          <ChevronDown
            size={18}
            strokeWidth={2}
            className={`shrink-0 text-light-gray transition-transform ${
              statusOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {statusOpen && (
          <ul className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white p-1 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
            {statusOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    setStatus(option);
                    setStatusOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                    status === option
                      ? "font-semibold text-teal"
                      : "font-normal text-dark-gray"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div ref={sortRef} className="relative w-56.75">
        <button
          type="button"
          onClick={() => {
            setSortOpen((open) => !open);
            setStatusOpen(false);
          }}
          aria-expanded={sortOpen}
          className="flex h-12 w-full items-center gap-2 rounded-xl border border-border bg-white px-4 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
        >
          <span className="shrink-0 whitespace-nowrap text-small font-normal text-light-gray">
            {sortLabel}
          </span>

          <span className="min-w-0 flex-1 truncate text-small font-semibold text-dark-gray">
            {sort}
          </span>

          <ChevronDown
            size={14}
            strokeWidth={2}
            className={`shrink-0 text-light-gray transition-transform ${
              sortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {sortOpen && (
          <ul className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white p-1 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
            {sortOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                    sort === option
                      ? "font-semibold text-teal"
                      : "font-normal text-dark-gray"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
