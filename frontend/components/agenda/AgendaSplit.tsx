import { ChevronLeft, ChevronRight } from "lucide-react";

type Appointment = {
  pet: string;
  type: string;
  day: number;
  time: string;
  color: "green" | "orange" | "red";
};

const appointments: Appointment[] = [
  { pet: "Bidu", type: "Rotina", day: 1, time: "08:00", color: "green" },
  { pet: "Garfield", type: "Retorno", day: 3, time: "10:00", color: "orange" },
  { pet: "Pipoca", type: "Rotina", day: 1, time: "14:00", color: "green" },
  { pet: "Mel", type: "Retorno", day: 1, time: "14:45", color: "orange" },
  { pet: "Thor", type: "Emergência", day: 1, time: "15:30", color: "red" },
  { pet: "Luna", type: "Rotina", day: 1, time: "16:15", color: "green" },
];

const days = [
  { label: "Seg (24)", value: 1 },
  { label: "Ter (25)", value: 2 },
  { label: "Qua (26)", value: 3 },
  { label: "Qui (27)", value: 4 },
  { label: "Sex (28)", value: 5 },
];

const times = ["08:00", "10:00", "14:00", "14:45", "15:30", "16:15"];

function getAppointment(day: number, time: string) {
  return appointments.find(
    (appointment) => appointment.day === day && appointment.time === time,
  );
}

function getAppointmentStyle(color: Appointment["color"]) {
  switch (color) {
    case "green":
      return "bg-emerald-500/10 text-emerald-500";

    case "orange":
      return "bg-[#FFF2E0] text-warning-amber";

    case "red":
      return "bg-[#FFF2E6] text-error-red";

    default:
      return "";
  }
}

export default function AgendaSplit() {
  return (
    <div className="flex w-full items-start gap-6">
      <section className="flex min-w-0 flex-1 flex-col gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-[#F0FDFA] p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(13,148,135,0.08)]">
        <div className="flex h-11.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-light-gray transition hover:text-dark-gray"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>

            <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
              Agosto 2026, 24 - 28
            </h2>

            <button
              type="button"
              className="text-light-gray transition hover:text-dark-gray"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex h-9 items-center gap-2 rounded-full border border-border bg-page p-1">
            <button
              type="button"
              className="h-7 rounded-full bg-[#F0FDFA] px-3 font-inter text-[13px] font-bold leading-4 text-orange"
            >
              Semana
            </button>

            <button
              type="button"
              className="h-7 rounded-full px-3 font-inter text-[13px] font-semibold leading-4 text-light-gray transition hover:text-dark-gray"
            >
              Dia
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm bg-border">
          <div className="grid grid-cols-[60px_repeat(5,minmax(0,1fr))] gap-px bg-border">
            <div className="flex h-4 items-center justify-center bg-white">
              <span className="font-inter text-[11px] font-semibold text-light-gray">
                Hora
              </span>
            </div>

            {days.map((day) => (
              <div
                key={day.value}
                className="flex h-4 items-center justify-center bg-white"
              >
                <span className="font-inter text-[13px] font-semibold text-dark-gray">
                  {day.label}
                </span>
              </div>
            ))}

            {times.map((time) => (
              <div key={time} className="contents">
                <div className="flex h-18 items-center justify-center bg-white">
                  <span className="font-inter text-xs font-medium text-light-gray">
                    {time}
                  </span>
                </div>

                {days.map((day) => {
                  const appointment = getAppointment(day.value, time);

                  return (
                    <div
                      key={`${time}-${day.value}`}
                      className="h-18 bg-white p-1"
                    >
                      {appointment && (
                        <div
                          className={`flex h-full w-full flex-col items-start gap-0.5 rounded-[10px] p-2 ${getAppointmentStyle(
                            appointment.color,
                          )}`}
                        >
                          <span className="font-inter text-xs font-bold leading-3.75">
                            {appointment.pet}
                          </span>

                          <span className="font-inter text-[10px] font-normal leading-3">
                            {appointment.type}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="flex h-100 w-95 shrink-0 flex-col gap-5 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(13,148,135,0.08)]">
        <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
          Detalhes do Agendamento
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Paciente
            </span>

            <span className="font-inter text-[15px] font-semibold leading-4.5 text-dark-gray">
              Pipoca (Cão)
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Tutor
            </span>

            <span className="font-inter text-[15px] font-normal leading-4.5 text-dark-gray">
              Carlos Silva
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Veterinário
            </span>

            <span className="font-inter text-[15px] font-normal leading-4.5 text-dark-gray">
              Dr. Felipe Castro
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Tipo de Atendimento
            </span>

            <span className="w-fit rounded-full bg-emerald-500/10 px-2.5 py-1 font-inter text-xs font-semibold leading-3.75 text-emerald-500">
              Consulta de Rotina
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Data & Horário
            </span>

            <span className="font-inter text-[15px] font-semibold leading-4.5 text-teal">
              Segunda, 24/08/2026 às 14:00
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
              Observações
            </span>

            <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
              Exame geral e vacinação pendente/atrasada. Traga a carteira de
              vacinação.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
