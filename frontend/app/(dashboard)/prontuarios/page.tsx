import PacienteInfoSearch from "@/components/cards/PacienteInfoSearch";
import type { PacienteInfoCardProps } from "@/components/cards/PacienteInfoCard";

const pacientes: PacienteInfoCardProps[] = [
  {
    nome: "Pipoca",
    status: "Em dia",
    statusVariant: "green",
    especie: "Cão",
    raca: "Golden Retriever",
    sexo: "Macho",
    idade: "3 anos",
    peso: "28 kg",
    tutor: "Carlos Silva",
    telefone: "(12) 98765-4321",
  },
  {
    nome: "Luna",
    status: "Retorno",
    statusVariant: "orange",
    especie: "Cão",
    raca: "Vira-lata",
    sexo: "Fêmea",
    idade: "4 anos",
    peso: "18 kg",
    tutor: "Ana Santos",
    telefone: "(12) 95432-1098",
  },
];

export default async function Prontuarios({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return <PacienteInfoSearch pacientes={pacientes} query={query} />;
}
