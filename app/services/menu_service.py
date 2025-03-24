from sqlalchemy.orm import Session
from app.repositories.menu_repo import ProdutoRepository
from app.schemas.menu_schema import ProdutoCreate

class ProdutoService:
    @staticmethod
    def listar_produtos(db: Session):
        return ProdutoRepository.get_all(db)

    @staticmethod
    def buscar_produto(db: Session, produto_id: int):
        return ProdutoRepository.get_by_id(db, produto_id)

    @staticmethod
    def adicionar_produto(db: Session, produto_data: ProdutoCreate):
        return ProdutoRepository.create(db, produto_data)

    @staticmethod
    def atualizar_produto(db: Session, produto_id: int, produto_data: ProdutoCreate):
        return ProdutoRepository.update(db, produto_id, produto_data)

    @staticmethod
    def remover_produto(db: Session, produto_id: int):
        return ProdutoRepository.delete(db, produto_id)
