from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class CatalogoVacina(Base):
    __tablename__ = "catalogo_vacinas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    especie: Mapped[str] = mapped_column(String(40))
    tipo: Mapped[str] = mapped_column(String(20))
    doencas: Mapped[str] = mapped_column(Text)
    protocolo: Mapped[str] = mapped_column(Text)
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)
