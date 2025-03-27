from sqlalchemy.orm import Session
from app.repositories.user_repo import UsuarioRepository
from app.schemas.user_schema import UsuarioCreate
from app.utils.security import verify_password

class UsuarioService:
    @staticmethod
    def cadastrar_usuario(db: Session, usuario_data: UsuarioCreate):
        """ Cria um novo usuário """
        existing_user_by_username = UsuarioRepository.get_by_username(db, usuario_data.username)
        existing_user_by_email = UsuarioRepository.get_by_email(db, usuario_data.email)

        if existing_user_by_username:
            raise ValueError("Nome de usuário já existe")
        if existing_user_by_email:
            raise ValueError("Email já está em uso")
        
        return UsuarioRepository.create(db, usuario_data.dict())

    @staticmethod
    def login_usuario(db: Session, username_or_email: str, password: str):
        """ Faz login e retorna o usuário se a senha estiver correta """
        return UsuarioRepository.verify_password(db, username_or_email, password)
