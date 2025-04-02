from sqlalchemy.orm import Session
from app.models.menu_model import Produto
from app.schemas.menu_schema import ProdutoCreate
import os
import shutil
from fastapi import UploadFile

class ProdutoRepository:
    @staticmethod
    def create(db: Session, produto_data: ProdutoCreate, file: UploadFile = None):
        file_path = None
        if file:
            file_path = f"uploads/{file.filename}"
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())

        produto = Produto(
            nome=produto_data.nome,
            preco=produto_data.preco,
            categoria=produto_data.categoria,
            descricao=produto_data.descricao,
            imagem=file_path
        )
        
        db.add(produto)
        db.commit()
        db.refresh(produto)
        return produto

    @staticmethod
    def get_all(db: Session):
        return db.query(Produto).all()

    @staticmethod
    def get_by_id(db: Session, produto_id: int):
        return db.query(Produto).filter(Produto.id == produto_id).first()

    @staticmethod
    def update(db: Session, produto_id: int, produto_data: ProdutoCreate, file: UploadFile = None):
        produto = ProdutoRepository.get_by_id(db, produto_id)
        if not produto:
            return None

        file_path = produto.imagem
        if file:
            if produto.imagem and os.path.exists(produto.imagem):
                os.remove(produto.imagem)
            
            file_path = f"uploads/{file.filename}"
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())

        produto.nome = produto_data.nome
        produto.preco = produto_data.preco
        produto.categoria = produto_data.categoria
        produto.descricao = produto_data.descricao
        produto.imagem = file_path

        db.commit()
        db.refresh(produto)
        return produto

    @staticmethod
    def delete(db: Session, produto_id: int):
        produto = ProdutoRepository.get_by_id(db, produto_id)
        if not produto:
            return None

        if produto.imagem and os.path.exists(produto.imagem):
            os.remove(produto.imagem)

        db.delete(produto)
        db.commit()
        return produto
