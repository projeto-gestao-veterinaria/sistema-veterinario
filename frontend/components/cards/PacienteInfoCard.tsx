type StatusVariant = "green" | "orange" | "red" | "blue";

export interface PacienteInfoCardProps {
  nome: string;
  foto?: string;
  status: string;
  statusVariant?: StatusVariant;
  especie: string;
  raca: string;
  sexo: string;
  idade: string;
  peso?: string;
  tutor: string;
  telefone: string;
}

const statusStyles: Record<StatusVariant, string> = {
  green: "bg-teal-100 text-emerald-500",
  orange: "bg-[#FFF2E0] text-warning-amber",
  red: "bg-[#FFF2E6] text-error-red",
  blue: "bg-blue-100 text-info-blue",
};

export default function PacienteInfoCard({
  nome,
  foto,
  status,
  statusVariant = "green",
  especie,
  raca,
  sexo,
  idade,
  peso,
  tutor,
  telefone,
}: PacienteInfoCardProps) {
  const detalhes = [
    `Espécie: ${especie}`,
    `Raça: ${raca}`,
    `Sexo: ${sexo}`,
    `Idade: ${idade}`,
    peso ? `Peso: ${peso}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="box-border flex h-32 w-full flex-row items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(13,148,135,0.08)]">
      <div className="flex h-20 flex-row items-center gap-5">
        <div
          className="h-20 w-20 shrink-0 rounded-full bg-slate-100 bg-cover bg-center"
          style={foto ? { backgroundImage: `url(${foto})` } : undefined}
        />

        <div className="flex h-[68px] w-full flex-col items-start gap-1.5">
          <div className="flex h-[23px] flex-row items-center gap-3">
            <h2 className="font-['Outfit'] text-lg font-bold leading-[23px] text-slate-800">
              {nome}
            </h2>

            <span
              className={`flex h-[23px] items-center rounded-full px-[10px] py-1 font-['Inter'] text-xs font-semibold leading-[15px] ${statusStyles[statusVariant]}`}
            >
              {status}
            </span>
          </div>

          <p className="font-['Inter'] text-sm font-normal leading-[17px] text-slate-500">
            {detalhes}
          </p>

          <p className="font-['Inter'] text-[13px] font-normal leading-4 text-slate-500">
            Tutor: {tutor} | Telefone: {telefone}
          </p>
        </div>
      </div>
    </div>
  );
}
