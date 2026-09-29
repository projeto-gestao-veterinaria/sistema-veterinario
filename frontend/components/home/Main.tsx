import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  { icon: CalendarCheck, label: "Agenda e consultas" },
  { icon: HeartPulse, label: "Prontuários clínicos" },
  { icon: ShieldCheck, label: "Vacinas e controle" },
];

const stats = [
  { value: "+1.200", label: "clínicas ativas" },
  { value: "98%", label: "satisfação dos clientes" },
  { value: "24/7", label: "acesso aos dados" },
];

export default function Main() {
  return (
    <section className="relative overflow-hidden bg-page">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-mint/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-light-teal/20 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:gap-16 lg:py-24">
        <div className="flex w-full flex-col items-start lg:w-1/2">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-pale-mint px-4 py-1.5 font-inter text-caption font-semibold uppercase tracking-wide text-teal">
            <span className="h-2 w-2 rounded-full bg-teal" />
            Gestão veterinária inteligente
          </span>

          <h1 className="mt-6 font-outfit text-display font-extrabold leading-[1.1] text-dark-navy sm:text-[48px] lg:text-[56px]">
            Toda a sua clínica veterinária em{" "}
            <span className="text-teal">um só lugar</span>
          </h1>

          <p className="mt-6 max-w-xl font-inter text-body leading-relaxed text-light-gray">
            Centralize tutores, pacientes, prontuários e agenda em uma
            plataforma moderna. Ganhe tempo no atendimento e ofereça um cuidado
            de excelência para cada animal.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r bg-primary-green-gradient px-8 py-3.5 font-inter text-small font-bold text-white shadow-[0_10px_24px_-10px_rgba(13,148,135,0.5)] transition hover:opacity-90"
            >
              Começar agora
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-8 py-3.5 font-inter text-small font-semibold text-dark-gray transition hover:border-teal hover:text-teal"
            >
              Ver demonstração
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 font-inter text-small text-dark-gray"
              >
                <Icon size={18} strokeWidth={2} className="text-teal" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-[0_30px_60px_-30px_rgba(4,47,46,0.35)]">
            <Image
              src="/assets/Hero-Image.jpg"
              alt="Veterinária cuidando de um animal de estimação"
              width={1408}
              height={768}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-lg sm:left-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pale-mint">
              <Check size={22} strokeWidth={2.5} className="text-teal" />
            </div>
            <div>
              <p className="font-outfit text-h3 font-bold leading-none text-dark-navy">
                +10 mil
              </p>
              <p className="mt-1 font-inter text-caption text-light-gray">
                prontuários gerenciados
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 lg:pb-24">
        <dl className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-white/70 px-8 py-8 backdrop-blur sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <dt className="font-outfit text-h1 font-extrabold text-teal">
                {stat.value}
              </dt>
              <dd className="mt-1 font-inter text-small text-light-gray">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
