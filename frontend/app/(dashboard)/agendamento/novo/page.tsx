"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  criarAnimal,
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  criarAgendamento,
} from "@/services/agendamentos";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";

function abreviarNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);

  if (partes.length <= 2) return nome;

  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  const meio = partes.slice(1, -1).map((parte) => `${parte[0]}.`);
  const abreviado = [primeiro, ...meio, ultimo].join(" ");

  return abreviado.length > 24 ? `${abreviado.slice(0, 23)}…` : abreviado;
}

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

const especieOptions = ["Cão", "Gato", "Ave", "Roedor", "Réptil", "Outro"];
const sexoOptions = ["Macho", "Fêmea"];
const castradoOptions = ["Sim", "Não"];

export default function NovoAgendamento() {
  const router = useRouter();

  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [pacientesError, setPacientesError] = useState<string | null>(null);

  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [animalId, setAnimalId] = useState("");
  const [anotacoes, setAnotacoes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [pacienteOpen, setPacienteOpen] = useState(false);
  const [pacienteTutorId, setPacienteTutorId] = useState("");
  const [pacienteNome, setPacienteNome] = useState("");
  const [pacienteEspecie, setPacienteEspecie] = useState("");
  const [pacienteRaca, setPacienteRaca] = useState("");
  const [pacienteDataNascimento, setPacienteDataNascimento] = useState("");
  const [pacienteSexo, setPacienteSexo] = useState("");
  const [pacienteCastrado, setPacienteCastrado] = useState("");
  const [pacienteCorPelagem, setPacienteCorPelagem] = useState("");
  const [pacienteSubmitting, setPacienteSubmitting] = useState(false);
  const [pacienteError, setPacienteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      listarAnimais(controller.signal),
      listarTutores(controller.signal),
    ])
      .then(([animaisData, tutoresData]) => {
        if (!active) return;
        setAnimais(animaisData);
        setTutores(tutoresData);
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

  const animalSelecionado = animais.find(
    (animal) => String(animal.id) === animalId,
  );

  const tutorSelecionado = animalSelecionado
    ? tutores.find((tutor) => tutor.id === animalSelecionado.tutor_id)
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!animalSelecionado) {
      setSubmitError("Selecione o paciente do agendamento.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await criarAgendamento({
        data,
        horario,
        anotacoes,
        animal_id: animalSelecionado.id,
      });

      router.push("/agendamento");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o agendamento.",
      );
      setSubmitting(false);
    }
  }

  async function handleCriarPaciente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPacienteSubmitting(true);
    setPacienteError(null);

    try {
      const novoAnimal = await criarAnimal({
        nome: pacienteNome,
        especie: pacienteEspecie,
        raca: pacienteRaca,
        data_nascimento: pacienteDataNascimento,
        sexo: pacienteSexo,
        castrado: pacienteCastrado,
        cor_pelagem: pacienteCorPelagem,
        tutor_id: Number(pacienteTutorId),
      });

      setAnimais((atuais) => [...atuais, novoAnimal]);
      setAnimalId(String(novoAnimal.id));
      setPacienteOpen(false);
      resetarFormularioPaciente();
    } catch (error) {
      setPacienteError(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o paciente.",
      );
    } finally {
      setPacienteSubmitting(false);
    }
  }

  function resetarFormularioPaciente() {
    setPacienteTutorId("");
    setPacienteNome("");
    setPacienteEspecie("");
    setPacienteRaca("");
    setPacienteDataNascimento("");
    setPacienteSexo("");
    setPacienteCastrado("");
    setPacienteCorPelagem("");
    setPacienteError(null);
  }

  return (
    <div className="flex justify-center pt-8">
      <section className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-linear-to-r from-white to-page p-8 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Novo Agendamento
          </h2>

          <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
            Preencha os dados para agendar a consulta do paciente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="data" className={labelClassName}>
                Data
              </label>

              <input
                id="data"
                type="date"
                required
                value={data}
                onChange={(event) => setData(event.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="horario" className={labelClassName}>
                Horário
              </label>

              <input
                id="horario"
                type="time"
                required
                value={horario}
                onChange={(event) => setHorario(event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="animal" className={labelClassName}>
                Paciente
              </label>

              <button
                type="button"
                onClick={() => setPacienteOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-teal px-3 py-1 font-inter text-[11px] font-semibold text-teal transition hover:bg-[#F0FDFA]"
              >
                <UserPlus size={14} strokeWidth={2} />
                Adicionar paciente
              </button>
            </div>

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
                Nenhum paciente cadastrado. Cadastre um animal primeiro.
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
            <label htmlFor="tutor" className={labelClassName}>
              Tutor
            </label>

            <input
              id="tutor"
              type="text"
              readOnly
              value={
                tutorSelecionado ? abreviarNome(tutorSelecionado.nome) : ""
              }
              placeholder="Selecione o paciente para exibir o tutor"
              className={`${inputClassName} cursor-default bg-page text-light-gray`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="anotacoes" className={labelClassName}>
              Anotações para o veterinário
            </label>

            <textarea
              id="anotacoes"
              required
              rows={4}
              value={anotacoes}
              onChange={(event) => setAnotacoes(event.target.value)}
              placeholder="Ex.: Retorno pós-cirúrgico para retirada de pontos. Trazer carteira de vacinação."
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          {submitError && (
            <span className="font-inter text-[13px] font-medium text-error-red">
              {submitError}
            </span>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/agendamento"
              className="flex h-10 items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Salvando..." : "Agendar Consulta"}
            </button>
          </div>
        </form>
      </section>

      {pacienteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Adicionar paciente"
          onClick={() => setPacienteOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col gap-5 overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
                  Novo Paciente
                </h2>

                <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
                  Cadastre o paciente e ele será selecionado automaticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPacienteOpen(false)}
                aria-label="Fechar"
                className="cursor-pointer rounded-full p-1.5 text-light-gray transition hover:bg-page hover:text-dark-gray"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleCriarPaciente} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paciente-tutor" className={labelClassName}>
                  Tutor
                </label>

                {tutores.length === 0 ? (
                  <span className="font-inter text-[13px] text-light-gray">
                    Nenhum tutor cadastrado. Cadastre um tutor primeiro.
                  </span>
                ) : (
                  <select
                    id="paciente-tutor"
                    required
                    value={pacienteTutorId}
                    onChange={(event) => setPacienteTutorId(event.target.value)}
                    className={`${inputClassName} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecione o tutor
                    </option>

                    {tutores.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {abreviarNome(tutor.nome)} — {tutor.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="paciente-nome" className={labelClassName}>
                  Nome do Animal
                </label>

                <input
                  id="paciente-nome"
                  type="text"
                  required
                  value={pacienteNome}
                  onChange={(event) => setPacienteNome(event.target.value)}
                  placeholder="Ex.: Pipoca"
                  className={inputClassName}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="paciente-especie" className={labelClassName}>
                    Espécie
                  </label>

                  <select
                    id="paciente-especie"
                    required
                    value={pacienteEspecie}
                    onChange={(event) => setPacienteEspecie(event.target.value)}
                    className={`${inputClassName} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>

                    {especieOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="paciente-raca" className={labelClassName}>
                    Raça
                  </label>

                  <input
                    id="paciente-raca"
                    type="text"
                    required
                    value={pacienteRaca}
                    onChange={(event) => setPacienteRaca(event.target.value)}
                    placeholder="Ex.: Golden Retriever"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="paciente-data-nascimento"
                    className={labelClassName}
                  >
                    Data de Nascimento
                  </label>

                  <input
                    id="paciente-data-nascimento"
                    type="date"
                    required
                    value={pacienteDataNascimento}
                    onChange={(event) =>
                      setPacienteDataNascimento(event.target.value)
                    }
                    className={inputClassName}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="paciente-cor" className={labelClassName}>
                    Cor / Pelagem
                  </label>

                  <input
                    id="paciente-cor"
                    type="text"
                    required
                    value={pacienteCorPelagem}
                    onChange={(event) => setPacienteCorPelagem(event.target.value)}
                    placeholder="Ex.: Dourado, pelo curto"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="paciente-sexo" className={labelClassName}>
                    Sexo
                  </label>

                  <select
                    id="paciente-sexo"
                    required
                    value={pacienteSexo}
                    onChange={(event) => setPacienteSexo(event.target.value)}
                    className={`${inputClassName} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>

                    {sexoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="paciente-castrado" className={labelClassName}>
                    Já é castrado?
                  </label>

                  <select
                    id="paciente-castrado"
                    required
                    value={pacienteCastrado}
                    onChange={(event) => setPacienteCastrado(event.target.value)}
                    className={`${inputClassName} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>

                    {castradoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {pacienteError && (
                <span className="font-inter text-[13px] font-medium text-error-red">
                  {pacienteError}
                </span>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPacienteOpen(false)}
                  className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pacienteSubmitting}
                  className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pacienteSubmitting ? "Salvando..." : "Cadastrar Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
