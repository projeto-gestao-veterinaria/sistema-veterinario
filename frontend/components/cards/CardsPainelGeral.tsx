"use client";

import {
  Activity,
  Dog,
  Syringe,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { listarAnimais } from "@/services/animais";
import { listarAgendamentos } from "@/services/agendamentos";
import { listarTutores } from "@/services/tutores";
import { listarVacinas } from "@/services/vacinas";

type KpiColor = "teal" | "orange";

type Kpi = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: KpiColor;
  iconColor: KpiColor;
};

function todayISO(): string {
  const hoje = new Date();
  const year = hoje.getFullYear();
  const month = String(hoje.getMonth() + 1).padStart(2, "0");
  const day = String(hoje.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const colorStyles = {
  teal: {
    card: "border-teal bg-linear-to-r from-white to-[#F0FDFA] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_10px_24px_-10px_rgba(13,148,135,0.0784314)]",
    badge:
      "border-teal bg-linear-to-r from-white to-[#F0FDFA] shadow-[0_6px_14px_-6px_rgba(13,148,135,0.0392157)]",
  },
  orange: {
    card: "border-warning-amber bg-linear-to-r from-white to-[#FFF7ED] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_10px_24px_-10px_rgba(245,158,11,0.0784314)]",
    badge:
      "border-warning-amber bg-linear-to-r from-white to-[#FFF7ED] shadow-[0_6px_14px_-6px_rgba(245,158,11,0.0392157)]",
  },
} as const;

const iconColors = {
  teal: "text-teal",
  orange: "text-orange",
} as const;

export default function CardsPainelGeral() {
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarTutores(controller.signal),
      listarAnimais(controller.signal),
      listarAgendamentos(controller.signal),
      listarVacinas(undefined, controller.signal),
    ])
      .then(([tutores, animais, agendamentos, vacinas]) => {
        if (!active) return;

        const hoje = todayISO();
        const consultasHoje = agendamentos.filter(
          (agendamento) => agendamento.data === hoje,
        ).length;

        const vacinasPendentes = vacinas.filter(
          (vacina) => vacina.status !== "Aplicada",
        ).length;

        setKpis([
          {
            title: "Total de Tutores",
            value: String(tutores.length),
            subtitle: "cadastrados no sistema",
            icon: Users,
            color: "teal",
            iconColor: "teal",
          },
          {
            title: "Animais Cadastrados",
            value: String(animais.length),
            subtitle: "pacientes no sistema",
            icon: Dog,
            color: "orange",
            iconColor: "teal",
          },
          {
            title: "Consultas Hoje",
            value: String(consultasHoje),
            subtitle: "agendamentos para hoje",
            icon: Activity,
            color: "orange",
            iconColor: "orange",
          },
          {
            title: "Vacinas Pendentes",
            value: String(vacinasPendentes),
            subtitle: "aguardando aplicação",
            icon: Syringe,
            color: "orange",
            iconColor: "orange",
          },
        ]);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os indicadores.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-38.5 w-full items-center justify-center">
        <span className="font-inter text-[13px] text-light-gray">
          Carregando indicadores...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-38.5 w-full items-center justify-center">
        <span className="font-inter text-[13px] text-error-red">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.title}
            className={`box-border flex h-38.5 w-full flex-1 flex-col items-start gap-3 rounded-[14px] border p-5 ${colorStyles[kpi.color].card}`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-inter text-[13px] font-bold leading-4 text-medium-gray">
                {kpi.title}
              </span>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colorStyles[kpi.color].badge}`}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={iconColors[kpi.iconColor]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-outfit text-h1 font-extrabold leading-10 text-dark-navy">
                {kpi.value}
              </span>

              <span className="font-inter text-[13px] font-normal leading-4 text-light-gray">
                {kpi.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
