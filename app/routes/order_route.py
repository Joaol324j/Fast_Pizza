from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.configs.db import get_db
from app.services.order_service import PedidoService
from app.schemas.order_schema import PedidoCreate, PedidoResponse, StatusUpdate
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/pedidos", tags=["Pedidos"])

@router.post("/", response_model=PedidoResponse)
def criar_pedido(
    pedido: PedidoCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        novo_pedido = PedidoService.criar_pedido(db, pedido)
        return novo_pedido
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[PedidoResponse])
def listar_pedidos(db: Session = Depends(get_db)):
    return PedidoService.listar_pedidos(db)

@router.get("/{pedido_id}", response_model=PedidoResponse)
def buscar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = PedidoService.buscar_pedido(db, pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido

@router.put("/{pedido_id}/status", response_model=PedidoResponse)
def atualizar_status_pedido(
    pedido_id: int, 
    status_update: StatusUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pedido_atualizado = PedidoService.atualizar_status_pedido(db, pedido_id, status_update.status)
    if not pedido_atualizado:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido_atualizado

@router.delete("/{pedido_id}")
def deletar_pedido(
    pedido_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pedido_removido = PedidoService.deletar_pedido(db, pedido_id)
    if not pedido_removido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return {"message": "Pedido removido com sucesso"}
