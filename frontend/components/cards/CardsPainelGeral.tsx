import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Dog,
  Syringe,
  Users,
  type LucideIcon,
} from "lucide-react";

type KpiColor = "teal" | "orange";

type Kpi = {
  title: string;
  value: string;
  trend: string;
  direction: "up" | "down";
  icon: LucideIcon;
  color: KpiColor;
  iconColor: KpiColor;
};

const kpis: Kpi[] = [
  {
    title: "Total de Tutores",
    value: "1.248",
    trend: "+12.4%",
    direction: "up",
    icon: Users,
    color: "teal",
    iconColor: "teal",
  },
  {
    title: "Animais Cadastrados",
    value: "1.894",
    trend: "+8.2%",
    direction: "up",
    icon: Dog,
    color: "orange",
    iconColor: "teal",
  },
  {
    title: "Consultas Hoje",
    value: "18",
    trend: "+5.0%",
    direction: "up",
    icon: Activity,
    color: "orange",
    iconColor: "orange",
  },
  {
    title: "Vacinas Pendentes",
    value: "12",
    trend: "-15.3%",
    direction: "down",
    icon: Syringe,
    color: "orange",
    iconColor: "orange",
  },
];

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
  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const TrendIcon =
          kpi.direction === "up" ? ArrowUpRight : ArrowDownRight;
        const trendColor =
          kpi.direction === "up" ? "text-success-green" : "text-error-red";

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

              <div className="flex items-center gap-1.5">
                <TrendIcon size={16} strokeWidth={2} className={trendColor} />
                <span
                  className={`font-inter text-[13px] font-bold leading-4 ${trendColor}`}
                >
                  {kpi.trend}
                </span>
                <span className="font-inter text-[13px] font-normal leading-4 text-light-gray">
                  desde o mês passado
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
