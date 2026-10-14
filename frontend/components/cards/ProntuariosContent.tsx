"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

import PacienteInfoCard from "@/components/cards/PacienteInfoCard";
import {
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";
import {
  listarProntuarios,
  type ProntuarioResponse,
} from "@/services/prontuarios";

interface ProntuariosContentProps {
  query: string;
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

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";

  const [year, month, day] = iso.split("-");

  return `${day}/${month}/${year}`;
}

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

export default function ProntuariosContent({ query }: ProntuariosContentProps) {
  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [prontuarios, setProntuarios] = useState<ProntuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prontuarioSelecionado, setProntuarioSelecionado] =
    useState<ProntuarioResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAnimais(controller.signal),
      listarTutores(controller.signal),
      listarProntuarios(undefined, controller.signal),
    ])
      .then(([animaisData, tutoresData, prontuariosData]) => {
        if (!active) return;
        setAnimais(animaisData);
        setTutores(tutoresData);
        setProntuarios(prontuariosData);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os prontuários.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const normalized = query.trim().toLowerCase();

  const pacienteEncontrado = normalized
    ? (animais.find((animal) =>
        animal.nome.toLowerCase().includes(normalized),
      ) ?? null)
    : null;

  const tutorEncontrado = pacienteEncontrado
    ? tutores.find((tutor) => tutor.id === pacienteEncontrado.tutor_id)
    : undefined;

  const prontuariosDoPaciente = pacienteEncontrado
    ? prontuarios.filter(
        (prontuario) => prontuario.animal_id === pacienteEncontrado.id,
      )
    : [];

  const ultimoProntuario = prontuariosDoPaciente[0];

  return (
    <div className="pt-8">
      {loading ? (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-light-gray">
            Carregando...
          </span>
        </div>
      ) : error ? (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-error-red">{error}</span>
        </div>
      ) : pacienteEncontrado ? (
        <div className="flex flex-col gap-4">
          <PacienteInfoCard
            nome={pacienteEncontrado.nome}
            status={
              ultimoProntuario
                ? `Atendido em ${formatarData(ultimoProntuario.data)}`
                : "Sem prontuários"
            }
            statusVariant={ultimoProntuario ? "green" : "blue"}
            especie={pacienteEncontrado.especie}
            raca={pacienteEncontrado.raca ?? "—"}
            sexo={pacienteEncontrado.sexo}
            idade={calcularIdade(pacienteEncontrado.data_nascimento)}
            tutor={tutorEncontrado?.nome ?? "—"}
            telefone={tutorEncontrado?.telefone ?? "—"}
          />

          <div className="flex flex-col gap-3">
            <h3 className="font-outfit text-[16px] font-bold leading-5 text-dark-navy">
              Histórico de Prontuários
            </h3>

            {prontuariosDoPaciente.length === 0 ? (
              <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
                <span className="font-inter text-[13px] text-light-gray">
                  Nenhum prontuário registrado para este paciente.
                </span>
              </div>
            ) : (
              <ul className="flex w-full flex-col gap-3">
                {prontuariosDoPaciente.map((prontuario) => (
                  <li key={prontuario.id}>
                    <button
                      type="button"
                      onClick={() => setProntuarioSelecionado(prontuario)}
                      className="box-border flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-border bg-white p-3.5 text-left shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] transition hover:border-teal/40"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0FDFA]">
                        <FileText
                          size={20}
                          strokeWidth={2}
                          className="text-teal"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate font-inter text-sm font-semibold leading-4.25 text-dark-gray">
                          {prontuario.motivo || "Atendimento clínico"}
                        </span>

                        <span className="truncate font-inter text-caption leading-3.75 text-light-gray">
                          {prontuario.veterinario} •{" "}
                          {formatarData(prontuario.data)} às{" "}
                          {prontuario.horario}
                        </span>
                      </div>

                      <span className="shrink-0 font-inter text-[13px] font-semibold leading-4 text-teal">
                        Ver
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <span className="font-inter text-[13px] text-light-gray">
            {normalized
              ? "Nenhum paciente encontrado com esse nome."
              : "Pesquise um paciente no campo de busca do topo."}
          </span>
        </div>
      )}

      {prontuarioSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes do prontuário"
          onClick={() => setProntuarioSelecionado(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
                  Prontuário do Atendimento
                </h2>

                <span className="font-inter text-[13px] font-semibold leading-4 text-teal">
                  {formatarData(prontuarioSelecionado.data)} às{" "}
                  {prontuarioSelecionado.horario} •{" "}
                  {prontuarioSelecionado.veterinario}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setProntuarioSelecionado(null)}
                aria-label="Fechar"
                className="cursor-pointer rounded-full p-1.5 text-light-gray transition hover:bg-page hover:text-dark-gray"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Motivo da Consulta</span>

              <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {prontuarioSelecionado.motivo || "—"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Anamnese</span>

              <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {prontuarioSelecionado.anamnese || "—"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Exame Físico</span>

              <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {prontuarioSelecionado.exame_fisico || "—"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Diagnóstico</span>

              <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {prontuarioSelecionado.diagnostico || "—"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className={labelClassName}>Tratamento</span>

              <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {prontuarioSelecionado.tratamento || "—"}
              </p>
            </div>

            {prontuarioSelecionado.observacoes && (
              <div className="flex flex-col gap-1">
                <span className={labelClassName}>Observações</span>

                <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                  {prontuarioSelecionado.observacoes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
