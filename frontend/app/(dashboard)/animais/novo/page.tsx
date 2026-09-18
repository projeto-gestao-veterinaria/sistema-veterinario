"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Search, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type Tutor = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const especieOptions = ["Cão", "Gato", "Ave", "Roedor", "Réptil", "Outro"];
const sexoOptions = ["Macho", "Fêmea"];
const castradoOptions = ["Sim", "Não"];

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const selectClassName = `${inputClassName} cursor-pointer appearance-none pr-10`;

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

export default function NovoAnimal() {
  const router = useRouter();

  const [tutorQuery, setTutorQuery] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [tutorListOpen, setTutorListOpen] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);

  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loadingTutores, setLoadingTutores] = useState(false);
  const [tutoresError, setTutoresError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [castrado, setCastrado] = useState("");
  const [raca, setRaca] = useState("");
  const [corPelagem, setCorPelagem] = useState("");

  const tutorFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tutorFieldRef.current &&
        !tutorFieldRef.current.contains(event.target as Node)
      ) {
        setTutorListOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = tutorQuery.trim();

    if (query.length < 2) return;

    if (
      selectedTutor &&
      selectedTutor.nome.toLowerCase() === query.toLowerCase()
    ) {
      return;
    }

    const controller = new AbortController();
    let active = true;

    const timer = setTimeout(() => {
      setLoadingTutores(true);
      setTutoresError(null);

      fetch(`${API_URL}/tutores/`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Falha ao buscar tutores");
          }

          return response.json() as Promise<Tutor[]>;
        })
        .then((data) => {
          if (!active) return;

          const normalized = query.toLowerCase();
          const matches = data.filter((tutor) =>
            tutor.nome.toLowerCase().includes(normalized),
          );

          setTutores(matches);
          setTutorListOpen(true);

          const exactMatch = matches.find(
            (tutor) => tutor.nome.toLowerCase() === normalized,
          );

          if (exactMatch) {
            setSelectedTutor(exactMatch);
          }
        })
        .catch((error: Error) => {
          if (!active || error.name === "AbortError") return;

          setTutoresError("Não foi possível buscar os tutores.");
        })
        .finally(() => {
          if (active) setLoadingTutores(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [tutorQuery, selectedTutor]);

  function handleTutorChange(value: string) {
    setTutorQuery(value);
    setSelectedTutor(null);
    setTutorError(null);

    if (value.trim().length < 2) {
      setTutores([]);
      setTutorListOpen(false);
    }
  }

  function handleSelectTutor(tutor: Tutor) {
    setSelectedTutor(tutor);
    setTutorQuery(tutor.nome);
    setTutorError(null);
    setTutorListOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTutor) {
      setTutorError("Nenhum tutor encontrado. Cadastre um novo tutor.");
      return;
    }

    router.push("/animais");
  }

  return (
    <div className="flex justify-center pt-8">
      <section className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-linear-to-r from-white to-page p-8 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Novo Animal
          </h2>

          <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
            Digite o nome do tutor para buscá-lo no sistema e preencha os dados
            do paciente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tutor" className={labelClassName}>
              Nome do Tutor
            </label>

            <div ref={tutorFieldRef} className="relative flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                />

                <input
                  id="tutor"
                  type="text"
                  autoComplete="off"
                  value={tutorQuery}
                  onChange={(event) => handleTutorChange(event.target.value)}
                  onFocus={() => {
                    if (tutores.length > 0) setTutorListOpen(true);
                  }}
                  placeholder="Digite para buscar o tutor cadastrado..."
                  aria-invalid={tutorError !== null}
                  className={`${inputClassName} pl-11 pr-11 ${
                    tutorError
                      ? "border-error-red focus:border-error-red focus:ring-error-red/20"
                      : ""
                  }`}
                />

                {loadingTutores && (
                  <Loader2
                    size={18}
                    strokeWidth={2}
                    className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-teal"
                  />
                )}

                {tutorListOpen && (
                  <ul className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-white p-1 shadow-[0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
                    {loadingTutores && (
                      <li className="px-3 py-2 font-inter text-[13px] text-light-gray">
                        Buscando tutores...
                      </li>
                    )}

                    {!loadingTutores && tutoresError && (
                      <li className="px-3 py-2 font-inter text-[13px] text-error-red">
                        {tutoresError}
                      </li>
                    )}

                    {!loadingTutores &&
                      !tutoresError &&
                      tutores.length === 0 && (
                        <li className="px-3 py-2 font-inter text-[13px] text-light-gray">
                          Nenhum tutor encontrado com esse nome.
                        </li>
                      )}

                    {!loadingTutores &&
                      !tutoresError &&
                      tutores.map((tutor) => (
                        <li key={tutor.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectTutor(tutor)}
                            className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-page ${
                              selectedTutor?.id === tutor.id
                                ? "bg-[#F0FDFA]"
                                : ""
                            }`}
                          >
                            <span className="block font-inter text-[13px] font-semibold text-dark-gray">
                              {tutor.nome}
                            </span>

                            <span className="block truncate font-inter text-[11px] text-light-gray">
                              {tutor.email}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <Link
                href="/tutores/novo"
                aria-label="Cadastrar novo tutor"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-teal transition hover:bg-[#F0FDFA]"
              >
                <UserPlus size={18} strokeWidth={2} />
              </Link>
            </div>

            {selectedTutor && (
              <span className="font-inter text-[11px] font-medium text-teal">
                Tutor encontrado: {selectedTutor.email}
              </span>
            )}

            {tutorError && (
              <span className="font-inter text-[11px] font-medium text-error-red">
                {tutorError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className={labelClassName}>
              Nome do Animal
            </label>

            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Pipoca"
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="especie" className={labelClassName}>
                Espécie
              </label>

              <div className="relative">
                <select
                  id="especie"
                  required
                  value={especie}
                  onChange={(event) => setEspecie(event.target.value)}
                  className={selectClassName}
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

                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-light-gray"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="raca" className={labelClassName}>
                Raça
              </label>

              <input
                id="raca"
                type="text"
                required
                value={raca}
                onChange={(event) => setRaca(event.target.value)}
                placeholder="Ex.: Golden Retriever"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="idade" className={labelClassName}>
                Idade
              </label>

              <div className="relative">
                <input
                  id="idade"
                  type="number"
                  required
                  min={0}
                  value={idade}
                  onChange={(event) => setIdade(event.target.value)}
                  placeholder="Ex.: 3"
                  className={`${inputClassName} pr-14`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-inter text-small text-light-gray">
                  anos
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="sexo" className={labelClassName}>
                Sexo
              </label>

              <div className="relative">
                <select
                  id="sexo"
                  required
                  value={sexo}
                  onChange={(event) => setSexo(event.target.value)}
                  className={selectClassName}
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

                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-light-gray"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="castrado" className={labelClassName}>
                Já é castrado?
              </label>

              <div className="relative">
                <select
                  id="castrado"
                  required
                  value={castrado}
                  onChange={(event) => setCastrado(event.target.value)}
                  className={selectClassName}
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

                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-light-gray"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="corPelagem" className={labelClassName}>
              Cor / Pelagem
            </label>

            <input
              id="corPelagem"
              type="text"
              required
              value={corPelagem}
              onChange={(event) => setCorPelagem(event.target.value)}
              placeholder="Ex.: Dourado, pelo curto"
              className={inputClassName}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/animais"
              className="flex h-10 items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90"
            >
              Cadastrar Animal
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
