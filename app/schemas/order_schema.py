from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PedidoProdutoCreate(BaseModel):
    produto_id: int
    quantidade: int

class PedidoCreate(BaseModel):
    produtos: List[PedidoProdutoCreate]

class StatusUpdate(BaseModel):
    status: str

class PedidoResponse(BaseModel):
    id: int
    status: str
    data_criacao: datetime
    total: float
    produtos: List[PedidoProdutoCreate]

    class Config:
        from_attributes = True
