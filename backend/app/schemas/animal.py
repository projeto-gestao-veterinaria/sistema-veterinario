from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class AnimalBase(BaseModel):
    nome: str
    especie: str
    raca: str | None = None
    data_nascimento: date | None = None
    sexo: str
    castrado: str
    cor_pelagem: str


class AnimalCreate(AnimalBase):
    tutor_id: int

class AnimalUpdate(BaseModel):
    nome: str | None = None
    especie: str | None = None
    raca: str | None = None
    data_nascimento: date | None = None
    tutor_id: int | None = None
    sexo: str | None = None
    castrado: str | None = None
    cor_pelagem: str | None = None


class AnimalResponse(AnimalBase):
    id: int
    tutor_id: int
    criado_em: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
