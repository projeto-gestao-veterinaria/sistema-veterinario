"use client";

import { useEffect, useState } from "react";

import { listarProntuarios } from "@/services/prontuarios";
import { listarVacinas } from "@/services/vacinas";

type Veterinario = {
  nome: string;
  ultimaData: string;
};

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";

  const [year, month, day] = iso.split("-");

  return `${day}/${month}/${year}`;
}

export default function VeterinariosDePlantao() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarVacinas(undefined, controller.signal),
      listarProntuarios(undefined, controller.signal),
    ])
      .then(([vacinas, prontuarios]) => {
        if (!active) return;

        const porNome = new Map<string, Veterinario>();

        for (const vacina of vacinas) {
          const atual = porNome.get(vacina.veterinario);

          if (!atual || vacina.data_aplicacao > atual.ultimaData) {
            porNome.set(vacina.veterinario, {
              nome: vacina.veterinario,
              ultimaData: vacina.data_aplicacao,
            });
          }
        }

        for (const prontuario of prontuarios) {
          const atual = porNome.get(prontuario.veterinario);

          if (!atual || prontuario.data > atual.ultimaData) {
            porNome.set(prontuario.veterinario, {
              nome: prontuario.veterinario,
              ultimaData: prontuario.data,
            });
          }
        }

        setVeterinarios(
          Array.from(porNome.values())
            .sort((a, b) => b.ultimaData.localeCompare(a.ultimaData))
            .slice(0, 4),
        );
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os veterinários.");
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
    <section className="box-border flex h-47.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
        Veterinários de Plantão
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-4">
        {loading && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Carregando...
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

        {!loading && !error && veterinarios.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhum Veterinário de Plantão.
            </span>
          </li>
        )}

        {!loading &&
          !error &&
          veterinarios.map((vet) => (
            <li key={vet.nome} className="flex w-full items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full border border-border bg-[#F0FDFA]" />

              <div className="flex flex-1 flex-col items-start gap-0.5">
                <span className="font-inter text-sm font-semibold leading-4.25 text-dark-gray">
                  {vet.nome}
                </span>
                <span className="font-inter text-caption leading-3.75 text-light-gray">
                  Último registro em {formatarData(vet.ultimaData)}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
