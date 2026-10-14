from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.catalogo_vacina import CatalogoVacina
from app.schemas.catalogo_vacina import CatalogoVacinaResponse

router = APIRouter(prefix="/catalogo-vacinas", tags=["catalogo-vacinas"])


@router.get("/", response_model=List[CatalogoVacinaResponse])
def listar_catalogo_vacinas(
    especie: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(CatalogoVacina)

    if especie:
        query = query.filter(CatalogoVacina.especie == especie)

    return query.order_by(CatalogoVacina.especie, CatalogoVacina.tipo, CatalogoVacina.nome).all()
