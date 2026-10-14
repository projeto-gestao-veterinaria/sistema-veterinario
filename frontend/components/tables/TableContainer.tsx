"use client";

import { useEffect, useState } from "react";

import {
  eliminarTutor,
  listarTutores,
  type TutorResponse,
} from "@/services/tutores";

export default function TableContainer() {
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    listarTutores(controller.signal)
      .then((data) => {
        if (!active) return;
        setTutores(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }
        setError("Não foi possível carregar os tutores.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function handleExcluir(tutor: TutorResponse) {
    const confirmado = window.confirm(
      `Excluir o tutor ${tutor.nome}? Os animais vinculados também serão excluídos.`,
    );

    if (!confirmado) return;

    try {
      await eliminarTutor(tutor.id);
      setTutores((atuais) => atuais.filter((item) => item.id !== tutor.id));
    } catch {
      setError("Não foi possível excluir o tutor.");
    }
  }

  return (
    <div className="box-border flex w-full flex-col items-start overflow-hidden rounded-2xl border border-border bg-linear-to-r from-white to-page shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="w-full overflow-x-auto">
        <div className="min-w-279">
          <div className="flex h-12.25 w-full items-center gap-3 border-b border-border bg-linear-to-r from-white to-page px-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
            <span className="w-55 shrink-0 font-inter text-sm font-semibold leading-4.25 text-light-gray">
              Nome
            </span>

            <span className="w-40 shrink-0 font-inter text-sm font-semibold leading-4.25 text-light-gray">
              CPF
            </span>

            <span className="w-40 shrink-0 font-inter text-sm font-semibold leading-4.25 text-light-gray">
              Telefone
            </span>

            <span className="w-60 shrink-0 font-inter text-sm font-semibold leading-4.25 text-light-gray">
              E-mail
            </span>

            <span className="w-30 shrink-0 text-center font-inter text-sm font-semibold leading-4.25 text-light-gray">
              Animais
            </span>

            <span className="flex-1 text-right font-inter text-sm font-semibold leading-4.25 text-light-gray">
              Ações
            </span>
          </div>

          {loading && (
            <div className="flex h-75 items-center justify-center">
              <span className="font-inter text-sm text-light-gray">
                Carregando tutores...
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-75 items-center justify-center">
              <span className="font-inter text-sm text-error-red">{error}</span>
            </div>
          )}

          {!loading && !error && tutores.length === 0 && (
            <div className="flex h-75 items-center justify-center">
              <span className="font-inter text-sm text-light-gray">
                Nenhum tutor encontrado.
              </span>
            </div>
          )}

          {!loading &&
            !error &&
            tutores.map((tutor) => (
              <div
                key={tutor.id}
                className="flex h-15.25 w-full items-center gap-3 border-b border-surface bg-white px-4 shadow-[0_2px_10px_-6px_rgba(0,0,0,0.0313726)] last:border-b-0"
              >
                <span className="w-55 shrink-0 truncate font-inter text-sm font-medium leading-4.25 text-dark-gray">
                  {tutor.nome}
                </span>

                <span className="w-40 shrink-0 font-inter text-sm leading-4.25 text-light-gray">
                  {tutor.cpf}
                </span>

                <span className="w-40 shrink-0 font-inter text-sm leading-4.25 text-light-gray">
                  {tutor.telefone}
                </span>

                <span className="w-60 shrink-0 truncate font-inter text-sm leading-4.25 text-light-gray">
                  {tutor.email}
                </span>

                <div className="flex w-30 shrink-0 justify-center">
                  <span className="rounded-full border border-teal bg-[#F0FDFA] px-2.5 py-1 font-inter text-caption font-semibold leading-3.75 text-teal">
                    {tutor.animais.length}{" "}
                    {tutor.animais.length === 1 ? "Pet" : "Pets"}
                  </span>
                </div>

                <div className="flex flex-1 justify-end gap-3">
                  <button
                    type="button"
                    aria-label={`Editar ${tutor.nome}`}
                    className="rounded-full border border-orange px-3 py-1.5 font-inter text-sm font-semibold leading-4.25 text-orange transition-colors hover:bg-[#FFF7ED]"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    aria-label={`Excluir ${tutor.nome}`}
                    onClick={() => handleExcluir(tutor)}
                    className="rounded-full border border-error-red px-3 py-1.5 font-inter text-sm font-semibold leading-4.25 text-error-red transition-colors hover:bg-error-red/10"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
