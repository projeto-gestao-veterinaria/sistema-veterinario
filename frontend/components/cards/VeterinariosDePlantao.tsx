const veterinarios = [
  { nome: "Dr. Felipe Castro", especialidade: "Clínica Geral" },
  { nome: "Dra. Carolina Mendes", especialidade: "Cirurgia" },
];

export default function VeterinariosDePlantao() {
  return (
    <section className="box-border flex w-full flex-none flex-col items-start gap-4 self-stretch rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0px_2px_8px_-4px_rgba(0,0,0,0.0313726),0px_12px_28px_-12px_rgba(13,148,135,0.0784314)] lg:h-47.75">
      <h2 className="font-outfit text-[18px] leading-5.75 font-bold text-dark-navy">
        Veterinários de Plantão
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-3 overflow-y-auto">
        {veterinarios.map((vet) => (
          <li
            key={vet.nome}
            className="flex w-full flex-row items-center gap-3"
          >
            <div className="h-11 w-11 flex-none rounded-full border border-border bg-[#F0FDFA]" />

            <div className="flex flex-1 flex-col items-start gap-0.5">
              <span className="font-inter text-small leading-4.25 font-semibold text-dark-gray">
                {vet.nome}
              </span>
              <span className="font-inter text-caption leading-3.75 font-normal text-light-gray">
                {vet.especialidade}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
