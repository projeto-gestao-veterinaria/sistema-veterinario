from datetime import date

from pydantic import BaseModel, ConfigDict


class VacinaBase(BaseModel):
    nome: str
    dose: str
    data_aplicacao: date
    proxima_dose: date | None = None
    veterinario: str
    status: str


class VacinaCreate(VacinaBase):
    animal_id: int
    catalogo_id: int | None = None


class VacinaUpdate(BaseModel):
    nome: str | None = None
    dose: str | None = None
    data_aplicacao: date | None = None
    proxima_dose: date | None = None
    veterinario: str | None = None
    status: str | None = None
    animal_id: int | None = None
    catalogo_id: int | None = None


class VacinaResponse(VacinaBase):
    id: int
    animal_id: int
    catalogo_id: int | None = None

    model_config = ConfigDict(from_attributes=True)
