from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


from app.database.connection import get_db


from app.models.tutor import Tutor
from app.schemas.tutor import TutorCreate, TutorUpdate, TutorResponse

router = APIRouter(prefix="/tutores", tags=["tutores"])

@router.post("/", response_model=TutorResponse, status_code=status.HTTP_201_CREATED)
def criar_tutor(tutor: TutorCreate, db: Session = Depends(get_db)):
    tutor_existente = db.query(Tutor).filter(Tutor.email == tutor.email).first()
    if tutor_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um tutor registado com este e-mail."
        )
    novo_tutor = Tutor(**tutor.model_dump())
    db.add(novo_tutor)
    db.commit()
    db.refresh(novo_tutor)
    return novo_tutor

@router.get("/", response_model=List[TutorResponse])
def listar_tutores(db: Session = Depends(get_db)):
    return db.query(Tutor).all()

@router.get("/{tutor_id}", response_model=TutorResponse)
def obter_tutor(tutor_id: int, db: Session = Depends(get_db)):
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tutor não encontrado")
    return tutor


@router.put("/{tutor_id}", response_model=TutorResponse)
def atualizar_tutor(
    tutor_id: int,
    tutor_data: TutorUpdate,
    db: Session = Depends(get_db)
):
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id).first()

    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutor não encontrado"
        )

    update_dict = tutor_data.model_dump(exclude_unset=True)

    # Verifica se o novo e-mail já pertence a outro tutor
    if "email" in update_dict:
        tutor_existente = (
            db.query(Tutor)
            .filter(
                Tutor.email == update_dict["email"],
                Tutor.id != tutor_id
            )
            .first()
        )

        if tutor_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um tutor registado com este e-mail."
            )

    for key, value in update_dict.items():
        setattr(tutor, key, value)

    db.commit()
    db.refresh(tutor)

    return tutor

@router.delete("/{tutor_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_tutor(tutor_id: int, db: Session = Depends(get_db)):
    tutor = db.query(Tutor).filter(Tutor.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tutor não encontrado")

    db.delete(tutor)
    db.commit()
    return None