"use client";

import Link from "next/link";
import {
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import {
  listarAgendamentos,
  type AgendamentoResponse,
} from "@/services/agendamentos";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";

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

function mondayOf(date: Date) {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
}

function formatDateLong(iso: string) {
  const date = parseISO(iso);

  return `${weekdayNames[date.getDay()]}, ${formatDate(date)}`;
}

function abreviarNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);

  if (partes.length <= 2) return nome;

  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  const meio = partes.slice(1, -1).map((parte) => `${parte[0]}.`);
  const abreviado = [primeiro, ...meio, ultimo].join(" ");

  return abreviado.length > 24 ? `${abreviado.slice(0, 23)}…` : abreviado;
}

function calcularIdade(dataNascimento: string | null): string {
  if (!dataNascimento) return "—";

  const nascimento = new Date(dataNascimento);
  const agora = new Date();

  let idade = agora.getFullYear() - nascimento.getFullYear();
  const mes = agora.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && agora.getDate() < nascimento.getDate())) {
    idade -= 1;
  }

  return `${idade} anos`;
}

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

const valueClassName =
  "font-inter text-[15px] font-semibold leading-4.5 text-dark-gray";

function gerarHorarios(): string[] {
  const horarios: string[] = [];

  for (let hora = 8; hora <= 19; hora += 1) {
    const hh = String(hora).padStart(2, "0");
    horarios.push(`${hh}:00`);

    if (hora < 19) {
      horarios.push(`${hh}:30`);
    }
  }

  return horarios;
}

