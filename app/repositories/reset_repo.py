from sqlalchemy.orm import Session
from datetime import datetime
from app.models.reset_model import ResetToken
import secrets

class ResetTokenRepository:
    @staticmethod
    def create(db: Session, user_id: int):
        """ Gera e armazena um token de redefinição de senha """
        token = secrets.token_urlsafe(32)
        reset_token = ResetToken(user_id=user_id, token=token)
        db.add(reset_token)
        db.commit()
        db.refresh(reset_token)
        return reset_token

    @staticmethod
    def get_by_token(db: Session, token: str):
        """ Busca um token no banco """
        return db.query(ResetToken).filter(ResetToken.token == token).first()

    @staticmethod
    def delete(db: Session, token: str):
        """ Remove um token após o uso """
        db.query(ResetToken).filter(ResetToken.token == token).delete()
        db.commit()
