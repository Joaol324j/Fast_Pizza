from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.configs.db import get_db
from app.services.promotion_service import PromocaoService
from app.schemas.promotion_schema import PromocaoCreate, PromocaoResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/promocoes", tags=["Promoções"])

@router.get("/", response_model=List[PromocaoResponse])
def listar_promocoes(db: Session = Depends(get_db)):
    return PromocaoService.listar_promocoes(db)

@router.get("/{promocao_id}", response_model=PromocaoResponse)
def buscar_promocao(promocao_id: int, db: Session = Depends(get_db)):
    promocao = PromocaoService.buscar_promocao(db, promocao_id)
    if not promocao:
        raise HTTPException(status_code=404, detail="Promoção não encontrada")
    return promocao

@router.post("/", response_model=PromocaoResponse)
def adicionar_promocao(
    promocao: PromocaoCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return PromocaoService.adicionar_promocao(db, promocao)

@router.put("/{promocao_id}", response_model=PromocaoResponse)
def atualizar_promocao(
    promocao_id: int, 
    promocao: PromocaoCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    promocao_atualizada = PromocaoService.atualizar_promocao(db, promocao_id, promocao)
    if not promocao_atualizada:
        raise HTTPException(status_code=404, detail="Promoção não encontrada")
    return promocao_atualizada

@router.delete("/{promocao_id}")
def remover_promocao(
    promocao_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    promocao_removida = PromocaoService.remover_promocao(db, promocao_id)
    if not promocao_removida:
        raise HTTPException(status_code=404, detail="Promoção não encontrada")
    return {"message": "Promoção removida com sucesso"}
