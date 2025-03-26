from sqlalchemy.orm import Session
from app.models.user_model import Usuario
from app.utils.security import hash_password, verify_password

class UsuarioRepository:
    @staticmethod
    def create(db: Session, usuario_data: dict):
        """ Cria um novo usuário """
        hashed_password = hash_password(usuario_data['password'])
        usuario = Usuario(
            username=usuario_data['username'],
            email=usuario_data['email'],
            hashed_password=hashed_password
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        return usuario

    @staticmethod
    def get_by_username(db: Session, username: str):
        """ Busca um usuário pelo nome de usuário """
        return db.query(Usuario).filter(Usuario.username == str(username)).first()


    @staticmethod
    def get_by_email(db: Session, email: str):
        """ Busca um usuário pelo email """
        return db.query(Usuario).filter(Usuario.email == email).first()

    @staticmethod
    def verify_password(db: Session, username_or_email: str, password: str):
        """ Verifica se a senha está correta com base no username ou email """
        usuario = db.query(Usuario).filter(
            (Usuario.username == username_or_email) | (Usuario.email == username_or_email)
        ).first()
        if usuario and verify_password(password, usuario.hashed_password):
            return usuario
        return None
