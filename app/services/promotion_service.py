from sqlalchemy.orm import Session
from app.repositories.promotion_repo import PromocaoRepository
from app.repositories.menu_repo import ProdutoRepository
from app.schemas.promotion_schema import PromocaoCreate
from app.models.menu_model import Produto
from app.models.promotion_model import Promocao

class PromocaoService:
    @staticmethod
    def listar_promocoes(db: Session):
        return PromocaoRepository.get_all(db)

    @staticmethod
    def buscar_promocao(db: Session, promocao_id: int):
        return PromocaoRepository.get_by_id(db, promocao_id)

    @staticmethod
    def adicionar_promocao(db: Session, promocao_data: PromocaoCreate):
        promocao = PromocaoRepository.create(db, promocao_data)
        
        # Aplicando o desconto ao produto
        if promocao.produto_id:
            produto = ProdutoRepository.get_by_id(db, promocao.produto_id)
            if produto:
                preco_com_desconto = PromocaoService.aplicar_desconto(produto.preco, promocao)
                produto.preco = preco_com_desconto
                db.commit()
                db.refresh(produto)
        return promocao

    @staticmethod
    def aplicar_desconto(preco_original: float, promocao: Promocao) -> float:
        """Calcula o preço do produto com o desconto"""
        if promocao.tipo_desconto == "percentual":
            desconto = preco_original * (promocao.valor_desconto / 100)
            return preco_original - desconto
        elif promocao.tipo_desconto == "fixo":
            return preco_original - promocao.valor_desconto
        return preco_original

    @staticmethod
    def atualizar_promocao(db: Session, promocao_id: int, promocao_data: PromocaoCreate):
        promocao_atualizada = PromocaoRepository.update(db, promocao_id, promocao_data)
        
        # Atualizando o preço do produto após a mudança na promoção
        if promocao_atualizada and promocao_atualizada.produto_id:
            produto = ProdutoRepository.get_by_id(db, promocao_atualizada.produto_id)
            if produto:
                preco_com_desconto = PromocaoService.aplicar_desconto(produto.preco, promocao_atualizada)
                produto.preco = preco_com_desconto
                db.commit()
                db.refresh(produto)
        return promocao_atualizada

    @staticmethod
    def remover_promocao(db: Session, promocao_id: int):
        promocao_removida = PromocaoRepository.delete(db, promocao_id)
        
        if promocao_removida and promocao_removida.produto_id:
            produto = ProdutoRepository.get_by_id(db, promocao_removida.produto_id)
            if produto:
                produto.preco = produto.preco + promocao_removida.valor_desconto if promocao_removida.tipo_desconto == "fixo" else produto.preco
                db.commit()
                db.refresh(produto)
        return promocao_removida
