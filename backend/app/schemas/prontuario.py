from datetime import date, time

from pydantic import BaseModel, ConfigDict, field_serializer


class ProntuarioCreate(BaseModel):
    animal_id: int
    veterinario: str
    motivo: str
    anamnese: str
    exame_fisico: str
    diagnostico: str
    tratamento: str
    observacoes: str | None = None


class ProntuarioUpdate(BaseModel):
    veterinario: str | None = None
    motivo: str | None = None
    anamnese: str | None = None
    exame_fisico: str | None = None
    diagnostico: str | None = None
    tratamento: str | None = None
    observacoes: str | None = None
    animal_id: int | None = None


class ProntuarioResponse(BaseModel):
    id: int
    animal_id: int
    data: date
    horario: time
    veterinario: str
    motivo: str
    anamnese: str
    exame_fisico: str
    diagnostico: str
    tratamento: str
    observacoes: str | None = None

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("horario")
    def serialize_horario(self, value: time) -> str:
        return value.strftime("%H:%M")
