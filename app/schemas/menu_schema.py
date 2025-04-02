from pydantic import BaseModel
from typing import Optional

class ProdutoBase(BaseModel):
    nome: str
    preco: float
    categoria: str
    descricao: str

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoResponse(ProdutoBase):
    id: int
    nome: str
    preco: float
    categoria: str
    descricao: str
    imagem: Optional[str] = None

    class Config:
        from_attributes = True