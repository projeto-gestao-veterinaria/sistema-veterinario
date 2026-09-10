from datetime import date

from pydantic import BaseModel, ConfigDict


class AnimalBase(BaseModel):
    nome: str
    especie: str
    raca: str | None = None
    data_nascimento: date | None = None


class AnimalCreate(AnimalBase):
    tutor_id: int


class AnimalResponse(AnimalBase):
    id: int
    tutor_id: int
    model_config = ConfigDict(from_attributes=True)
