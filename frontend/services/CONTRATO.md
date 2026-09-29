# Contratos da API — campos fora do contrato

Documento de rastreio dos campos usados nas telas do frontend que **não** existem
nos schemas do backend (`backend/app/schemas/animal.py` e
`backend/app/schemas/tutor.py`) e, portanto, ficaram de fora dos contratos em
`services/animais.ts` e `services/tutores.ts`.

## Animais

Contrato atual (`AnimalBase`): `nome`, `especie`, `raca`, `data_nascimento` + `tutor_id`.

Tela: `app/(dashboard)/animais/novo/page.tsx`

| Campo do formulário | No contrato? | Observação                                        |
| ------------------- | ------------ | ------------------------------------------------- |
| `tutor` (tutor_id)  | Sim          | Enviado como `tutor_id`                           |
| `nome`              | Sim          | —                                                 |
| `especie`           | Sim          | —                                                 |
| `raca`              | Sim          | —                                                 |
| `dataNascimento`    | Sim          | Enviado como `data_nascimento` (ISO `YYYY-MM-DD`) |
| `sexo`              | **Não**      | Não existe no model/schema do backend             |
| `castrado`          | **Não**      | Não existe no model/schema do backend             |
| `corPelagem`        | **Não**      | Não existe no model/schema do backend             |

## Tutores

Contrato atual (`TutorBase`): `nome`, `email`, `telefone` + `id`, `animais`.

Tela: `app/(dashboard)/tutores/novo/page.tsx`

| Campo do formulário | No contrato? | Observação                            |
| ------------------- | ------------ | ------------------------------------- |
| `nome`              | Sim          | —                                     |
| `email`             | Sim          | Validado como `EmailStr` no backend   |
| `telefone`          | Sim          | Opcional no backend                   |
| `cpf`               | **Não**      | Não existe no model/schema do backend |
| `dataNascimento`    | **Não**      | Não existe no model/schema do backend |
| `cep`               | **Não**      | Endereço não é persistido no backend  |
| `rua`               | **Não**      | Endereço não é persistido no backend  |
| `bairro`            | **Não**      | Endereço não é persistido no backend  |
| `cidade`            | **Não**      | Endereço não é persistido no backend  |
| `estado`            | **Não**      | Endereço não é persistido no backend  |

## Divergências relevantes

- **Endereço do tutor:** o formulário preenche endereço via ViaCEP, mas o backend
  não possui esses campos no model. Hoje esses dados são descartados.
