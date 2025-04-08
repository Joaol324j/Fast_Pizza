from sqlalchemy.orm import Session
from app.repositories.order_repo import PedidoRepository
from app.repositories.menu_repo import ProdutoRepository
from app.models.order_model import Pedido, PedidoProduto
from app.schemas.order_schema import PedidoCreate

class PedidoService:
    @staticmethod
    def criar_pedido(db: Session, pedido_data: PedidoCreate):
        """ Cria um novo pedido com os produtos selecionados e aplica descontos """
        novo_pedido = Pedido()
        novo_pedido = PedidoRepository.create(db, novo_pedido)

        total_pedido = 0.0

        for item in pedido_data.produtos:
            produto = ProdutoRepository.get_by_id(db, item.produto_id)
            if not produto:
                raise ValueError(f"Produto com ID {item.produto_id} não encontrado.")

            preco_final = produto.preco
            if produto.promocoes:
                promocao = produto.promocoes[0] 
                preco_final = PedidoService.aplicar_desconto(produto.preco, promocao)

            pedido_produto = PedidoProduto(
                pedido_id=novo_pedido.id,
                produto_id=item.produto_id,
                quantidade=item.quantidade,
                preco_unitario=preco_final
            )
            db.add(pedido_produto)
            total_pedido += preco_final * item.quantidade

        novo_pedido.total = total_pedido
        db.commit()
        db.refresh(novo_pedido)

        return novo_pedido

    @staticmethod
    def aplicar_desconto(preco_original: float, promocao) -> float:
        """ Calcula o preço com desconto """
        if promocao.tipo_desconto == "percentual":
            return preco_original * (1 - (promocao.valor_desconto / 100))
        elif promocao.tipo_desconto == "fixo":
            return preco_original - promocao.valor_desconto
        return preco_original

    @staticmethod
    def listar_pedidos(db: Session):
        return PedidoRepository.get_all(db)

    @staticmethod
    def buscar_pedido(db: Session, pedido_id: int):
        return PedidoRepository.get_by_id(db, pedido_id)

    @staticmethod
    def atualizar_status_pedido(db: Session, pedido_id: int, novo_status: str):
        return PedidoRepository.update_status(db, pedido_id, novo_status)

    @staticmethod
    def deletar_pedido(db: Session, pedido_id: int):
        return PedidoRepository.delete(db, pedido_id)
