from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.comment_schema import ComentarioProdutoCreate, ComentarioProdutoResponse
from app.services.comment_service import ComentarioProdutoService
from app.configs.db import get_db

router = APIRouter(prefix="/comentarios", tags=["Comentários"])

@router.post("/comentarios/", response_model=ComentarioProdutoResponse)
def criar_comentario(comentario: ComentarioProdutoCreate, db: Session = Depends(get_db)):
    try:
        return ComentarioProdutoService.criar_comentario(db, comentario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/comentarios/{produto_id}/", response_model=list[ComentarioProdutoResponse])
def listar_comentarios(produto_id: int, db: Session = Depends(get_db)):
    return ComentarioProdutoService.listar_comentarios(db, produto_id)

@router.put("/comentarios/{comentario_id}/", response_model=ComentarioProdutoResponse)
def atualizar_comentario(comentario_id: int, texto: str, nota: int, db: Session = Depends(get_db)):
    return ComentarioProdutoService.atualizar_comentario(db, comentario_id, texto, nota)

@router.delete("/comentarios/{comentario_id}/", status_code=204)
def deletar_comentario(comentario_id: int, db: Session = Depends(get_db)):
    result = ComentarioProdutoService.deletar_comentario(db, comentario_id)
    if not result:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")
    return {"detail": "Comentário deletado com sucesso"}
