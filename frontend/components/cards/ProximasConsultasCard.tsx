import { AlertTriangle, Dog } from "lucide-react";

type Consulta = {
  pet: string;
  detalhe: string;
  tutor: string;
  hora: string;
  tipo: string;
  color: "teal" | "orange" | "red";
};

const consultas: Consulta[] = [
  // {
  //   pet: "Pipoca",
  //   detalhe: "Cão (Golden)",
  //   tutor: "Carlos Silva",
  //   hora: "14:00",
  //   tipo: "Rotina",
  //   color: "teal",
  // },
  // {
  //   pet: "Mel",
  //   detalhe: "Gato (Siamês)",
  //   tutor: "Mariana Costa",
  //   hora: "14:45",
  //   tipo: "Retorno",
  //   color: "orange",
  // },
  // {
  //   pet: "Thor",
  //   detalhe: "Cão (Pug)",
  //   tutor: "Felipe Oliveira",
  //   hora: "15:30",
  //   tipo: "Emergência",
  //   color: "red",
  // },
  // {
  //   pet: "Luna",
  //   detalhe: "Cão (Vira-lata)",
  //   tutor: "Ana Santos",
  //   hora: "16:15",
  //   tipo: "Rotina",
  //   color: "teal",
  // },
];

const styles = {
  teal: {
    bar: "bg-teal",
    avatar: "bg-[#F0FDFA]",
    icon: "text-teal",
    time: "text-teal",
    badge: "bg-[#F0FDFA] text-teal",
  },
  orange: {
    bar: "bg-warning-amber",
    avatar: "bg-[#FFEDD5]",
    icon: "text-warning-amber",
    time: "text-warning-amber",
    badge: "bg-[#FFF2E0] text-orange",
  },
  red: {
    bar: "bg-error-red",
    avatar: "bg-[#FEE2E2]",
    icon: "text-orange",
    time: "text-error-red",
    badge: "bg-[#FFF2E6] text-orange",
  },
} as const;

export default function ProximasConsultasCard() {
  return (
    <section className="box-border flex h-104.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
          Próximas Consultas de Hoje
        </h2>

        <span className="flex items-center rounded-full border border-border bg-page px-3 py-2 font-inter text-caption font-semibold leading-3.75 text-orange">
          Hoje
        </span>
      </div>

      <ul className="flex w-full flex-1 flex-col gap-3">
        {consultas.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhuma consulta disponível.
            </span>
          </li>
        )}

        {consultas.map((consulta) => {
          const style = styles[consulta.color];

          return (
            <li
              key={consulta.pet}
              className="box-border flex h-18 w-full items-center gap-3 rounded-[14px] border border-border bg-white p-3.5 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]"
            >
              <span className={`h-11 w-1 shrink-0 rounded-xs ${style.bar}`} />

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.avatar}`}
                >
                  {consulta.color === "red" ? (
                    <AlertTriangle
                      size={20}
                      strokeWidth={2}
                      className={style.icon}
                    />
                  ) : (
                    <Dog size={20} strokeWidth={2} className={style.icon} />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-inter text-sm font-bold leading-4.25 text-dark-gray">
                    {consulta.pet} ({consulta.detalhe})
                  </span>

                  <span className="truncate font-inter text-caption leading-3.75 text-light-gray">
                    Tutor: {consulta.tutor}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={`font-inter text-sm font-bold leading-4.25 ${style.time}`}
                >
                  {consulta.hora}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1.5 font-inter text-caption font-bold leading-3.75 ${style.badge}`}
                >
                  {consulta.tipo}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
