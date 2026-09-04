"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const ButtonContent = {
  "/dashboard": {
    title: "Novo Atendimento",
    link: "/atendimento/novo",
  },

  "/tutores": {
    title: "+ Adicionar Tutor",
    link: "/tutores/novo",
  },

  "/animais": {
    title: "+ Novo Animal",
    link: "/animais/novo",
  },

  "/agendamento": {
    title: "+ Agendar Horário",
    link: "/agendamento/novo",
  },

  "/prontuarios": {
    title: "+ Novo Atendimento",
    link: "/prontuarios/novo",
  },

  "/vacinas": {
    title: "+ Nova Vacina",
    link: "/vacinas/novo",
  },
};

export default function DashboardButton() {
  const pathname = usePathname();

  const content = ButtonContent[pathname as keyof typeof ButtonContent];

  if (!content) return null;

  return (
    <Link
      href={content.link}
      className="flex h-10 w-52 flex-none items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 text-small shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)]"
    >
      <Plus size={16} className="shrink-0 text-white" strokeWidth={3} />
      <span className="font-medium text-small leading-none text-white">
        {content.title}
      </span>
    </Link>
  );
}
