"use client";

import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type AppointmentColor = "green" | "orange" | "red";

type Appointment = {
  pet: string;
  type: string;
  date: string;
  time: string;
  color: AppointmentColor;
  tutor: string;
  vet: string;
  observations: string;
};

const appointments: Appointment[] = [
  {
    pet: "Bidu",
    type: "Rotina",
    date: "2026-08-24",
    time: "08:00",
    color: "green",
    tutor: "Ana Souza",
    vet: "Dra. Marina Alves",
    observations: "Vacinação anual e pesagem.",
  },
  {
    pet: "Garfield",
    type: "Retorno",
    date: "2026-08-26",
    time: "10:00",
    color: "orange",
    tutor: "Roberto Lima",
    vet: "Dr. Felipe Castro",
    observations: "Reavaliação do tratamento dermatológico.",
  },
  {
    pet: "Pipoca",
    type: "Rotina",
    date: "2026-08-24",
    time: "14:00",
    color: "green",
    tutor: "Carlos Silva",
    vet: "Dr. Felipe Castro",
    observations:
      "Exame geral e vacinação pendente/atrasada. Traga a carteira de vacinação.",
  },
  {
    pet: "Mel",
    type: "Retorno",
    date: "2026-08-24",
    time: "14:45",
    color: "orange",
    tutor: "Juliana Prado",
    vet: "Dra. Marina Alves",
    observations: "Retorno pós-cirúrgico para retirada de pontos.",
  },
  {
    pet: "Thor",
    type: "Emergência",
    date: "2026-08-24",
    time: "15:30",
    color: "red",
    tutor: "Marcos Ribeiro",
    vet: "Dr. Felipe Castro",
    observations: "Quadro de intoxicação alimentar. Acompanhar sinais vitais.",
  },
  {
    pet: "Luna",
    type: "Rotina",
    date: "2026-08-24",
    time: "16:15",
    color: "green",
    tutor: "Beatriz Nunes",
    vet: "Dra. Marina Alves",
    observations: "Consulta de rotina e vermifugação.",
  },
];

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weekdayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const weekdayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const times = ["08:00", "10:00", "14:00", "14:45", "15:30", "16:15"];

const typeLabels: Record<string, string> = {
  Rotina: "Consulta de Rotina",
  Retorno: "Retorno",
  Emergência: "Emergência",
};

function toISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseISO(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);

  return next;
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
}

function getAppointment(date: string, time: string) {
  return appointments.find(
    (appointment) =>
      appointment.date === date && appointment.time === time,
  );
}

function getAppointmentKey(appointment: Appointment) {
  return `${appointment.date}|${appointment.time}`;
}

