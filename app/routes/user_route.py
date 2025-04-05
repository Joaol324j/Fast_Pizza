from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.schemas.user_schema import UsuarioCreate
from app.services.user_service import UsuarioService
from app.utils.jwt import create_access_token
from app.configs.db import get_db
from fastapi.security import OAuth2PasswordRequestForm
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/cadastro/")
def cadastrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        usuario_criado = UsuarioService.cadastrar_usuario(db, usuario)
        logger.info(f"Usuário criado com sucesso: {usuario.username}")
        return {"msg": "Usuário criado com sucesso"}
    except ValueError as e:
        logger.error(f"Erro ao cadastrar usuário: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login/")
def login_usuario(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    logger.info(f"Tentativa de login para usuário: {form_data.username}")
    
    usuario = UsuarioService.login_usuario(db, form_data.username, form_data.password)
    if usuario is None:
        logger.warning(f"Falha no login para usuário: {form_data.username}")
        raise HTTPException(
            status_code=401, 
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": usuario.username})
    logger.info(f"Login bem-sucedido para usuário: {usuario.username}")
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }
