from sqlalchemy.orm import Session
from app.models.promotion_model import Promocao
from app.schemas.promotion_schema import PromocaoCreate

class PromocaoRepository:
    @staticmethod
    def get_all(db: Session):
        """Retorna todas as promoções"""
        return db.query(Promocao).all()

    @staticmethod
    def get_by_id(db: Session, promocao_id: int):
        """Busca uma promoção pelo ID"""
        return db.query(Promocao).filter(Promocao.id == promocao_id).first()

    @staticmethod
    def create(db: Session, promocao_data: PromocaoCreate):
        """Cria uma nova promoção"""
        promocao = Promocao(**promocao_data.dict())
        db.add(promocao)
        db.commit()
        db.refresh(promocao)
        return promocao

    @staticmethod
    def update(db: Session, promocao_id: int, promocao_data: PromocaoCreate):
        """Atualiza uma promoção existente"""
        promocao = db.query(Promocao).filter(Promocao.id == promocao_id).first()
        if promocao:
            promocao.descricao = promocao_data.descricao
            promocao.tipo_desconto = promocao_data.tipo_desconto
            promocao.valor_desconto = promocao_data.valor_desconto
            promocao.produto_id = promocao_data.produto_id
            db.commit()
            db.refresh(promocao)
        return promocao

    @staticmethod
    def delete(db: Session, promocao_id: int):
        """Remove uma promoção"""
        promocao = db.query(Promocao).filter(Promocao.id == promocao_id).first()
        if promocao:
            db.delete(promocao)
            db.commit()
        return promocao
