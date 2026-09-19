interface Vaccine {
  nome: string;
  dose: string;
  dataAplicacao: string;
  proximaDose: string;
  veterinario: string;
  status: "Aplicada" | "Pendente" | "Atrasada";
}

const vacinas: Vaccine[] = [
  {
    nome: "Antirrábica",
    dose: "Anual",
    dataAplicacao: "03/06/2026",
    proximaDose: "03/06/2027",
    veterinario: "Dr. Felipe Castro",
    status: "Aplicada",
  },
  {
    nome: "Múltipla Canina V10",
    dose: "Anual",
    dataAplicacao: "15/05/2026",
    proximaDose: "15/05/2027",
    veterinario: "Dra. Carolina Mendes",
    status: "Aplicada",
  },
  {
    nome: "Gripe (Traqueobronquite)",
    dose: "Anual",
    dataAplicacao: "03/04/2026",
    proximaDose: "03/04/2027",
    veterinario: "Dra. Carolina Mendes",
    status: "Aplicada",
  },
  {
    nome: "Giárdia Canina",
    dose: "Anual",
    dataAplicacao: "14/07/2025",
    proximaDose: "14/07/2026",
    veterinario: "Dr. Felipe Castro",
    status: "Pendente",
  },
  {
    nome: "Leptospirose",
    dose: "Anual",
    dataAplicacao: "15/06/2025",
    proximaDose: "15/06/2026",
    veterinario: "Dra. Carolina Mendes",
    status: "Atrasada",
  },
];

function getStatusStyle(status: Vaccine["status"]) {
  switch (status) {
    case "Aplicada":
      return "bg-teal-100 text-emerald-500";

    case "Pendente":
      return "bg-amber-100 text-amber-500";

    case "Atrasada":
      return "bg-red-100 text-red-500";
  }
}

function getNextDoseStyle(status: Vaccine["status"]) {
  switch (status) {
    case "Pendente":
      return "text-amber-500";

    case "Atrasada":
      return "text-red-500";

    default:
      return "text-slate-500";
  }
}

export default function VaccinesTable() {
  return (
    <div className="box-border flex h-81 w-full flex-col items-start overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-white to-slate-50 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(13,148,135,0.08)]">
      <div className="box-border flex h-12.25 w-full shrink-0 items-start border-b border-slate-200 bg-slate-50 p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
        <span className="w-45 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Vacina
        </span>

        <span className="w-25 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Dose
        </span>

        <span className="w-40 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Data de Aplicação
        </span>

        <span className="w-40 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Próxima Dose
        </span>

        <span className="w-55 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Veterinário Responsável
        </span>

        <span className="flex-1 text-right font-['Inter'] text-sm font-semibold leading-4.25 text-slate-500">
          Status
        </span>
      </div>

      {vacinas.map((vacina) => (
        <div
          key={vacina.nome}
          className="box-border flex h-13.75 w-full shrink-0 items-center border-b border-slate-200 px-4"
        >
          <span className="w-45 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 text-slate-800">
            {vacina.nome}
          </span>

          <span className="w-25 shrink-0 font-['Inter'] text-sm font-normal leading-4.25 text-slate-500">
            {vacina.dose}
          </span>

          <span className="w-40 shrink-0 font-['Inter'] text-sm font-normal leading-4.25 text-slate-500">
            {vacina.dataAplicacao}
          </span>

          <span
            className={`w-40 shrink-0 font-['Inter'] text-sm font-semibold leading-4.25 ${getNextDoseStyle(
              vacina.status,
            )}`}
          >
            {vacina.proximaDose}
          </span>

          <span className="w-55 shrink-0 font-['Inter'] text-sm font-normal leading-4.25 text-slate-500">
            {vacina.veterinario}
          </span>

          <div className="flex w-66 flex-1 justify-end">
            <span
              className={`flex h-5.75 items-center rounded-full px-2.5 py-1 font-['Inter'] text-xs font-semibold leading-3.75 ${getStatusStyle(
                vacina.status,
              )}`}
            >
              {vacina.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
