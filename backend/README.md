# PetAssistente — Backend

Esqueleto inicial do backend do Sistema de Gestão Veterinária.

## Stack
- Python 3.12+
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Alembic
- Pydantic
- Pytest + HTTPX

## Estrutura

```text
PetAssistente/
├── app/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   └── main.py
├── .env.example
├── requirements.txt
└── README.md
```

## Como executar no VS Code

### 1. Criar ambiente virtual

Windows PowerShell:
```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Windows CMD:
```cmd
py -3.12 -m venv .venv
.venv\Scripts\activate
```

Linux/macOS:
```bash
python3.12 -m venv .venv
source .venv/bin/activate
```

### 2. Instalar dependências

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configurar ambiente

Copie `.env.example` para `.env` e ajuste a URL do PostgreSQL.

Exemplo:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/petassistente
```

### 4. Rodar a API

```bash
uvicorn app.main:app --reload
```

Abra no navegador:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

A documentação interativa será gerada pelo FastAPI.

## Observação

Este é o esqueleto da primeira etapa. CRUDs completos, autenticação, demais entidades, RAG/IA, testes mais abrangentes e migrations serão implementados nas próximas etapas do plano.
