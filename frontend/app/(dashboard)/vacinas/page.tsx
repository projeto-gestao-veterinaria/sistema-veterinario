import PacienteInfoSearch from "@/components/cards/PacienteInfoSearch";
import type { PacienteInfoCardProps } from "@/components/cards/PacienteInfoCard";
import VaccinesTable from "@/components/tables/VaccinesTable";

const pacientes: PacienteInfoCardProps[] = [
  {
    nome: "Pipoca",
    status: "Concluído",
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
    nome: "Mel",
    status: "Pendente",
    statusVariant: "orange",
    especie: "Gato",
    raca: "Siamês",
    sexo: "Fêmea",
    idade: "2 anos",
    peso: "4,2 kg",
    tutor: "Mariana Costa",
    telefone: "(12) 97654-3210",
  },
  {
    nome: "Thor",
    status: "Atrasada",
    statusVariant: "red",
    especie: "Cão",
    raca: "Pug",
    sexo: "Macho",
    idade: "1 ano",
    peso: "6,5 kg",
    tutor: "Felipe Oliveira",
    telefone: "(12) 96543-2109",
  },
];

export default async function Vacinas({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return (
    <PacienteInfoSearch pacientes={pacientes} query={query}>
      <VaccinesTable />
    </PacienteInfoSearch>
  );
}
