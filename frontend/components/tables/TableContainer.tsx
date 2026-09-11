type Tutor = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  animais: number;
};

const tutores: Tutor[] = [
  // {
  //   nome: "Carlos Silva",
  //   cpf: "123.456.789-00",
  //   telefone: "(12) 98765-4321",
  //   email: "carlos@gmail.com",
  //   animais: 2,
  // },
  // {
  //   nome: "Mariana Costa",
  //   cpf: "234.567.890-11",
  //   telefone: "(12) 97654-3210",
  //   email: "mariana@gmail.com",
  //   animais: 1,
  // },
  // {
  //   nome: "Pedro Oliveira",
  //   cpf: "345.678.901-22",
  //   telefone: "(12) 96543-2109",
  //   email: "pedro@gmail.com",
  //   animais: 3,
  // },
  // {
  //   nome: "Ana Santos",
  //   cpf: "456.789.012-33",
  //   telefone: "(12) 95432-1098",
  //   email: "ana.santos@gmail.com",
  //   animais: 2,
  // },
  // {
  //   nome: "Roberto Souza",
  //   cpf: "567.890.123-44",
  //   telefone: "(12) 94321-0987",
  //   email: "roberto@gmail.com",
  //   animais: 1,
  // },
  // {
  //   nome: "Camila Lima",
  //   cpf: "678.111.111-50",
  //   telefone: "(12) 93210-9876",
  //   email: "camila@gmail.com",
  //   animais: 2,
  // },
];

export default function TableContainer() {
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

          {tutores.length === 0 && (
            <div className="flex h-75 items-center justify-center">
              <span className="font-inter text-sm text-light-gray">
                Nenhum tutor encontrado.
              </span>
            </div>
          )}

          {tutores.map((tutor) => (
            <div
              key={tutor.nome}
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
                  {tutor.animais} {tutor.animais === 1 ? "Pet" : "Pets"}
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
