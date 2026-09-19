import type { ReactNode } from "react";

import PacienteInfoCard, {
  type PacienteInfoCardProps,
} from "./PacienteInfoCard";

interface PacienteInfoSearchProps {
  pacientes: PacienteInfoCardProps[];
  query: string;
  children?: ReactNode;
}

export default function PacienteInfoSearch({
  pacientes,
  query,
  children,
}: PacienteInfoSearchProps) {
  const normalized = query.trim().toLowerCase();

  const pacienteEncontrado = normalized
    ? (pacientes.find((paciente) =>
        paciente.nome.toLowerCase().includes(normalized),
      ) ?? null)
    : null;

  return (
    <div className="pt-8">
      {pacienteEncontrado ? (
        <div className="flex flex-col gap-4">
          <PacienteInfoCard {...pacienteEncontrado} />

          {children}
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
