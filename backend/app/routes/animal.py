from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.animal import Animal
from app.models.tutor import Tutor
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse


router = APIRouter(prefix="/animais", tags=["Animais"])


@router.post(
    "/",
    response_model=AnimalResponse,
    status_code=status.HTTP_201_CREATED
)
def criar_animal(
    animal: AnimalCreate,
    db: Session = Depends(get_db)
):
    tutor = db.query(Tutor).filter(Tutor.id == animal.tutor_id).first()

    if not tutor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutor não encontrado"
        )

    novo_animal = Animal(**animal.model_dump())

    db.add(novo_animal)
    db.commit()
    db.refresh(novo_animal)

    return novo_animal


@router.get("/", response_model=List[AnimalResponse])
def listar_animais(db: Session = Depends(get_db)):
    return db.query(Animal).all()


@router.get("/{animal_id}", response_model=AnimalResponse)
def obter_animal(
    animal_id: int,
    db: Session = Depends(get_db)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()

    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal não encontrado"
        )

    return animal


@router.put("/{animal_id}", response_model=AnimalResponse)
def atualizar_animal(
    animal_id: int,
    animal_data: AnimalUpdate,
    db: Session = Depends(get_db)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()

    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal não encontrado"
        )

    update_dict = animal_data.model_dump(exclude_unset=True)

    if "tutor_id" in update_dict:
        tutor = (
            db.query(Tutor)
            .filter(Tutor.id == update_dict["tutor_id"])
            .first()
        )

        if not tutor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tutor não encontrado"
            )

    for key, value in update_dict.items():
        setattr(animal, key, value)

    db.commit()
    db.refresh(animal)

    return animal


@router.delete(
    "/{animal_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_animal(
    animal_id: int,
    db: Session = Depends(get_db)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()

    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal não encontrado"
        )

    db.delete(animal)
    db.commit()

    return None