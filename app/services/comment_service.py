from sqlalchemy.orm import Session
from app.repositories.comment_repo import ComentarioProdutoRepository
from app.repositories.menu_repo import ProdutoRepository
from app.models.comment_model import ComentarioProduto
from app.schemas.comment_schema import ComentarioProdutoCreate

class ComentarioProdutoService:
    @staticmethod
    def criar_comentario(db: Session, comentario_data: ComentarioProdutoCreate):
        """ Cria um comentário para um produto existente """
        produto = ProdutoRepository.get_by_id(db, comentario_data.produto_id)
        if not produto:
            raise ValueError("Produto não encontrado")

        comentario = ComentarioProduto(
            produto_id=comentario_data.produto_id,
            texto=comentario_data.texto,
            nota=comentario_data.nota
        )
        return ComentarioProdutoRepository.create(db, comentario)

    @staticmethod
    def listar_comentarios(db: Session, produto_id: int):
        """ Lista os comentários de um produto """
        return ComentarioProdutoRepository.get_by_produto_id(db, produto_id)

    @staticmethod
    def atualizar_comentario(db: Session, comentario_id: int, texto: str, nota: int):
        """ Atualiza um comentário existente """
        return ComentarioProdutoRepository.update(db, comentario_id, texto, nota)

    @staticmethod
    def deletar_comentario(db: Session, comentario_id: int):
        """ Deleta um comentário """
        return ComentarioProdutoRepository.delete(db, comentario_id)
