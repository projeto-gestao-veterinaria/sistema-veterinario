from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.agendamento import Agendamento
from app.models.animal import Animal
from app.schemas.agendamento import (
    AgendamentoCreate,
    AgendamentoUpdate,
    AgendamentoResponse,
)

router = APIRouter(prefix="/agendamentos", tags=["agendamentos"])


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
    response_model=AgendamentoResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_agendamento(
    agendamento: AgendamentoCreate,
    db: Session = Depends(get_db),
):
    _obter_animal(db, agendamento.animal_id)

    novo_agendamento = Agendamento(**agendamento.model_dump())

    db.add(novo_agendamento)
    db.commit()
    db.refresh(novo_agendamento)

    return novo_agendamento


@router.get("/", response_model=List[AgendamentoResponse])
def listar_agendamentos(db: Session = Depends(get_db)):
    return db.query(Agendamento).order_by(Agendamento.data, Agendamento.horario).all()


@router.get("/{agendamento_id}", response_model=AgendamentoResponse)
def obter_agendamento(agendamento_id: int, db: Session = Depends(get_db)):
    agendamento = (
        db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    )

    if not agendamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agendamento não encontrado",
        )

    return agendamento


@router.put("/{agendamento_id}", response_model=AgendamentoResponse)
def atualizar_agendamento(
    agendamento_id: int,
    agendamento_data: AgendamentoUpdate,
    db: Session = Depends(get_db),
):
    agendamento = (
        db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    )

    if not agendamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agendamento não encontrado",
        )

    update_dict = agendamento_data.model_dump(exclude_unset=True)

    if "animal_id" in update_dict:
        _obter_animal(db, update_dict["animal_id"])

    for key, value in update_dict.items():
        setattr(agendamento, key, value)

    db.commit()
    db.refresh(agendamento)

    return agendamento


@router.delete("/{agendamento_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_agendamento(agendamento_id: int, db: Session = Depends(get_db)):
    agendamento = (
        db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    )

    if not agendamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agendamento não encontrado",
        )

    db.delete(agendamento)
    db.commit()

    return None
