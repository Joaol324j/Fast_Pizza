from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.configs.db import Base

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pendente")  
    data_criacao = Column(DateTime, default=datetime.utcnow)
    total = Column(Float, default=0.0) 

    produtos = relationship("PedidoProduto", back_populates="pedido", cascade="all, delete-orphan")


class PedidoProduto(Base):
    __tablename__ = "pedido_produto"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    produto_id = Column(Integer, ForeignKey("menu.id"))
    quantidade = Column(Integer, nullable=False, default=1)
    preco_unitario = Column(Float, nullable=False)

    pedido = relationship("Pedido", back_populates="produtos")
    produto = relationship("Produto")
