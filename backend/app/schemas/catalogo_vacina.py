from pydantic import BaseModel, ConfigDict


class CatalogoVacinaResponse(BaseModel):
    id: int
    nome: str
    especie: str
    tipo: str
    doencas: str
    protocolo: str
    observacoes: str | None = None

    model_config = ConfigDict(from_attributes=True)
