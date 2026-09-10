from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.animal import Animal


class Tutor(Base):
    __tablename__ = "tutores"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    telefone: Mapped[str | None] = mapped_column(String(20), nullable=True)

    animais: Mapped[list["Animal"]] = relationship(
        back_populates="tutor",
        cascade="all, delete-orphan",
    )
