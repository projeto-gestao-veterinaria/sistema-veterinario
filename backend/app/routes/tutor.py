from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.tutor import Tutor
from app.schemas.tutor import TutorCreate, TutorResponse


router = APIRouter(prefix="/tutores", tags=["Tutores"])


@router.post("/", response_model=TutorResponse)
def criar_tutor(tutor: TutorCreate, db: Session = Depends(get_db)):
    novo_tutor = Tutor(
        nome=tutor.nome,
        email=tutor.email,
        telefone=tutor.telefone,
    )

    db.add(novo_tutor)
    db.commit()
    db.refresh(novo_tutor)

    return novo_tutor


@router.get("/", response_model=list[TutorResponse])
def listar_tutores(db: Session = Depends(get_db)):
    resultado = db.execute(select(Tutor))
    return resultado.scalars().all()