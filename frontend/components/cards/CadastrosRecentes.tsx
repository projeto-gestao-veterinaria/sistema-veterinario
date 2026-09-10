const cadastros = [
  { nome: "Snoopy", tempo: "Hoje", info: "Beagle • Tutor: Roberto Souza" },
  { nome: "Garfield", tempo: "Ontem", info: "Persa • Tutor: Camila Lima" },
  {
    nome: "Bidu",
    tempo: "2 dias atrás",
    info: "Schnauzer • Tutor: Pedro Oliveira",
  },
  { nome: "Amora", tempo: "3 dias atrás", info: "Golden • Tutor: Carlos Silva" },
];

export default function CadastrosRecentes() {
  return (
    <section className="box-border flex w-full flex-none flex-col items-start gap-4 self-stretch rounded-[14px] border border-border bg-linear-to-r from-white to-page p-6 shadow-[0px_2px_8px_-4px_rgba(0,0,0,0.0313726),0px_12px_28px_-12px_rgba(13,148,135,0.0784314)] lg:h-104.75">
      <h2 className="font-outfit text-h3 font-bold text-dark-navy">
        Cadastros Recentes
      </h2>

      <ul className="flex w-full flex-1 flex-col gap-3 overflow-y-auto">
        {cadastros.map((cadastro) => (
          <li
            key={cadastro.nome}
            className="flex w-full items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-inter text-h4 font-semibold text-dark-navy">
                {cadastro.nome}
              </h3>
              <p className="font-inter text-caption text-light-gray">
                {cadastro.info}
              </p>
            </div>
            <span className="shrink-0 font-inter text-caption font-medium text-slate">
              {cadastro.tempo}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
