"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

import SearchBar from "../search/SearchBar";
import UserAvatar from "../user/UserAvatar";
import DashboardButton from "../buttons/DashboardButton";

interface HeaderContent {
  title: string;
  description?: string;
  placeholder: string;
}

interface HeaderProps {
  name?: string | null;
  image?: string | null;
}

const headerContent: Record<string, HeaderContent> = {
  "/dashboard": {
    title: "Painel Geral",
    description: "Visão geral do seu sistema veterinário",
    placeholder: "Buscar pacientes, tutores, prontuários...",
  },

  "/tutores": {
    title: "Cadastro de Tutores",
    description: "Informações dos proprietários de pets",
    placeholder: "Buscar tutores, CPF, e-mail...",
  },

  "/animais": {
    title: "Cadastro de Animais",
    description: "Pacientes, tutores e histórico clínico",
    placeholder: "Buscar pacientes, tutores, prontuários...",
  },

  "/agendamento": {
    title: "Agendamento de Consultas",
    description: "Horários e atendimentos semanais",
    placeholder: "Buscar pacientes, tutores, prontuários...",
  },

  "/prontuarios": {
    title: "Prontuário Médico",
    description: "Histórico clínico detalhado de consultas",
    placeholder: "Buscar pacientes, tutores, prontuários...",
  },

  "/vacinas": {
    title: "Controle de Vacinas",
    description:
      "Imunização, doses aplicadas e agendamentos preventivos do paciente",
    placeholder: "Buscar vacinas, pacientes...",
  },
};

export default function Header({ name, image }: HeaderProps) {
  const pathname = usePathname();

  const { title, description, placeholder } = headerContent[pathname] ?? {
    title: "",
    description: "",
  };

  return (
    <div className="flex justify-between">
      <div>
        <h1 className="font-extrabold text-h1 leading-10 text-dark-navy">
          {title}
        </h1>
        {description && (
          <p className="w-117.75 h-4.25 font-inter font-normal text-small leading-4.25 text-light-gray">
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-center gap-2 ">
        <SearchBar placeholder={placeholder} />
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-white shadow-[0px_6px_16px_-8px_rgba(0,0,0,0.0313726)]">
          <Bell size={16} className=" text-orange font-bold" />
        </div>
        <UserAvatar name={name} image={image} />
        <DashboardButton />
      </div>
    </div>
  );
}