export default function AgendaSplit() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [anchorDate, setAnchorDate] = useState(() => mondayOf(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => mondayOf(new Date()));
  const [filtroData, setFiltroData] = useState<string | null>(null);
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<AgendamentoResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAgendamentos(controller.signal),
      listarTutores(controller.signal),
    ])
      .then(([agendamentosData, tutoresData]) => {
        if (!active) return;
        setAgendamentos(agendamentosData);
        setTutores(tutoresData);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os agendamentos.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const weekDates = Array.from({ length: 7 }, (_, index) =>
    addDays(anchorDate, index),
  );

  const times = Array.from(
    new Set([
      ...gerarHorarios(),
      ...agendamentos.map((agendamento) => agendamento.horario),
    ]),
  ).sort();

  const selectedDateLabel = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}, ${selectedDate.getDate()}`;

  function getAppointment(date: string, time: string) {
    return agendamentos.find(
      (agendamento) =>
        agendamento.data === date && agendamento.horario === time,
    );
  }

  function tutorNome(tutorId: number): string {
    return (
      tutores.find((tutor) => tutor.id === tutorId)?.nome ??
      "Tutor não informado"
    );
  }

  function changeWeek(amount: number) {
    setAnchorDate((atual) => addDays(atual, amount));
    setSelectedDate((atual) => addDays(atual, amount));
  }

  function handleFiltroData(value: string) {
    if (!value) {
      setFiltroData(null);
      return;
    }

    const date = parseISO(value);

    setFiltroData(value);
    setAnchorDate(mondayOf(date));
    setSelectedDate(date);
  }

  function abrirModal(agendamento: AgendamentoResponse) {
    setSelectedDate(parseISO(agendamento.data));
    setSelectedAgendamento(agendamento);
  }

  const agendamentoSelecionado = selectedAgendamento;

  const consultasDoDia = filtroData
    ? agendamentos.filter((agendamento) => agendamento.data === filtroData)
    : [];

  function celulaAgendamento(appointment: AgendamentoResponse | undefined) {
    if (!appointment) return null;

    return (
      <button
        type="button"
        onClick={() => abrirModal(appointment)}
        className="flex h-full w-full cursor-pointer flex-col items-start justify-center gap-0.5 rounded-[10px] bg-emerald-500/10 px-2.5 py-1.5 text-left transition hover:brightness-[0.98]"
      >
        <span className="w-full truncate font-inter text-xs font-bold leading-3.75 text-emerald-600">
          {appointment.animal.nome}
        </span>

        <span className="w-full truncate font-inter text-[10px] font-normal leading-3 text-emerald-600/80">
          {abreviarNome(tutorNome(appointment.animal.tutor_id))}
        </span>
      </button>
    );
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

          <div className="flex items-center gap-3">
            <div className="flex h-9 items-center gap-2 rounded-full border border-border bg-white px-3 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]">
              <Search size={16} strokeWidth={2} className="shrink-0 text-slate" />

              <input
                type="date"
                value={filtroData ?? ""}
                onChange={(event) => handleFiltroData(event.target.value)}
                aria-label="Pesquisar por data"
                className="w-34 bg-transparent font-inter text-[13px] leading-4 text-dark-gray outline-none"
              />

              {filtroData && (
                <button
                  type="button"
                  onClick={() => handleFiltroData("")}
                  aria-label="Limpar filtro de data"
                  className="cursor-pointer rounded-full p-0.5 text-light-gray transition hover:text-dark-gray"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>

            <Link
              href="/agendamento/novo"
              className="flex h-9 items-center gap-2 rounded-full bg-linear-to-r from-[#0D9487] to-[#1A806B] px-4 font-inter text-[13px] font-semibold leading-4 text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90"
            >
              <Plus size={16} strokeWidth={2} />
              Novo Agendamento
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex h-80 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Carregando agendamentos...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-80 items-center justify-center">
            <span className="font-inter text-[13px] text-error-red">
              {error}
            </span>
          </div>
        )}

        {!loading && !error && agendamentos.length === 0 && (
          <div className="flex h-80 flex-col items-center justify-center gap-2">
            <CalendarX size={32} strokeWidth={1.5} className="text-light-gray" />

            <span className="font-inter text-[15px] font-semibold leading-4.5 text-dark-gray">
              Nenhum agendamento
            </span>

            <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
              Crie o primeiro agendamento para começar a organizar a agenda.
            </p>
          </div>
        )}

        {!loading && !error && agendamentos.length > 0 && filtroData && (
          <div className="overflow-auto rounded-xl border border-border bg-border max-h-[calc(100vh-16rem)]">
            <div className="grid min-w-[480px] grid-cols-[80px_minmax(340px,1fr)] gap-px bg-border">
              <div className="sticky left-0 top-0 z-30 flex h-12 items-center justify-center bg-white px-2">
                <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-light-gray">
                  Hora
                </span>
              </div>

              <div className="sticky top-0 z-20 flex h-12 flex-col items-center justify-center gap-0.5 bg-[#F0FDFA] px-2">
                <span className="font-inter text-[13px] font-bold leading-4 text-teal">
                  {weekdayNames[parseISO(filtroData).getDay()]}{" "}
                  {formatDate(parseISO(filtroData))}
                </span>

                <span className="font-inter text-[10px] font-medium leading-3 text-light-gray">
                  {monthNames[parseISO(filtroData).getMonth()]}
                </span>
              </div>

              {consultasDoDia.length === 0 && (
                <div className="col-span-2 flex h-40 items-center justify-center bg-white">
                  <span className="font-inter text-[13px] text-light-gray">
                    Nenhum agendamento nesta data.
                  </span>
                </div>
              )}

              {consultasDoDia.length > 0 &&
                times.map((time) => (
                  <Fragment key={time}>
                    <div className="sticky left-0 z-10 flex h-16 items-center justify-center bg-white px-2">
                      <span className="font-inter text-xs font-medium text-light-gray">
                        {time}
                      </span>
                    </div>

                    <div className="h-16 bg-white p-1">
                      {celulaAgendamento(getAppointment(filtroData, time))}
                    </div>
                  </Fragment>
                ))}
            </div>
          </div>
        )}

        {!loading && !error && agendamentos.length > 0 && !filtroData && (
          <div className="overflow-auto rounded-xl border border-border bg-border max-h-[calc(100vh-16rem)]">
            <div className="grid min-w-[1280px] grid-cols-[80px_repeat(7,minmax(170px,1fr))] gap-px bg-border">
              <div className="sticky left-0 top-0 z-30 flex h-12 items-center justify-center bg-white px-2">
                <span className="font-inter text-[11px] font-semibold uppercase leading-3.25 text-light-gray">
                  Hora
                </span>
              </div>

              {weekDates.map((date) => {
                const isSelected = toISO(date) === toISO(selectedDate);

                return (
                  <button
                    key={toISO(date)}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    aria-pressed={isSelected}
                    className={`sticky top-0 z-20 flex h-12 cursor-pointer flex-col items-center justify-center gap-0.5 bg-white px-2 transition hover:bg-[#F0FDFA] ${
                      isSelected ? "bg-[#F0FDFA]" : ""
                    }`}
                  >
                    <span
                      className={`font-inter text-[13px] font-bold leading-4 ${
                        isSelected ? "text-teal" : "text-dark-gray"
                      }`}
                    >
                      {weekdayShort[date.getDay()]} {date.getDate()}
                    </span>

                    <span className="font-inter text-[10px] font-medium leading-3 text-light-gray">
                      {monthNames[date.getMonth()].slice(0, 3)}
                    </span>
                  </button>
                );
              })}

              {times.map((time) => (
                <Fragment key={time}>
                  <div className="sticky left-0 z-10 flex h-16 items-center justify-center bg-white px-2">
                    <span className="font-inter text-xs font-medium text-light-gray">
                      {time}
                    </span>
                  </div>

                  {weekDates.map((date) => {
                    const iso = toISO(date);
                    const appointment = getAppointment(iso, time);

                    return (
                      <div
                        key={`${time}-${iso}`}
                        className="h-16 bg-white p-1"
                      >
                        {celulaAgendamento(appointment)}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </section>

      {agendamentoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes do agendamento"
          onClick={() => setSelectedAgendamento(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
                  Detalhes do Agendamento
                </h2>

                <span className="font-inter text-[13px] font-semibold leading-4 text-teal">
                  {formatDateLong(agendamentoSelecionado.data)} às{" "}
                  {agendamentoSelecionado.horario}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAgendamento(null)}
                aria-label="Fechar"
                className="cursor-pointer rounded-full p-1.5 text-light-gray transition hover:bg-page hover:text-dark-gray"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Data</span>

              <span className={valueClassName}>
                {formatDateLong(agendamentoSelecionado.data)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Horário</span>

              <span className={valueClassName}>
                {agendamentoSelecionado.horario}
              </span>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border bg-page p-4">
              <span className="font-inter text-[11px] font-bold uppercase leading-3.25 text-slate">
                Dados do paciente
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Nome</span>

                  <span className="font-inter text-[13px] font-semibold text-dark-gray">
                    {agendamentoSelecionado.animal.nome}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Espécie</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {agendamentoSelecionado.animal.especie}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Raça</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {agendamentoSelecionado.animal.raca ?? "—"}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Sexo</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {agendamentoSelecionado.animal.sexo}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Castrado</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {agendamentoSelecionado.animal.castrado}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Idade</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {calcularIdade(agendamentoSelecionado.animal.data_nascimento)}
                  </span>
                </div>

                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className={labelClassName}>Cor / Pelagem</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {agendamentoSelecionado.animal.cor_pelagem}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Tutor</span>

              <span className="font-inter text-[13px] font-medium text-dark-gray">
                {abreviarNome(
                  tutorNome(agendamentoSelecionado.animal.tutor_id),
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Anotações</span>

              <p className="rounded-xl border border-border bg-white p-3 font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {agendamentoSelecionado.anotacoes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