function getAppointmentStyle(color: AppointmentColor) {
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
  const [anchorDate, setAnchorDate] = useState(() => new Date(2026, 7, 24));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 7, 24));
  const [selectedKey, setSelectedKey] = useState<string | null>(
    "2026-08-24|08:00",
  );

  const weekDates = Array.from({ length: 5 }, (_, index) =>
    addDays(anchorDate, index),
  );

  const selectedAppointment =
    appointments.find(
      (appointment) => getAppointmentKey(appointment) === selectedKey,
    ) ?? null;

  const selectedDateLabel = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}, ${selectedDate.getDate()}`;

  function changeWeek(amount: number) {
    const nextAnchor = addDays(anchorDate, amount);
    const nextSelected = addDays(selectedDate, amount);

    setAnchorDate(nextAnchor);
    setSelectedDate(nextSelected);

    const firstAppointment = appointments.find(
      (appointment) => appointment.date === toISO(nextSelected),
    );

    setSelectedKey(
      firstAppointment ? getAppointmentKey(firstAppointment) : null,
    );
  }

  function handleSelectDay(date: Date) {
    setSelectedDate(date);

    const firstAppointment = appointments.find(
      (appointment) => appointment.date === toISO(date),
    );

    setSelectedKey(
      firstAppointment ? getAppointmentKey(firstAppointment) : null,
    );
  }

  function handleSelectAppointment(appointment: Appointment) {
    setSelectedDate(parseISO(appointment.date));
    setSelectedKey(getAppointmentKey(appointment));
  }

  return (
    <div className="flex w-full items-start gap-6">
      <section className="flex min-w-0 flex-1 flex-col gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-[#F0FDFA] p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(13,148,135,0.08)]">
        <div className="flex h-11.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeWeek(-7)}
              aria-label="Semana anterior"
              className="cursor-pointer text-light-gray transition hover:text-dark-gray"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>

            <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
              {selectedDateLabel}
            </h2>

            <button
              type="button"
              onClick={() => changeWeek(7)}
              aria-label="Próxima semana"
              className="cursor-pointer text-light-gray transition hover:text-dark-gray"
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

            {weekDates.map((date) => {
              const isSelected = toISO(date) === toISO(selectedDate);

              return (
                <button
                  key={toISO(date)}
                  type="button"
                  onClick={() => handleSelectDay(date)}
                  aria-pressed={isSelected}
                  className={`flex h-4 cursor-pointer items-center justify-center transition ${
                    isSelected ? "bg-[#F0FDFA]" : "bg-white"
                  }`}
                >
                  <span
                    className={`font-inter text-[13px] font-semibold ${
                      isSelected ? "text-teal" : "text-dark-gray"
                    }`}
                  >
                    {weekdayShort[date.getDay()]} ({date.getDate()})
                  </span>
                </button>
              );
            })}

            {times.map((time) => (
              <div key={time} className="contents">
                <div className="flex h-18 items-center justify-center bg-white">
                  <span className="font-inter text-xs font-medium text-light-gray">
                    {time}
                  </span>
                </div>

                {weekDates.map((date) => {
                  const iso = toISO(date);
                  const appointment = getAppointment(iso, time);
                  const isSelected =
                    appointment !== undefined &&
                    selectedKey === getAppointmentKey(appointment);

                  return (
                    <div key={`${time}-${iso}`} className="h-18 bg-white p-1">
                      {appointment && (
                        <button
                          type="button"
                          onClick={() => handleSelectAppointment(appointment)}
                          aria-pressed={isSelected}
                          className={`flex h-full w-full cursor-pointer flex-col items-start gap-0.5 rounded-[10px] p-2 text-left transition ${getAppointmentStyle(
                            appointment.color,
                          )} ${
                            isSelected
                              ? "ring-2 ring-teal"
                              : "hover:brightness-[0.98]"
                          }`}
                        >
                          <span className="font-inter text-xs font-bold leading-3.75">
                            {appointment.pet}
                          </span>

                          <span className="font-inter text-[10px] font-normal leading-3">
                            {appointment.type}
                          </span>
                        </button>
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
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Detalhes do Agendamento
          </h2>

          <span className="font-inter text-[13px] font-semibold leading-4 text-teal">
            {weekdayNames[selectedDate.getDay()]}, {formatDate(selectedDate)}
          </span>
        </div>

        {selectedAppointment ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Paciente
              </span>

              <span className="font-inter text-[15px] font-semibold leading-4.5 text-dark-gray">
                {selectedAppointment.pet}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Tutor
              </span>

              <span className="font-inter text-[15px] font-normal leading-4.5 text-dark-gray">
                {selectedAppointment.tutor}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Veterinário
              </span>

              <span className="font-inter text-[15px] font-normal leading-4.5 text-dark-gray">
                {selectedAppointment.vet}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Tipo de Atendimento
              </span>

              <span
                className={`w-fit rounded-full px-2.5 py-1 font-inter text-xs font-semibold leading-3.75 ${getAppointmentStyle(
                  selectedAppointment.color,
                )}`}
              >
                {typeLabels[selectedAppointment.type] ??
                  selectedAppointment.type}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Data & Horário
              </span>

              <span className="font-inter text-[15px] font-semibold leading-4.5 text-teal">
                {weekdayNames[selectedDate.getDay()]},{" "}
                {formatDate(selectedDate)} às {selectedAppointment.time}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate">
                Observações
              </span>

              <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
                {selectedAppointment.observations}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2 text-center">
            <CalendarX size={32} strokeWidth={1.5} className="text-light-gray" />

            <span className="font-inter text-[15px] font-semibold leading-4.5 text-dark-gray">
              Nenhum compromisso agendado
            </span>

            <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
              Não há agendamentos para {weekdayNames[selectedDate.getDay()]},{" "}
              {formatDate(selectedDate)}.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
