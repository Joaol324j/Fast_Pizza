from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.configs.db import Base
from datetime import datetime

class ComentarioProduto(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("menu.id", ondelete="CASCADE"))
    texto = Column(String, nullable=True)  
    nota = Column(Integer, nullable=False) 
    data_criacao = Column(DateTime, default=datetime.utcnow)

    produto = relationship("Produto", back_populates="comentarios")
