from sqlalchemy import Column, Integer, String, Float
from app.configs.db import Base

class Produto(Base):
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)
    preco = Column(Float, nullable=False)
    categoria = Column(String, nullable=False)