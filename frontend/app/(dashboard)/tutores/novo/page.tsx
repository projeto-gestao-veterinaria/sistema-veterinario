"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type ViaCepResponse = {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

function formatCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCep(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatTelefone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 font-inter text-small text-dark-gray outline-none transition placeholder:text-slate focus:border-teal focus:ring-2 focus:ring-teal/20";

const labelClassName =
  "font-inter text-[11px] font-semibold uppercase leading-3.25 text-slate";

export default function NovoTutor() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const cepRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => cepRequestRef.current?.abort();
  }, []);

  async function buscarCep(digits: string) {
    cepRequestRef.current?.abort();

    const controller = new AbortController();
    cepRequestRef.current = controller;

    setLoadingCep(true);
    setCepError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
        signal: controller.signal,
      });
      const data = (await response.json()) as ViaCepResponse;

      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      setRua(data.logradouro ?? "");
      setBairro(data.bairro ?? "");
      setCidade(data.localidade ?? "");
      setEstado(data.uf ?? "");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setCepError("Não foi possível buscar o CEP.");
    } finally {
      if (cepRequestRef.current === controller) {
        setLoadingCep(false);
      }
    }
  }

  function handleCepChange(value: string) {
    const formatted = formatCep(value);
    setCep(formatted);

    const digits = formatted.replace(/\D/g, "");

    if (digits.length !== 8) {
      setCepError(null);
      setLoadingCep(false);
      return;
    }

    void buscarCep(digits);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/tutores");
  }

  return (
    <div className="flex justify-center pt-8">
      <section className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-border bg-linear-to-r from-white to-page p-8 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
        <div className="flex flex-col gap-1">
          <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-gray">
            Novo Tutor
          </h2>

          <p className="font-inter text-[13px] font-normal leading-4 text-light-gray">
            Preencha os dados do proprietário para cadastrá-lo no sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className={labelClassName}>
              Nome do Tutor
            </label>

            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Carlos Silva"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cpf" className={labelClassName}>
              CPF
            </label>

            <input
              id="cpf"
              type="text"
              required
              inputMode="numeric"
              value={cpf}
              onChange={(event) => setCpf(formatCpf(event.target.value))}
              placeholder="000.000.000-00"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dataNascimento" className={labelClassName}>
              Data de Nascimento
            </label>

            <input
              id="dataNascimento"
              type="date"
              required
              value={dataNascimento}
              onChange={(event) => setDataNascimento(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="telefone" className={labelClassName}>
                Telefone
              </label>

              <input
                id="telefone"
                type="text"
                required
                inputMode="numeric"
                value={telefone}
                onChange={(event) => setTelefone(formatTelefone(event.target.value))}
                placeholder="(00) 00000-0000"
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClassName}>
                E-mail
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ex.: carlos@email.com"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="cep" className={labelClassName}>
                CEP
              </label>

              {loadingCep && (
                <span className="font-inter text-[11px] font-medium text-teal">
                  Buscando...
                </span>
              )}
            </div>

            <input
              id="cep"
              type="text"
              required
              inputMode="numeric"
              value={cep}
              onChange={(event) => handleCepChange(event.target.value)}
              placeholder="00000-000"
              aria-invalid={cepError !== null}
              className={`${inputClassName} ${
                cepError
                  ? "border-error-red focus:border-error-red focus:ring-error-red/20"
                  : ""
              }`}
            />

            {cepError && (
              <span className="font-inter text-[11px] font-medium text-error-red">
                {cepError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rua" className={labelClassName}>
              Rua
            </label>

            <input
              id="rua"
              type="text"
              required
              value={rua}
              onChange={(event) => setRua(event.target.value)}
              placeholder="Ex.: Rua das Flores, 123"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bairro" className={labelClassName}>
              Bairro
            </label>

            <input
              id="bairro"
              type="text"
              required
              value={bairro}
              onChange={(event) => setBairro(event.target.value)}
              placeholder="Ex.: Centro"
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cidade" className={labelClassName}>
                Cidade
              </label>

              <input
                id="cidade"
                type="text"
                required
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
                placeholder="Ex.: São Paulo"
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="estado" className={labelClassName}>
                Estado
              </label>

              <input
                id="estado"
                type="text"
                required
                value={estado}
                onChange={(event) => setEstado(event.target.value)}
                placeholder="Ex.: SP"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/tutores"
              className="flex h-10 items-center justify-center rounded-xl border border-border px-5 font-inter text-small font-semibold text-light-gray transition hover:text-dark-gray"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#0D9487] to-[#1A806B] px-5 font-inter text-small font-medium text-white shadow-[0px_2px_6px_-2px_rgba(13,148,135,0.14902),0px_10px_24px_-8px_rgba(13,148,135,0.2)] transition hover:opacity-90"
            >
              Cadastrar Tutor
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
