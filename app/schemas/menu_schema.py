from pydantic import BaseModel

class ProdutoBase(BaseModel):
    nome: str
    preco: float
    categoria: str 

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoResponse(ProdutoBase):
    id: int

    class Config:
        from_attributes = True