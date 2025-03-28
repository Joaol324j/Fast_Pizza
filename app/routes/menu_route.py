from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.configs.db import get_db
from app.services.menu_service import ProdutoService
from app.schemas.menu_schema import ProdutoCreate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])

UPLOAD_DIR = "uploads/"

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
def adicionar_produto(
    nome: str = Form(...), 
    preco: float = Form(...), 
    categoria: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    produto_data = ProdutoCreate(nome=nome, preco=preco, categoria=categoria)
    
    return ProdutoService.adicionar_produto(
        db, 
        produto_data,  
        file
    )

@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    nome: str = Form(...), 
    preco: float = Form(...), 
    categoria: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    produto_data = ProdutoCreate(nome=nome, preco=preco, categoria=categoria)
    
    return ProdutoService.atualizar_produto(
        db, 
        produto_id, 
        produto_data,  
        file
    )

@router.delete("/{produto_id}")
def remover_produto(produto_id: int, db: Session = Depends(get_db)):
    produto_removido = ProdutoService.remover_produto(db, produto_id)
    if not produto_removido:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"message": "Produto removido com sucesso"}
