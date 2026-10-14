from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.animal import Animal
from app.models.prontuario import Prontuario
from app.schemas.prontuario import (
    ProntuarioCreate,
    ProntuarioUpdate,
    ProntuarioResponse,
)

router = APIRouter(prefix="/prontuarios", tags=["prontuarios"])


def _obter_animal(db: Session, animal_id: int) -> Animal:
    animal = db.query(Animal).filter(Animal.id == animal_id).first()

    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal não encontrado",
        )

    return animal


@router.post(
    "/",
    response_model=ProntuarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_prontuario(
    prontuario: ProntuarioCreate,
    db: Session = Depends(get_db),
):
    _obter_animal(db, prontuario.animal_id)

    novo_prontuario = Prontuario(
        **prontuario.model_dump(),
        data=date.today(),
        horario=datetime.now().time(),
    )

    db.add(novo_prontuario)
    db.commit()
    db.refresh(novo_prontuario)

    return novo_prontuario


@router.get("/", response_model=List[ProntuarioResponse])
def listar_prontuarios(
    animal_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Prontuario)

    if animal_id is not None:
        query = query.filter(Prontuario.animal_id == animal_id)

    return query.order_by(Prontuario.data.desc()).all()


@router.get("/{prontuario_id}", response_model=ProntuarioResponse)
def obter_prontuario(prontuario_id: int, db: Session = Depends(get_db)):
    prontuario = (
        db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    )

    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado",
        )

    return prontuario


@router.put("/{prontuario_id}", response_model=ProntuarioResponse)
def atualizar_prontuario(
    prontuario_id: int,
    prontuario_data: ProntuarioUpdate,
    db: Session = Depends(get_db),
):
    prontuario = (
        db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    )

    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado",
        )

    update_dict = prontuario_data.model_dump(exclude_unset=True)

    if "animal_id" in update_dict:
        _obter_animal(db, update_dict["animal_id"])

    for key, value in update_dict.items():
        setattr(prontuario, key, value)

    db.commit()
    db.refresh(prontuario)

    return prontuario


@router.delete("/{prontuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_prontuario(prontuario_id: int, db: Session = Depends(get_db)):
    prontuario = (
        db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    )

    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado",
        )

    db.delete(prontuario)
    db.commit()

    return None
