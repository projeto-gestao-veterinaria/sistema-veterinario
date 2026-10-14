"use client";

import { Dog } from "lucide-react";
import { useEffect, useState } from "react";

import {
  listarAgendamentos,
  type AgendamentoResponse,
} from "@/services/agendamentos";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";

function todayISO(): string {
  const hoje = new Date();
  const year = hoje.getFullYear();
  const month = String(hoje.getMonth() + 1).padStart(2, "0");
  const day = String(hoje.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ProximasConsultasCard() {
  const [consultas, setConsultas] = useState<AgendamentoResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAgendamentos(controller.signal),
      listarTutores(controller.signal),
    ])
      .then(([agendamentosData, tutoresData]) => {
        if (!active) return;

        const hoje = todayISO();

        const consultasDeHoje = agendamentosData
          .filter((agendamento) => agendamento.data === hoje)
          .sort((a, b) => a.horario.localeCompare(b.horario));

        setConsultas(consultasDeHoje);
        setTutores(tutoresData);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar as consultas de hoje.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  function tutorNome(tutorId: number): string {
    return (
      tutores.find((tutor) => tutor.id === tutorId)?.nome ??
      "Tutor não informado"
    );
  }

  return (
    <section className="box-border flex h-104.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
          Próximas Consultas de Hoje
        </h2>

        <span className="flex items-center rounded-full border border-border bg-page px-3 py-2 font-inter text-caption font-semibold leading-3.75 text-orange">
          Hoje
        </span>
      </div>

      <ul className="flex w-full flex-1 flex-col gap-3 overflow-y-auto">
        {loading && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Carregando consultas...
            </span>
          </li>
        )}

        {!loading && error && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-error-red">
              {error}
            </span>
          </li>
        )}

        {!loading && !error && consultas.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhuma consulta agendada para hoje.
            </span>
          </li>
        )}

        {!loading &&
          !error &&
          consultas.map((consulta) => (
            <li
              key={consulta.id}
              className="box-border flex h-18 w-full shrink-0 items-center gap-3 rounded-[14px] border border-border bg-white p-3.5 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
            >
              <span className="h-11 w-1 shrink-0 rounded-xs bg-teal" />

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0FDFA]">
                  <Dog size={20} strokeWidth={2} className="text-teal" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-inter text-sm font-bold leading-4.25 text-dark-gray">
                    {consulta.animal.nome} ({consulta.animal.especie},{" "}
                    {consulta.animal.raca ?? "sem raça"})
                  </span>

                  <span className="truncate font-inter text-caption leading-3.75 text-light-gray">
                    Tutor: {tutorNome(consulta.animal.tutor_id)}
                  </span>
                </div>
              </div>

              <span className="shrink-0 font-inter text-sm font-bold leading-4.25 text-teal">
                {consulta.horario}
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
