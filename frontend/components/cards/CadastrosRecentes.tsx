"use client";

import { useEffect, useState } from "react";

import {
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";

type Cadastro = {
  id: number;
  nome: string;
  tempo: string;
  info: string;
};

function tempoRelativo(criadoEm: string | null | undefined): string {
  if (!criadoEm) return "Recente";

  const criado = new Date(criadoEm);
  const agora = new Date();
  const diffDias = Math.floor(
    (agora.getTime() - criado.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDias <= 0) return "Hoje";
  if (diffDias === 1) return "Ontem";

  return `${diffDias} dias atrás`;
}

function getTimeColor(tempo: string) {
  if (tempo === "Hoje") return "text-orange";
  if (tempo === "Ontem") return "text-[#CC6B1A]";
  return "text-light-gray";
}

export default function CadastrosRecentes() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAnimais(controller.signal),
      listarTutores(controller.signal),
    ])
      .then(([animais, tutores]) => {
        if (!active) return;

        const nomesTutores = new Map(
          tutores.map((tutor: TutorResponse) => [tutor.id, tutor.nome]),
        );

        const ordenados = [...animais].sort((a, b) => {
          const aTime = a.criado_em
            ? new Date(a.criado_em).getTime()
            : Number.NEGATIVE_INFINITY;
          const bTime = b.criado_em
            ? new Date(b.criado_em).getTime()
            : Number.NEGATIVE_INFINITY;

          if (aTime !== bTime) return bTime - aTime;

          return b.id - a.id;
        });

        setCadastros(
          ordenados.slice(0, 4).map((animal: AnimalResponse) => ({
            id: animal.id,
            nome: animal.nome,
            tempo: tempoRelativo(animal.criado_em),
            info: `${animal.raca ?? "Sem raça"} • Tutor: ${
              nomesTutores.get(animal.tutor_id) ?? "não informado"
            }`,
          })),
        );
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os cadastros recentes.");
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
        Cadastros Recentes
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-3 overflow-y-auto">
        {loading && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Carregando cadastros...
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

        {!loading && !error && cadastros.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhum Cadastro Recente.
            </span>
          </li>
        )}

        {!loading &&
          !error &&
          cadastros.map((cadastro) => (
            <li
              key={cadastro.id}
              className="flex w-full items-center justify-between border-b border-border pb-3 opacity-90 last:border-0"
            >
              <div className="flex flex-col gap-0.5">
                <h3 className="font-inter text-sm font-semibold leading-4.25 text-dark-gray">
                  {cadastro.nome}
                </h3>
                <p className="font-inter text-caption leading-3.75 text-light-gray">
                  {cadastro.info}
                </p>
              </div>

              <span
                className={`shrink-0 font-inter text-caption leading-3.75 ${getTimeColor(
                  cadastro.tempo,
                )}`}
              >
                {cadastro.tempo}
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
