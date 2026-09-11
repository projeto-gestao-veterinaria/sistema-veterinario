"use client";

import { AlertTriangle, ChevronDown, Dog, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  peso: string;
  tutor: string;
  especie: string;
  raca: string;
  ultimoAtendimento: string;
  alerta?: boolean;
}

const pacientes: Paciente[] = [
  // {
  //   id: 1,
  //   nome: "Pipoca",
  //   idade: 3,
  //   peso: "28 kg",
  //   tutor: "Carlos Silva",
  //   especie: "Cão",
  //   raca: "Golden Retriever",
  //   ultimoAtendimento: "Hoje",
  // },
  // {
  //   id: 2,
  //   nome: "Mel",
  //   idade: 2,
  //   peso: "4.2 kg",
  //   tutor: "Mariana Costa",
  //   especie: "Gato",
  //   raca: "Siamês",
  //   ultimoAtendimento: "Ontem",
  // },
  // {
  //   id: 3,
  //   nome: "Thor",
  //   idade: 1,
  //   peso: "6.5 kg",
  //   tutor: "Felipe Oliveira",
  //   especie: "Cão",
  //   raca: "Pug",
  //   ultimoAtendimento: "2 dias atrás",
  //   alerta: true,
  // },
  // {
  //   id: 4,
  //   nome: "Luna",
  //   idade: 4,
  //   peso: "18 kg",
  //   tutor: "Ana Santos",
  //   especie: "Cão",
  //   raca: "Vira-lata",
  //   ultimoAtendimento: "3 dias atrás",
  // },
];

export default function AnimalCards() {
  const [status, setStatus] = useState("Todos");
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const statusOptions = ["Todos", "Com alerta", "Sem alerta"];

  const pacientesFiltrados = pacientes.filter((paciente) => {
    if (status === "Com alerta") return paciente.alerta;
    if (status === "Sem alerta") return !paciente.alerta;
    return true;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="box-border flex h-106.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-[#F8FAFC] p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="flex h-9 w-full items-center justify-between">
        <h2 className="font-['Outfit'] text-[18px] font-bold leading-5.75 text-dark-navy">
          Registro de Pacientes
        </h2>

        <div className="flex h-9 items-center gap-3">
          <button
            type="button"
            className="box-border flex h-8.5 items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
          >
            <Search size={18} strokeWidth={2} className="text-slate" />

            <span className="font-['Inter'] text-[13px] font-semibold leading-4 text-light-gray">
              Filtros
            </span>
          </button>

          <div ref={statusRef} className="relative">
            <button
              type="button"
              onClick={() => setStatusOpen((open) => !open)}
              aria-expanded={statusOpen}
              className="box-border flex h-9 w-47.5 items-center justify-between gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
            >
              <span className="whitespace-nowrap font-['Inter'] text-[13px] font-semibold leading-4 text-light-gray">
                Status: {status}
              </span>

              <ChevronDown
                size={20}
                strokeWidth={2}
                className={`text-light-gray transition-transform ${
                  statusOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusOpen && (
              <ul className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-border bg-white p-1 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
                {statusOptions.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus(option);
                        setStatusOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left font-['Inter'] text-[13px] transition-colors hover:bg-page ${
                        status === option
                          ? "font-semibold text-teal"
                          : "font-normal text-light-gray"
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
      </div>

      <div className="flex h-81.75 w-full flex-col overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="box-border flex h-9.75 w-full items-center gap-3 border-b border-border bg-linear-to-r from-white to-[#F0FDFA] px-4 py-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex-1 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Paciente
          </div>

          <div className="w-55 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Tutor
          </div>

          <div className="w-30 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Espécie
          </div>

          <div className="w-35 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Raça
          </div>

          <div className="w-30 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Últ. Atendimento
          </div>

          <div className="w-29 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Ações
          </div>
        </div>

        {pacientesFiltrados.map((paciente) => (
          <div
            key={paciente.id}
            className="box-border flex h-18 w-full items-center gap-3 border-b border-border bg-white px-4 py-3.5 last:border-b-0"
          >
            <div className="flex h-11 min-w-0 flex-1 items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] ${
                  paciente.alerta
                    ? "bg-[#FEE2E2]"
                    : paciente.especie === "Gato"
                      ? "bg-[#FFEDD5]"
                      : "bg-[#F0FDFA]"
                }`}
              >
                {paciente.alerta ? (
                  <AlertTriangle
                    size={20}
                    strokeWidth={2}
                    className="text-orange"
                  />
                ) : (
                  <Dog
                    size={20}
                    strokeWidth={2}
                    className={
                      paciente.especie === "Gato"
                        ? "text-warning-amber"
                        : "text-teal"
                    }
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-['Inter'] text-sm font-bold leading-4.25 text-dark-gray">
                  {paciente.nome}
                </span>

                <span className="truncate font-['Inter'] text-xs font-normal leading-3.75 text-light-gray">
                  {paciente.especie} • {paciente.idade} anos • {paciente.peso}
                </span>
              </div>
            </div>

            <div className="w-55 truncate font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
              {paciente.tutor}
            </div>

            <div className="w-30 font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
              {paciente.especie}
            </div>

            <div className="w-35 truncate font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
              {paciente.raca}
            </div>

            <div
              className={`w-30 font-['Inter'] text-[13px] font-normal leading-4 ${
                paciente.ultimoAtendimento === "Hoje"
                  ? "text-orange"
                  : paciente.ultimoAtendimento === "Ontem"
                    ? "text-orange"
                    : "text-light-gray"
              }`}
            >
              {paciente.ultimoAtendimento}
            </div>

            <div className="flex w-29 items-center gap-2">
              <button
                type="button"
                className="box-border h-8 rounded-full border border-border bg-white px-3 py-2 font-['Inter'] text-[13px] font-semibold leading-4 text-light-gray shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] transition hover:bg-page"
              >
                Ver
              </button>

              <button
                type="button"
                className="box-border h-8 rounded-full border border-border bg-white px-3 py-2 font-['Inter'] text-[13px] font-semibold leading-4 text-orange shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] transition hover:bg-[#FFF7ED]"
              >
                Editar
              </button>
            </div>
          </div>
        ))}

        {pacientesFiltrados.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-['Inter'] text-[13px] text-light-gray">
              Nenhum paciente encontrado.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
