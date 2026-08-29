"use client";

import SignInWithGoogle from "@/components/buttons/SignInWithGoogle";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[900px] h-[550px] overflow-hidden rounded-xl shadow-xl bg-white">
        <section className="absolute left-0 top-0 w-1/2 h-full flex flex-col items-center justify-center px-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sign in</h1>

          <div className="flex gap-3 mb-4">
            <SignInWithGoogle />
          </div>

          <p className="text-xs text-gray-500 mb-4">ou use sua conta</p>

          <form className="w-full flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full h-11 px-4 bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              placeholder="Senha"
              className="w-full h-11 px-4 bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-red-400"
            />

            <a
              href="#"
              className="text-xs text-gray-500 text-center mt-2 hover:text-gray-700"
            >
              Esqueceu sua senha?
            </a>

            <button
              type="submit"
              className="self-center mt-2 px-10 py-3 rounded-full bg-gradient-to-r bg-primary-orange-gradient text-white text-xs font-bold uppercase tracking-wide hover:opacity-90 transition"
            >
              Entrar
            </button>
          </form>
        </section>

        <section className="absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center px-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Criar uma conta
          </h1>

          <p className="text-xs text-gray-500 mb-4">
            ou use seu e-mail para se cadastrar
          </p>

          <form className="w-full flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full h-11 px-4 bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full h-11 px-4 bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              placeholder="Senha"
              className="w-full h-11 px-4 bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              type="submit"
              className="self-center mt-2 px-10 py-3 rounded-full bg-gradient-to-r bg-primary-orange-gradient text-white text-xs font-bold uppercase tracking-wide hover:opacity-90 transition"
            >
              Criar conta
            </button>
          </form>
        </section>

        <section
          className={`
            absolute
            left-0
            top-0
            w-1/2
            h-full
            bg-secondary-green-gradient
            text-white
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-16
            z-10
            transition-transform
            duration-700
            ease-in-out
            ${isSignUp ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex justify-center items-center">
            <Image
              src="/assets/logo-badge.svg"
              alt="Logo PetAssistente"
              width="70"
              height="70"
            />
            <h1 className="text-2xl text-deep-teal font-bold">PetAssistente</h1>
          </div>

          <h2 className="text-3xl font-bold mb-5">
            {isSignUp ? "Bem vindo de volta!" : "Olá, amigo!"}
          </h2>

          <p className="text-sm leading-relaxed max-w-xs mb-6">
            {isSignUp
              ? "Já tem uma conta? Entre!"
              : "Insira seus dados pessoais e comece sua jornada conosco."}
          </p>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="px-10 py-3 rounded-full border border-white text-xs font-bold uppercase hover:bg-white hover:text-orange transition"
          >
            {isSignUp ? "ENTRAR" : "CRIAR CONTA"}
          </button>
        </section>
      </div>
    </main>
  );
}
