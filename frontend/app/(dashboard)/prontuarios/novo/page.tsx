"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import { criarProntuario } from "@/services/prontuarios";

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const textareaClassName =
  "w-full resize-none rounded-xl border border-border bg-white px-4 py-3 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

export default function NovoProntuario() {
  const router = useRouter();

  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [pacientesError, setPacientesError] = useState<string | null>(null);

  const [animalId, setAnimalId] = useState("");
  const [veterinario, setVeterinario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [anamnese, setAnamnese] = useState("");
  const [exameFisico, setExameFisico] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamento, setTratamento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    listarAnimais(controller.signal)
      .then((data) => {
        if (!active) return;
        setAnimais(data);
        setPacientesError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setPacientesError("Não foi possível carregar os pacientes.");
      })
      .finally(() => {
        if (active) setLoadingPacientes(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError(null);

    try {
      await criarProntuario({
        animal_id: Number(animalId),
        veterinario,
        motivo,
        anamnese,
        exame_fisico: exameFisico,
        diagnostico,
        tratamento,
        observacoes: observacoes || null,
      });

      router.push("/prontuarios");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o prontuário.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center pt-8">
      <section className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-linear-to-r from-white to-page p-8 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Novo Prontuário
          </h2>

          <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
            Registre o atendimento clínico do paciente. A data e o horário do
            cadastro serão salvos automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="animal" className={labelClassName}>
              Paciente
            </label>

            {loadingPacientes ? (
              <span className="font-inter text-[13px] text-light-gray">
                Carregando pacientes...
              </span>
            ) : pacientesError ? (
              <span className="font-inter text-[13px] font-medium text-error-red">
                {pacientesError}
              </span>
            ) : animais.length === 0 ? (
              <span className="font-inter text-[13px] text-light-gray">
                Nenhum paciente cadastrado.
              </span>
            ) : (
              <select
                id="animal"
                required
                value={animalId}
                onChange={(event) => setAnimalId(event.target.value)}
                className={`${inputClassName} cursor-pointer`}
              >
                <option value="" disabled>
                  Selecione o paciente
                </option>

                {animais.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nome} — {animal.especie} ({animal.raca ?? "sem raça"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="veterinario" className={labelClassName}>
              Veterinário Responsável
            </label>

            <input
              id="veterinario"
              type="text"
              required
              value={veterinario}
              onChange={(event) => setVeterinario(event.target.value)}
              placeholder="Ex.: Dra. Marina Alves"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="motivo" className={labelClassName}>
              Motivo da Consulta
            </label>

            <textarea
              id="motivo"
              required
              rows={2}
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Ex.: Coceira intensa e falhas na pelagem."
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="anamnese" className={labelClassName}>
              Anamnese
            </label>

            <textarea
              id="anamnese"
              required
              rows={2}
              value={anamnese}
              onChange={(event) => setAnamnese(event.target.value)}
              placeholder="Ex.: Paciente com prurido há 2 semanas, sem mudança de alimentação."
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="exameFisico" className={labelClassName}>
              Exame Físico
            </label>

            <textarea
              id="exameFisico"
              required
              rows={2}
              value={exameFisico}
              onChange={(event) => setExameFisico(event.target.value)}
              placeholder="Ex.: Alopecia focal em região dorsal, pele sem feridas."
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="diagnostico" className={labelClassName}>
              Diagnóstico
            </label>

            <textarea
              id="diagnostico"
              required
              rows={2}
              value={diagnostico}
              onChange={(event) => setDiagnostico(event.target.value)}
              placeholder="Ex.: Dermatite alérgica."
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tratamento" className={labelClassName}>
              Tratamento
            </label>

            <textarea
              id="tratamento"
              required
              rows={2}
              value={tratamento}
              onChange={(event) => setTratamento(event.target.value)}
              placeholder="Ex.: Banho terapêutico semanal e pomada tópica por 15 dias."
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="observacoes" className={labelClassName}>
              Observações
            </label>

            <textarea
              id="observacoes"
              rows={2}
              value={observacoes}
              onChange={(event) => setObservacoes(event.target.value)}
              placeholder="Ex.: Retorno em 30 dias para reavaliação."
              className={textareaClassName}
            />
          </div>

          {submitError && (
            <span className="font-inter text-[13px] font-medium text-error-red">
              {submitError}
            </span>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/prontuarios"
              className="flex h-10 items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Salvando..." : "Salvar Prontuário"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
