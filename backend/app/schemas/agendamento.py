from datetime import date, time

from pydantic import BaseModel, ConfigDict, field_serializer

from app.schemas.animal import AnimalResponse


class AgendamentoBase(BaseModel):
    data: date
    horario: time
    anotacoes: str
    animal_id: int


class AgendamentoCreate(AgendamentoBase):
    pass


class AgendamentoUpdate(BaseModel):
    data: date | None = None
    horario: time | None = None
    anotacoes: str | None = None
    animal_id: int | None = None


class AgendamentoResponse(AgendamentoBase):
    id: int
    animal: AnimalResponse

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("horario")
    def serialize_horario(self, value: time) -> str:
        return value.strftime("%H:%M")
