from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List

from app.schemas.animal import AnimalResponse


class TutorBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None


class TutorCreate(TutorBase):
    pass


class TutorUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None


class TutorResponse(TutorBase):
    id: int
    animais: List[AnimalResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)