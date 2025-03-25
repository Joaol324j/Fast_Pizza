from pydantic import BaseModel
from typing import Optional

class PromocaoBase(BaseModel):
    descricao: str
    tipo_desconto: str  
    valor_desconto: float
    produto_id: Optional[int]  

class PromocaoCreate(PromocaoBase):
    pass

class PromocaoResponse(PromocaoBase):
    id: int

    class Config:
        orm_mode = True
