from sqlalchemy.orm import Session
from app.models.menu_model import Produto
from app.schemas.menu_schema import ProdutoCreate

class ProdutoRepository:
    @staticmethod
    def get_all(db: Session):
        """Retorna todos os produtos do cardápio"""
        return db.query(Produto).all()

    @staticmethod
    def get_by_id(db: Session, produto_id: int):
        """Busca um produto pelo ID"""
        return db.query(Produto).filter(Produto.id == produto_id).first()

    @staticmethod
    def create(db: Session, produto_data: ProdutoCreate):
        """Adiciona um novo produto ao cardápio"""
        produto = Produto(**produto_data.model_dump())
        db.add(produto)
        db.commit()
        db.refresh(produto)
        return produto

    @staticmethod
    def update(db: Session, produto_id: int, produto_data: ProdutoCreate):
        """Atualiza um produto existente"""
        produto = db.query(Produto).filter(Produto.id == produto_id).first()
        if produto:
            produto.nome = produto_data.nome
            produto.preco = produto_data.preco
            produto.categoria = produto_data.categoria
            db.commit()
            db.refresh(produto)
        return produto

    @staticmethod
    def delete(db: Session, produto_id: int):
        """Remove um produto do cardápio"""
        produto = db.query(Produto).filter(Produto.id == produto_id).first()
        if produto:
            db.delete(produto)
            db.commit()
        return produto
