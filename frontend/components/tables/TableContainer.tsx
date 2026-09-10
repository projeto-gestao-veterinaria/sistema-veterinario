import { Pencil, Trash2 } from "lucide-react";

interface Tutor {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  animais: number;
}

interface TableContainerProps {
  tutores?: Tutor[];
}

export default function TableContainer({ tutores = [] }: TableContainerProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-linear-to-r from-white to-page shadow-[0_2px_8px_-4px_rgba(0,0,0,0.0313726),0_12px_28px_-12px_rgba(13,148,135,0.0784314)]">
      <div className="grid h-14 grid-cols-[1.5fr_1fr_1fr_1.5fr_0.7fr_1fr] items-center border-b border-border px-6">
        <span className="text-small font-semibold text-dark-gray">Nome</span>

        <span className="text-small font-semibold text-dark-gray">CPF</span>

        <span className="text-small font-semibold text-dark-gray">
          Telefone
        </span>

        <span className="text-small font-semibold text-dark-gray">E-mail</span>

        <span className="text-small font-semibold text-dark-gray">Animais</span>

        <span className="text-small font-semibold text-dark-gray">Ações</span>
      </div>

      {tutores.map((tutor) => (
        <div
          key={tutor.id}
          className="grid min-h-16 grid-cols-[1.5fr_1fr_1fr_1.5fr_0.7fr_1fr] items-center border-b border-border px-6 last:border-b-0"
        >
          <span className="truncate text-small font-medium text-dark-gray">
            {tutor.nome}
          </span>

          <span className="text-small text-light-gray">{tutor.cpf}</span>

          <span className="text-small text-light-gray">{tutor.telefone}</span>

          <span className="truncate text-small text-light-gray">
            {tutor.email}
          </span>

          <span className="text-small text-light-gray">{tutor.animais}</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Editar ${tutor.nome}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-light-gray transition-colors hover:bg-page hover:text-teal"
            >
              <Pencil size={16} strokeWidth={2} />
            </button>

            <button
              type="button"
              aria-label={`Excluir ${tutor.nome}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-light-gray transition-colors hover:bg-error-red/10 hover:text-error-red"
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}

      {tutores.length === 0 && (
        <div className="flex h-75 items-center justify-center">
          <span className="text-small text-light-gray">
            Nenhum tutor encontrado.
          </span>
        </div>
      )}
    </div>
  );
}
