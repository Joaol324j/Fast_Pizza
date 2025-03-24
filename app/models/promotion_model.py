from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.db import Base

class Promocao(Base):
    __tablename__ = "promocoes"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String, nullable=False)
    tipo_desconto = Column(String, nullable=False)  
    valor_desconto = Column(Float, nullable=False)  
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)  

    produto = relationship("Produto", back_populates="promocoes")
