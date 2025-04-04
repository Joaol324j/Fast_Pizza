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
        if file and file.filename:
            os.makedirs("uploads", exist_ok=True)
            
            produto = Produto(
                nome=produto_data.nome,
                preco=produto_data.preco,
                categoria=produto_data.categoria,
                descricao=produto_data.descricao,
                imagem=None
            )
            
            db.add(produto)
            db.flush() 
            
            filename = f"{produto.id}_{file.filename}"
            file_path = os.path.join("uploads", filename)
            
            try:
                with open(file_path, "wb") as buffer:
                    content = file.file.read()
                    if content:
                        buffer.write(content)
                    else:
                        file_path = None
            except Exception as e:
                print(f"Error saving file: {e}")
                file_path = None
                
            produto.imagem = file_path
            
        else:
            produto = Produto(
                nome=produto_data.nome,
                preco=produto_data.preco,
                categoria=produto_data.categoria,
                descricao=produto_data.descricao,
                imagem=None
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
        if file and file.filename:
            if produto.imagem and os.path.exists(produto.imagem):
                os.remove(produto.imagem)
            
            os.makedirs("uploads", exist_ok=True)
            
            filename = f"{produto_id}_{file.filename}"
            file_path = os.path.join("uploads", filename)
            
            try:
                with open(file_path, "wb") as buffer:
                    content = file.file.read()
                    if content:
                        buffer.write(content)
                    else:
                        file_path = produto.imagem
            except Exception as e:
                print(f"Error saving file: {e}")
                file_path = produto.imagem

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
