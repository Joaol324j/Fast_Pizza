from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.configs.db import get_db
from app.services.menu_service import ProdutoService
from app.schemas.menu_schema import ProdutoCreate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/", response_model=List[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    return ProdutoService.listar_produtos(db)

@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = ProdutoService.buscar_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@router.post("/", response_model=ProdutoResponse)
def adicionar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    return ProdutoService.adicionar_produto(db, produto)

@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(produto_id: int, produto: ProdutoCreate, db: Session = Depends(get_db)):
    produto_atualizado = ProdutoService.atualizar_produto(db, produto_id, produto)
    if not produto_atualizado:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto_atualizado

@router.delete("/{produto_id}")
def remover_produto(produto_id: int, db: Session = Depends(get_db)):
    produto_removido = ProdutoService.remover_produto(db, produto_id)
    if not produto_removido:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"message": "Produto removido com sucesso"}