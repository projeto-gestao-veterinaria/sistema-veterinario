"use client";

import { Dog, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  eliminarAnimal,
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";
import {
  listarVacinas,
  type VacinaResponse,
} from "@/services/vacinas";
import {
  listarProntuarios,
  type ProntuarioResponse,
} from "@/services/prontuarios";

function calcularIdade(dataNascimento: string | null): string {
  if (!dataNascimento) return "idade desconhecida";

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

function getStatusStyle(status: string) {
  switch (status) {
    case "Aplicada":
      return "bg-teal-100 text-emerald-500";

    case "Pendente":
      return "bg-amber-100 text-amber-500";

    case "Atrasada":
      return "bg-red-100 text-red-500";

    default:
      return "bg-slate-100 text-slate-500";
  }
}

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

export default function AnimalCards() {
  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const [animalSelecionado, setAnimalSelecionado] =
    useState<AnimalResponse | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [vacinas, setVacinas] = useState<VacinaResponse[]>([]);
  const [prontuarios, setProntuarios] = useState<ProntuarioResponse[]>([]);

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
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os pacientes.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  function nomeTutor(tutorId: number): string {
    return tutores.find((tutor) => tutor.id === tutorId)?.nome ?? "—";
  }

  function telefoneTutor(tutorId: number): string {
    return tutores.find((tutor) => tutor.id === tutorId)?.telefone ?? "—";
  }

  async function handleVer(animal: AnimalResponse) {
    setAnimalSelecionado(animal);
    setModalLoading(true);
    setModalError(null);
    setVacinas([]);
    setProntuarios([]);

    const controller = new AbortController();

    try {
      const [vacinasData, prontuariosData] = await Promise.all([
        listarVacinas(animal.id, controller.signal),
        listarProntuarios(animal.id, controller.signal),
      ]);

      setVacinas(vacinasData);
      setProntuarios(prontuariosData.slice(0, 2));
    } catch (err: unknown) {
      if (!(err instanceof Error && err.name === "AbortError")) {
        setModalError(
          "Não foi possível carregar as informações do paciente.",
        );
      }
    } finally {
      setModalLoading(false);
    }
  }

  function fecharModal() {
    setAnimalSelecionado(null);
  }

  async function handleExcluir(animal: AnimalResponse) {
    const confirmado = window.confirm(
      `Excluir o paciente ${animal.nome}? Agendamentos, vacinas e prontuários vinculados também serão excluídos.`,
    );

    if (!confirmado) return;

    try {
      await eliminarAnimal(animal.id);
      setAnimais((atuais) => atuais.filter((item) => item.id !== animal.id));
    } catch {
      setError("Não foi possível excluir o paciente.");
    }
  }

  const termo = busca.trim().toLowerCase();

  const animaisFiltrados = animais.filter((animal) => {
    if (!termo) return true;

    return (
      animal.nome.toLowerCase().includes(termo) ||
      nomeTutor(animal.tutor_id).toLowerCase().includes(termo)
    );
  });

  return (
    <div className="box-border flex h-106.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-[#F8FAFC] p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="flex h-9 w-full items-center justify-between">
        <h2 className="font-['Outfit'] text-[18px] font-bold leading-5.75 text-dark-navy">
          Registro de Pacientes
        </h2>

        <div className="flex h-9 items-center gap-3">
          <div className="box-border flex h-8.5 items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)]">
            <Search size={18} strokeWidth={2} className="shrink-0 text-slate" />

            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por paciente ou tutor..."
              className="w-52 bg-transparent font-['Inter'] text-[13px] leading-4 text-dark-gray outline-none placeholder:text-light-gray"
            />
          </div>
        </div>
      </div>

      <div className="flex h-81.75 w-full flex-col overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="box-border flex h-9.75 w-full items-center gap-3 border-b border-border bg-linear-to-r from-white to-[#F0FDFA] px-4 py-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex-1 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Paciente
          </div>

          <div className="w-55 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Tutor
          </div>

          <div className="w-30 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Espécie
          </div>

          <div className="w-35 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Raça
          </div>

          <div className="w-35 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Sexo / Castrado
          </div>

          <div className="w-47.5 font-['Inter'] text-xs font-semibold uppercase leading-3.75 text-light-gray">
            Ações
          </div>
        </div>

        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-['Inter'] text-[13px] text-light-gray">
              Carregando pacientes...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-['Inter'] text-[13px] text-error-red">
              {error}
            </span>
          </div>
        )}

        {!loading && !error && animaisFiltrados.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-['Inter'] text-[13px] text-light-gray">
              Nenhum paciente encontrado.
            </span>
          </div>
        )}

        {!loading &&
          !error &&
          animaisFiltrados.map((animal) => (
            <div
              key={animal.id}
              className="box-border flex h-18 w-full items-center gap-3 border-b border-border bg-white px-4 py-3.5 last:border-b-0"
            >
              <div className="flex h-11 min-w-0 flex-1 items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] ${
                    animal.especie === "Gato" ? "bg-[#FFEDD5]" : "bg-[#F0FDFA]"
                  }`}
                >
                  <Dog
                    size={20}
                    strokeWidth={2}
                    className={
                      animal.especie === "Gato"
                        ? "text-warning-amber"
                        : "text-teal"
                    }
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-['Inter'] text-sm font-bold leading-4.25 text-dark-gray">
                    {animal.nome}
                  </span>

                  <span className="truncate font-['Inter'] text-xs font-normal leading-3.75 text-light-gray">
                    {calcularIdade(animal.data_nascimento)} •{" "}
                    {animal.cor_pelagem}
                  </span>
                </div>
              </div>

              <div className="w-55 truncate font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
                {nomeTutor(animal.tutor_id)}
              </div>

              <div className="w-30 font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
                {animal.especie}
              </div>

              <div className="w-35 truncate font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
                {animal.raca ?? "—"}
              </div>

              <div className="w-35 font-['Inter'] text-[13px] font-normal leading-4 text-light-gray">
                {animal.sexo} • {animal.castrado}
              </div>

              <div className="flex w-47.5 items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleVer(animal)}
                  className="box-border h-8 rounded-full border border-border bg-white px-3 py-2 font-['Inter'] text-[13px] font-semibold leading-4 text-light-gray shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] transition hover:bg-page"
                >
                  Ver
                </button>

                <button
                  type="button"
                  className="box-border h-8 rounded-full border border-border bg-white px-3 py-2 font-['Inter'] text-[13px] font-semibold leading-4 text-orange shadow-[0_6px_16px_-10px_rgba(0,0,0,0.0313726)] transition hover:bg-[#FFF7ED]"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleExcluir(animal)}
                  className="box-border h-8 rounded-full border border-error-red px-3 py-2 font-['Inter'] text-[13px] font-semibold leading-4 text-error-red transition hover:bg-error-red/10"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
      </div>

      {animalSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Informações do paciente"
          onClick={fecharModal}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col gap-5 overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-['Outfit'] text-[18px] font-bold leading-5.75 text-dark-gray">
                  {animalSelecionado.nome}
                </h2>

                <span className="font-inter text-[13px] font-semibold leading-4 text-teal">
                  {animalSelecionado.especie} •{" "}
                  {animalSelecionado.raca ?? "sem raça"}
                </span>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar"
                className="cursor-pointer rounded-full p-1.5 text-light-gray transition hover:bg-page hover:text-dark-gray"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border bg-page p-4">
              <span className="font-inter text-[11px] font-bold uppercase leading-3.25 text-slate">
                Dados do paciente
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Espécie</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {animalSelecionado.especie}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Raça</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {animalSelecionado.raca ?? "—"}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Sexo</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {animalSelecionado.sexo}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Castrado</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {animalSelecionado.castrado}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Idade</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {calcularIdade(animalSelecionado.data_nascimento)}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Cor / Pelagem</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {animalSelecionado.cor_pelagem}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Tutor</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {nomeTutor(animalSelecionado.tutor_id)}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={labelClassName}>Telefone</span>

                  <span className="font-inter text-[13px] font-medium text-dark-gray">
                    {telefoneTutor(animalSelecionado.tutor_id)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-inter text-[11px] font-bold uppercase leading-3.25 text-slate">
                Vacinas
              </span>

              {modalLoading ? (
                <span className="font-inter text-[13px] text-light-gray">
                  Carregando vacinas e prontuários...
                </span>
              ) : modalError ? (
                <span className="font-inter text-[13px] font-medium text-error-red">
                  {modalError}
                </span>
              ) : vacinas.length === 0 ? (
                <span className="font-inter text-[13px] text-light-gray">
                  Nenhuma vacina registrada.
                </span>
              ) : (
                <ul className="flex flex-col gap-2">
                  {vacinas.map((vacina) => (
                    <li
                      key={vacina.id}
                      className="flex flex-col gap-1 rounded-xl border border-border bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-inter text-[13px] font-semibold text-dark-gray">
                          {vacina.nome}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 font-inter text-caption font-semibold leading-3.75 ${getStatusStyle(
                            vacina.status,
                          )}`}
                        >
                          {vacina.status}
                        </span>
                      </div>

                      <span className="font-inter text-caption leading-3.75 text-light-gray">
                        Dose: {vacina.dose} • Aplicação:{" "}
                        {formatarData(vacina.data_aplicacao)} • Próxima:{" "}
                        {formatarData(vacina.proxima_dose)} • {vacina.veterinario}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-inter text-[11px] font-bold uppercase leading-3.25 text-slate">
                Últimos Prontuários
              </span>

              {modalLoading ? (
                <span className="font-inter text-[13px] text-light-gray">
                  Carregando prontuários...
                </span>
              ) : modalError ? (
                <span className="font-inter text-[13px] font-medium text-error-red">
                  {modalError}
                </span>
              ) : prontuarios.length === 0 ? (
                <span className="font-inter text-[13px] text-light-gray">
                  Nenhum prontuário registrado.
                </span>
              ) : (
                <ul className="flex flex-col gap-2">
                  {prontuarios.map((prontuario) => (
                    <li
                      key={prontuario.id}
                      className="flex flex-col gap-1 rounded-xl border border-border bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-inter text-[13px] font-semibold text-teal">
                          {formatarData(prontuario.data)} às {prontuario.horario}
                        </span>

                        <span className="font-inter text-caption leading-3.75 text-light-gray">
                          {prontuario.veterinario}
                        </span>
                      </div>

                      <p className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                        {prontuario.motivo || "Atendimento clínico"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
