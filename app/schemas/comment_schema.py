from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ComentarioProdutoCreate(BaseModel):
    produto_id: int
    texto: Optional[str] = None
    nota: int = Field(..., ge=1, le=5, description="A nota deve estar entre 1 e 5")

class ComentarioProdutoResponse(BaseModel):
    id: int
    produto_id: int
    texto: Optional[str]
    nota: int
    data_criacao: datetime

    class Config:
        from_attributes = True
