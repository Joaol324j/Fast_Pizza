from sqlalchemy.orm import Session
from app.models.menu_model import Produto
from app.schemas.menu_schema import ProdutoCreate
import os
import shutil
from fastapi import UploadFile

class ProdutoRepository:
    @staticmethod
    def create(db: Session, produto_data: ProdutoCreate, file: UploadFile = None):
        file_path = f"uploads/{file.filename}"

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        if file:
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())

        produto = Produto(
            nome=produto_data.nome,
            preco=produto_data.preco,
            categoria=produto_data.categoria,
            imagem=file_path if file else None 
        )
        
        db.add(produto)
        db.commit()
        db.refresh(produto)
        return produto
