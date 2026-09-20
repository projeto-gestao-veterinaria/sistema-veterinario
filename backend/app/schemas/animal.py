from datetime import date

from pydantic import BaseModel, ConfigDict


class AnimalBase(BaseModel):
    nome: str
    especie: str
    raca: str | None = None
    data_nascimento: date | None = None


class AnimalCreate(AnimalBase):
    tutor_id: int

class AnimalUpdate(BaseModel):
    nome: str | None = None
    especie: str | None = None
    raca: str | None = None
    data_nascimento: date | None = None
    tutor_id: int | None = None


class AnimalResponse(AnimalBase):
    id: int
    tutor_id: int
    model_config = ConfigDict(from_attributes=True)
