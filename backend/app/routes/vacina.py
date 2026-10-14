from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.animal import Animal
from app.models.catalogo_vacina import CatalogoVacina
from app.models.vacina import Vacina
from app.schemas.vacina import VacinaCreate, VacinaUpdate, VacinaResponse

router = APIRouter(prefix="/vacinas", tags=["vacinas"])


def _obter_animal(db: Session, animal_id: int) -> Animal:
    animal = db.query(Animal).filter(Animal.id == animal_id).first()

    if not animal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Animal não encontrado",
        )

    return animal


def _validar_catalogo(db: Session, catalogo_id: int) -> None:
    catalogo = (
        db.query(CatalogoVacina).filter(CatalogoVacina.id == catalogo_id).first()
    )

    if not catalogo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacina do catálogo não encontrada",
        )


@router.post("/", response_model=VacinaResponse, status_code=status.HTTP_201_CREATED)
def criar_vacina(vacina: VacinaCreate, db: Session = Depends(get_db)):
    _obter_animal(db, vacina.animal_id)

    if vacina.catalogo_id is not None:
        _validar_catalogo(db, vacina.catalogo_id)

    nova_vacina = Vacina(**vacina.model_dump())

    db.add(nova_vacina)
    db.commit()
    db.refresh(nova_vacina)

    return nova_vacina


@router.get("/", response_model=List[VacinaResponse])
def listar_vacinas(
    animal_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Vacina)

    if animal_id is not None:
        query = query.filter(Vacina.animal_id == animal_id)

    return query.order_by(Vacina.data_aplicacao.desc()).all()


@router.get("/{vacina_id}", response_model=VacinaResponse)
def obter_vacina(vacina_id: int, db: Session = Depends(get_db)):
    vacina = db.query(Vacina).filter(Vacina.id == vacina_id).first()

    if not vacina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacina não encontrada",
        )

    return vacina


@router.put("/{vacina_id}", response_model=VacinaResponse)
def atualizar_vacina(
    vacina_id: int,
    vacina_data: VacinaUpdate,
    db: Session = Depends(get_db),
):
    vacina = db.query(Vacina).filter(Vacina.id == vacina_id).first()

    if not vacina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacina não encontrada",
        )

    update_dict = vacina_data.model_dump(exclude_unset=True)

    if "animal_id" in update_dict:
        _obter_animal(db, update_dict["animal_id"])

    if "catalogo_id" in update_dict and update_dict["catalogo_id"] is not None:
        _validar_catalogo(db, update_dict["catalogo_id"])

    for key, value in update_dict.items():
        setattr(vacina, key, value)

    db.commit()
    db.refresh(vacina)

    return vacina


@router.delete("/{vacina_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_vacina(vacina_id: int, db: Session = Depends(get_db)):
    vacina = db.query(Vacina).filter(Vacina.id == vacina_id).first()

    if not vacina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacina não encontrada",
        )

    db.delete(vacina)
    db.commit()

    return None
