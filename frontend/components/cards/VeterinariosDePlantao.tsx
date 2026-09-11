type Veterinario = {
  nome: string;
  especialidade: string;
};

const veterinarios: Veterinario[] = [
  // { nome: "Dr. Felipe Castro", especialidade: "Clínica Geral" },
  // { nome: "Dra. Carolina Mendes", especialidade: "Cirurgia" },
];

export default function VeterinariosDePlantao() {
  return (
    <section className="box-border flex h-47.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
        Veterinários de Plantão
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-4">
        {veterinarios.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhum Veterinário de Plantão.
            </span>
          </li>
        )}

        {veterinarios.map((vet) => (
          <li key={vet.nome} className="flex w-full items-center gap-3">
            <div className="h-11 w-11 shrink-0 rounded-full border border-border bg-[#F0FDFA]" />

            <div className="flex flex-1 flex-col items-start gap-0.5">
              <span className="font-inter text-sm font-semibold leading-4.25 text-dark-gray">
                {vet.nome}
              </span>
              <span className="font-inter text-caption leading-3.75 text-light-gray">
                {vet.especialidade}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
