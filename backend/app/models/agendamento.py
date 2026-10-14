from datetime import date, time
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.animal import Animal


class Agendamento(Base):
    __tablename__ = "agendamentos"

    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[date] = mapped_column(Date)
    horario: Mapped[time] = mapped_column(Time)
    anotacoes: Mapped[str] = mapped_column(Text)
    animal_id: Mapped[int] = mapped_column(ForeignKey("animais.id"))

    animal: Mapped["Animal"] = relationship(back_populates="agendamentos")
