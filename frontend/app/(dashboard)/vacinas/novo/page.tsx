"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  listarAnimais,
  type AnimalResponse,
} from "@/services/animais";
import {
  listarCatalogoVacinas,
  type CatalogoVacinaResponse,
} from "@/services/catalogoVacinas";
import { criarVacina } from "@/services/vacinas";

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

const statusOptions = ["Aplicada", "Pendente", "Atrasada"];

export default function NovaVacina() {
  const router = useRouter();

  const [animais, setAnimais] = useState<AnimalResponse[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [pacientesError, setPacientesError] = useState<string | null>(null);

  const [catalogo, setCatalogo] = useState<CatalogoVacinaResponse[]>([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);

  const [animalId, setAnimalId] = useState("");
  const [catalogoId, setCatalogoId] = useState("");
  const [nome, setNome] = useState("");
  const [dose, setDose] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [proximaDose, setProximaDose] = useState("");
  const [veterinario, setVeterinario] = useState("");
  const [status, setStatus] = useState("");

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

  const animalSelecionado = animais.find(
    (animal) => String(animal.id) === animalId,
  );

  const vacinaCatalogo = catalogo.find(
    (item) => String(item.id) === catalogoId,
  );

  function handleAnimalChange(value: string) {
    setAnimalId(value);
    setCatalogoId("");
    setNome("");
    setCatalogo([]);

    const animal = animais.find((item) => String(item.id) === value);

    if (!animal || !["Cão", "Gato"].includes(animal.especie)) {
      return;
    }

    const controller = new AbortController();

    setLoadingCatalogo(true);
    listarCatalogoVacinas(animal.especie, controller.signal)
      .then((data) => setCatalogo(data))
      .catch(() => {
        setCatalogo([]);
      })
      .finally(() => setLoadingCatalogo(false));
  }

  function handleCatalogoChange(value: string) {
    setCatalogoId(value);

    const item = catalogo.find((vacina) => String(vacina.id) === value);

    setNome(item ? item.nome : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!animalSelecionado) {
      setSubmitError("Selecione o paciente.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await criarVacina({
        animal_id: animalSelecionado.id,
        catalogo_id: catalogoId ? Number(catalogoId) : null,
        nome,
        dose,
        data_aplicacao: dataAplicacao,
        proxima_dose: proximaDose || null,
        veterinario,
        status,
      });

      router.push("/vacinas");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a vacina.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center pt-8">
      <section className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-linear-to-r from-white to-page p-8 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Nova Vacina
          </h2>

          <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
            Registre a aplicação de vacina usando o catálogo oficial de
            protocolos para cães e gatos.
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
                onChange={(event) => handleAnimalChange(event.target.value)}
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
            <label htmlFor="catalogo" className={labelClassName}>
              Vacina do Catálogo
            </label>

            {!animalSelecionado ? (
              <span className="font-inter text-[13px] text-light-gray">
                Selecione o paciente para exibir as vacinas da espécie.
              </span>
            ) : !["Cão", "Gato"].includes(animalSelecionado.especie) ? (
              <span className="font-inter text-[13px] text-light-gray">
                O catálogo cobre apenas cães e gatos. Informe a vacina
                manualmente no campo abaixo.
              </span>
            ) : loadingCatalogo ? (
              <span className="font-inter text-[13px] text-light-gray">
                Carregando catálogo...
              </span>
            ) : (
              <select
                id="catalogo"
                required
                value={catalogoId}
                onChange={(event) => handleCatalogoChange(event.target.value)}
                className={`${inputClassName} cursor-pointer`}
              >
                <option value="" disabled>
                  Selecione a vacina
                </option>

                {catalogo.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} — {item.tipo}
                  </option>
                ))}
              </select>
            )}
          </div>

          {vacinaCatalogo && (
            <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-page p-4">
              <span className="font-inter text-[11px] font-bold uppercase leading-3.25 text-slate">
                Protocolo oficial
              </span>

              <span className="font-inter text-[13px] font-normal leading-4 text-dark-gray">
                {vacinaCatalogo.protocolo}
              </span>

              <span className="font-inter text-caption leading-3.75 text-light-gray">
                Protege contra: {vacinaCatalogo.doencas}
              </span>

              {vacinaCatalogo.observacoes && (
                <span className="font-inter text-caption leading-3.75 text-light-gray">
                  Observações: {vacinaCatalogo.observacoes}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className={labelClassName}>
                Nome da Vacina
              </label>

              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex.: Antirrábica"
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="dose" className={labelClassName}>
                Dose
              </label>

              <input
                id="dose"
                type="text"
                required
                value={dose}
                onChange={(event) => setDose(event.target.value)}
                placeholder="Ex.: Anual, Reforço, 1ª dose..."
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dataAplicacao" className={labelClassName}>
                Data de Aplicação
              </label>

              <input
                id="dataAplicacao"
                type="date"
                required
                value={dataAplicacao}
                onChange={(event) => setDataAplicacao(event.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="proximaDose" className={labelClassName}>
                Próxima Dose
              </label>

              <input
                id="proximaDose"
                type="date"
                value={proximaDose}
                onChange={(event) => setProximaDose(event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>

              <select
                id="status"
                required
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={`${inputClassName} cursor-pointer`}
              >
                <option value="" disabled>
                  Selecione
                </option>

                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {submitError && (
            <span className="font-inter text-[13px] font-medium text-error-red">
              {submitError}
            </span>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/vacinas"
              className="flex h-10 items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Salvando..." : "Registrar Vacina"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
