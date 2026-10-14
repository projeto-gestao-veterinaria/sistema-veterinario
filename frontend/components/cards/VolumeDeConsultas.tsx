"use client";

import { useEffect, useState } from "react";

import { listarAgendamentos } from "@/services/agendamentos";

type Bar = {
  dia: string;
  altura: number;
  color: "teal" | "orange";
};

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const barStyles = {
  teal: "rounded-t-[10px] bg-linear-to-b from-[#0D9487] to-[#26ADA1] shadow-[0_6px_14px_-6px_rgba(13,148,135,0.2)]",
  orange:
    "rounded-md bg-linear-to-b from-[#F58C2E] to-[#FAAD59] shadow-[0_6px_14px_-6px_rgba(245,158,11,0.2)]",
} as const;

function toISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mondayOf(date: Date): Date {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export default function VolumeDeConsultas() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    listarAgendamentos(controller.signal)
      .then((agendamentos) => {
        if (!active) return;

        const segunda = mondayOf(new Date());
        const hoje = toISO(new Date());

        const contagens = diasSemana.map((dia, index) => {
          const data = new Date(segunda);
          data.setDate(segunda.getDate() + index);

          return agendamentos.filter(
            (agendamento) => agendamento.data === toISO(data),
          ).length;
        });

        const total = contagens.reduce((soma, valor) => soma + valor, 0);
        const maximo = Math.max(...contagens, 1);

        if (total === 0) {
          setBars([]);
          setError(null);
          setLoading(false);
          return;
        }

        setBars(
          diasSemana.map((dia, index) => ({
            dia,
            altura:
              contagens[index] === 0
                ? 6
                : Math.round((contagens[index] / maximo) * 110),
            color: toISO(
              new Date(
                segunda.getFullYear(),
                segunda.getMonth(),
                segunda.getDate() + index,
              ),
            ) === hoje
              ? "orange"
              : "teal",
          })),
        );
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar o volume de consultas.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="box-border flex h-76.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
        Volume de Consultas Semanais
      </h2>

      {loading && (
        <div className="flex h-55 w-full flex-1 items-center justify-center">
          <span className="font-inter text-[13px] text-light-gray">
            Carregando...
          </span>
        </div>
      )}

      {!loading && error && (
        <div className="flex h-55 w-full flex-1 items-center justify-center">
          <span className="font-inter text-[13px] text-error-red">{error}</span>
        </div>
      )}

      {!loading && !error && bars.length === 0 && (
        <div className="flex h-55 w-full flex-1 items-center justify-center">
          <span className="font-inter text-[13px] text-light-gray">
            Nenhum dado disponível.
          </span>
        </div>
      )}

      {!loading && !error && bars.length > 0 && (
        <div className="relative h-55 w-full">
          <span className="absolute inset-x-0 top-10 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 top-22.5 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 top-35 h-px bg-border opacity-70" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-border opacity-70" />

          <div className="absolute inset-0 z-10 flex items-end gap-4 px-5">
            {bars.map((bar) => (
              <div
                key={bar.dia}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className={`w-full ${barStyles[bar.color]}`}
                  style={{ height: bar.altura }}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex gap-4 px-5">
            {bars.map((bar) => (
              <div key={bar.dia} className="flex flex-1 justify-center">
                <span className="font-inter text-caption leading-3.75 text-light-gray">
                  {bar.dia}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
