from sqlalchemy.orm import Session
from app.models.order_model import Pedido, PedidoProduto

class PedidoRepository:
    @staticmethod
    def create(db: Session, pedido: Pedido):
        """ Adiciona um novo pedido ao banco de dados """
        db.add(pedido)
        db.commit()
        db.refresh(pedido)
        return pedido

    @staticmethod
    def get_all(db: Session):
        """ Retorna todos os pedidos cadastrados """
        return db.query(Pedido).all()

    @staticmethod
    def get_by_id(db: Session, pedido_id: int):
        """ Busca um pedido pelo ID """
        return db.query(Pedido).filter(Pedido.id == pedido_id).first()

    @staticmethod
    def update_status(db: Session, pedido_id: int, novo_status: str):
        """ Atualiza o status de um pedido """
        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if pedido:
            pedido.status = novo_status
            db.commit()
            db.refresh(pedido)
        return pedido

    @staticmethod
    def delete(db: Session, pedido_id: int):
        """ Remove um pedido do banco de dados """
        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if pedido:
            db.delete(pedido)
            db.commit()
            return True
        return False
