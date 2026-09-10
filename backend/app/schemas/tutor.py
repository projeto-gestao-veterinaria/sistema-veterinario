from pydantic import BaseModel, ConfigDict, EmailStr


class TutorBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: str | None = None


class TutorCreate(TutorBase):
    pass


class TutorResponse(TutorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
