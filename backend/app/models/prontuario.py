from datetime import date, time
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.animal import Animal


class Prontuario(Base):
    __tablename__ = "prontuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    animal_id: Mapped[int] = mapped_column(ForeignKey("animais.id"))
    data: Mapped[date] = mapped_column(Date)
    horario: Mapped[time] = mapped_column(Time, server_default=func.now())
    veterinario: Mapped[str] = mapped_column(String(120))
    motivo: Mapped[str] = mapped_column(Text, server_default="")
    anamnese: Mapped[str] = mapped_column(Text, server_default="")
    exame_fisico: Mapped[str] = mapped_column(Text, server_default="")
    diagnostico: Mapped[str] = mapped_column(Text, server_default="")
    tratamento: Mapped[str] = mapped_column(Text, server_default="")
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)

    animal: Mapped["Animal"] = relationship(back_populates="prontuarios")
