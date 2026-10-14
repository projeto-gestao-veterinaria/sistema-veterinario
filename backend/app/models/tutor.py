from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.animal import Animal


class Tutor(Base):
    __tablename__ = "tutores"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    telefone: Mapped[str] = mapped_column(String(20))
    cpf: Mapped[str] = mapped_column(String(14))
    data_nascimento: Mapped[date] = mapped_column(Date)
    cep: Mapped[str] = mapped_column(String(9))
    rua: Mapped[str] = mapped_column(String(160))
    bairro: Mapped[str] = mapped_column(String(80))
    cidade: Mapped[str] = mapped_column(String(80))
    estado: Mapped[str] = mapped_column(String(2))

    animais: Mapped[list["Animal"]] = relationship(
        back_populates="tutor",
        cascade="all, delete-orphan",
    )
