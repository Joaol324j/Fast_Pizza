from sqlalchemy.orm import Session
from app.models.comment_model import ComentarioProduto

class ComentarioProdutoRepository:
    @staticmethod
    def create(db: Session, comentario: ComentarioProduto):
        """ Cria um novo comentário para um produto """
        db.add(comentario)
        db.commit()
        db.refresh(comentario)
        return comentario

    @staticmethod
    def get_by_produto_id(db: Session, produto_id: int):
        """ Retorna os comentários de um produto """
        return db.query(ComentarioProduto).filter(ComentarioProduto.produto_id == produto_id).all()

    @staticmethod
    def update(db: Session, comentario_id: int, texto: str, nota: int):
        """ Atualiza um comentário existente """
        comentario = db.query(ComentarioProduto).filter(ComentarioProduto.id == comentario_id).first()
        if comentario:
            comentario.texto = texto
            comentario.nota = nota
            db.commit()
            db.refresh(comentario)
        return comentario

    @staticmethod
    def delete(db: Session, comentario_id: int):
        """ Remove um comentário do banco de dados """
        comentario = db.query(ComentarioProduto).filter(ComentarioProduto.id == comentario_id).first()
        if comentario:
            db.delete(comentario)
            db.commit()
            return True
        return False
