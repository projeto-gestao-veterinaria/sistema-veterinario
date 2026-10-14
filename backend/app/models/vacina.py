from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.animal import Animal
    from app.models.catalogo_vacina import CatalogoVacina


class Vacina(Base):
    __tablename__ = "vacinas"

    id: Mapped[int] = mapped_column(primary_key=True)
    animal_id: Mapped[int] = mapped_column(ForeignKey("animais.id"))
    catalogo_id: Mapped[int | None] = mapped_column(
        ForeignKey("catalogo_vacinas.id"), nullable=True
    )
    nome: Mapped[str] = mapped_column(String(120))
    dose: Mapped[str] = mapped_column(String(40))
    data_aplicacao: Mapped[date] = mapped_column(Date)
    proxima_dose: Mapped[date | None] = mapped_column(Date, nullable=True)
    veterinario: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(20))

    animal: Mapped["Animal"] = relationship(back_populates="vacinas")
    catalogo: Mapped["CatalogoVacina"] = relationship()
