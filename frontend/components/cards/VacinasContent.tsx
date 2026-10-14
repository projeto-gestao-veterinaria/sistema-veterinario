"use client";

import { useEffect, useState } from "react";

import PacienteInfoCard from "@/components/cards/PacienteInfoCard";
import VaccinesTable from "@/components/tables/VaccinesTable";
import {
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";
import {
  listarVacinas,
  type VacinaResponse,
} from "@/services/vacinas";

interface VacinasContentProps {
  query: string;
}

function calcularIdade(dataNascimento: string | null): string {
  if (!dataNascimento) return "—";

  const nascimento = new Date(dataNascimento);
  const agora = new Date();

  let idade = agora.getFullYear() - nascimento.getFullYear();
  const mes = agora.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && agora.getDate() < nascimento.getDate())) {
    idade -= 1;
  }

  return `${idade} anos`;
}

export default function VacinasContent({ query }: VacinasContentProps) {
  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [vacinas, setVacinas] = useState<VacinaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAnimais(controller.signal),
      listarTutores(controller.signal),
      listarVacinas(undefined, controller.signal),
    ])
      .then(([animaisData, tutoresData, vacinasData]) => {
        if (!active) return;
        setAnimais(animaisData);
        setTutores(tutoresData);
        setVacinas(vacinasData);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar as vacinas.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const normalized = query.trim().toLowerCase();

  const pacienteEncontrado = normalized
    ? (animais.find((animal) =>
        animal.nome.toLowerCase().includes(normalized),
      ) ?? null)
    : null;

  const tutorEncontrado = pacienteEncontrado
    ? tutores.find((tutor) => tutor.id === pacienteEncontrado.tutor_id)
    : undefined;

  const vacinasDoPaciente = pacienteEncontrado
    ? vacinas.filter((vacina) => vacina.animal_id === pacienteEncontrado.id)
    : [];

  function getStatusGeral(): {
    status: string;
    variant: "green" | "orange" | "red" | "blue";
  } {
    if (vacinasDoPaciente.some((vacina) => vacina.status === "Atrasada")) {
      return { status: "Atrasada", variant: "red" };
    }

    if (vacinasDoPaciente.some((vacina) => vacina.status === "Pendente")) {
      return { status: "Pendente", variant: "orange" };
    }

    if (vacinasDoPaciente.length > 0) {
      return { status: "Em dia", variant: "green" };
    }

    return { status: "Sem vacinas", variant: "blue" };
  }

  return (
    <div className="pt-8">
      {loading ? (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-light-gray">
            Carregando...
          </span>
        </div>
      ) : error ? (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-error-red">{error}</span>
        </div>
      ) : pacienteEncontrado ? (
        <div className="flex flex-col gap-4">
          <PacienteInfoCard
            nome={pacienteEncontrado.nome}
            status={getStatusGeral().status}
            statusVariant={getStatusGeral().variant}
            especie={pacienteEncontrado.especie}
            raca={pacienteEncontrado.raca ?? "—"}
            sexo={pacienteEncontrado.sexo}
            idade={calcularIdade(pacienteEncontrado.data_nascimento)}
            tutor={tutorEncontrado?.nome ?? "—"}
            telefone={tutorEncontrado?.telefone ?? "—"}
          />

          <VaccinesTable vacinas={vacinasDoPaciente} />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-light-gray">
            {normalized
              ? "Nenhum paciente encontrado com esse nome."
              : "Pesquise um paciente no campo de busca do topo."}
          </span>
        </div>
      )}
    </div>
  );
}
