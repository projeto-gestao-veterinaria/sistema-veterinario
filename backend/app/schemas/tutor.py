from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List

from app.schemas.animal import AnimalResponse


class TutorBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    cpf: str
    data_nascimento: date
    cep: str
    rua: str
    bairro: str
    cidade: str
    estado: str


class TutorCreate(TutorBase):
    pass


class TutorUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    cpf: Optional[str] = None
    data_nascimento: Optional[date] = None
    cep: Optional[str] = None
    rua: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None


class TutorResponse(TutorBase):
    id: int
    animais: List[AnimalResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)