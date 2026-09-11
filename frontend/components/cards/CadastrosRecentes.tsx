type Cadastro = {
  nome: string;
  tempo: string;
  info: string;
};

const cadastros: Cadastro[] = [
  // { nome: "Snoopy", tempo: "Hoje", info: "Beagle • Tutor: Roberto Souza" },
  // { nome: "Garfield", tempo: "Ontem", info: "Persa • Tutor: Camila Lima" },
  // {
  //   nome: "Bidu",
  //   tempo: "2 dias atrás",
  //   info: "Schnauzer • Tutor: Pedro Oliveira",
  // },
  // {
  //   nome: "Amora",
  //   tempo: "3 dias atrás",
  //   info: "Golden • Tutor: Carlos Silva",
  // },
];

function getTimeColor(tempo: string) {
  if (tempo === "Hoje") return "text-orange";
  if (tempo === "Ontem") return "text-[#CC6B1A]";
  return "text-light-gray";
}

export default function CadastrosRecentes() {
  return (
    <section className="box-border flex h-76.75 w-full flex-col items-start gap-4 rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <h2 className="font-outfit text-[18px] font-bold leading-5.75 text-dark-navy">
        Cadastros Recentes
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-3">
        {cadastros.length === 0 && (
          <li className="flex flex-1 items-center justify-center">
            <span className="font-inter text-[13px] text-light-gray">
              Nenhum Cadastro Recente.
            </span>
          </li>
        )}

        {cadastros.map((cadastro) => (
          <li
            key={cadastro.nome}
            className="flex w-full items-center justify-between border-b border-border pb-3 opacity-90 last:border-0"
          >
            <div className="flex flex-col gap-0.5">
              <h3 className="font-inter text-sm font-semibold leading-4.25 text-dark-gray">
                {cadastro.nome}
              </h3>
              <p className="font-inter text-caption leading-3.75 text-light-gray">
                {cadastro.info}
              </p>
            </div>

            <span
              className={`shrink-0 font-inter text-caption leading-3.75 ${getTimeColor(
                cadastro.tempo,
              )}`}
            >
              {cadastro.tempo}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
