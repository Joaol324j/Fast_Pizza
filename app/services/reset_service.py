from sqlalchemy.orm import Session
from datetime import datetime
from app.repositories.user_repo import UsuarioRepository
from app.repositories.reset_repo import ResetTokenRepository
from app.utils.security import hash_password
from app.utils.email import send_email

class PasswordResetService:
    @staticmethod
    def solicitar_recuperacao_senha(db: Session, email: str):
        """ Envia um email com o token de redefinição de senha """
        usuario = UsuarioRepository.get_by_email(db, email)
        if not usuario:
            return {"msg": "Se o email existir, um link de recuperação será enviado"}

        reset_token = ResetTokenRepository.create(db, usuario.id)
        link = f"http://localhost:8000/reset-password/{reset_token.token}"
        send_email(email, "Recuperação de Senha", f"Clique no link para redefinir sua senha: {link}")

        return {"msg": "Se o email existir, um link de recuperação será enviado"}

    @staticmethod
    def redefinir_senha(db: Session, token: str, nova_senha: str):
        """ Valida o token e redefine a senha """
        reset_token = ResetTokenRepository.get_by_token(db, token)
        
        if not reset_token:
            return {"erro": "Token inválido ou não encontrado"}

        if reset_token.expires_at < datetime.utcnow():
            return {"erro": "Token expirado"}

        print(f"Token encontrado: {reset_token}, User ID: {reset_token.user_id}")

        usuario = UsuarioRepository.get_by_id(db, reset_token.user_id)  
        
        if not usuario:
            return {"erro": "Usuário não encontrado"}

        usuario.hashed_password = hash_password(nova_senha)
        db.commit()

        ResetTokenRepository.delete(db, token)
        return {"msg": "Senha redefinida com sucesso"}
