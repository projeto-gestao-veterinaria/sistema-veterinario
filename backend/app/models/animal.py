from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.tutor import Tutor


class Animal(Base):
    __tablename__ = "animais"

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_id: Mapped[int] = mapped_column(ForeignKey("tutores.id"))
    nome: Mapped[str] = mapped_column(String(80))
    especie: Mapped[str] = mapped_column(String(40))
    raca: Mapped[str | None] = mapped_column(String(60), nullable=True)
    data_nascimento: Mapped[date | None] = mapped_column(Date, nullable=True)

    tutor: Mapped["Tutor"] = relationship(back_populates="animais")
