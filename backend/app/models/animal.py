from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.agendamento import Agendamento
    from app.models.prontuario import Prontuario
    from app.models.tutor import Tutor
    from app.models.vacina import Vacina


class Animal(Base):
    __tablename__ = "animais"

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_id: Mapped[int] = mapped_column(ForeignKey("tutores.id"))
    nome: Mapped[str] = mapped_column(String(80))
    especie: Mapped[str] = mapped_column(String(40))
    raca: Mapped[str | None] = mapped_column(String(60), nullable=True)
    data_nascimento: Mapped[date | None] = mapped_column(Date, nullable=True)
    sexo: Mapped[str] = mapped_column(String(20))
    castrado: Mapped[str] = mapped_column(String(3))
    cor_pelagem: Mapped[str] = mapped_column(String(60))
    criado_em: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    tutor: Mapped["Tutor"] = relationship(back_populates="animais")

    agendamentos: Mapped[list["Agendamento"]] = relationship(
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    vacinas: Mapped[list["Vacina"]] = relationship(
        back_populates="animal",
        cascade="all, delete-orphan",
    )

    prontuarios: Mapped[list["Prontuario"]] = relationship(
        back_populates="animal",
        cascade="all, delete-orphan",
    )
