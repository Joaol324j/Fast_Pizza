from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user_schema import UsuarioCreate
from app.services.user_service import UsuarioService
from app.utils.jwt import create_access_token
from app.configs.db import get_db

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/cadastro/")
def cadastrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        usuario_criado = UsuarioService.cadastrar_usuario(db, usuario)
        return {"msg": "Usuário criado com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login/")
def login_usuario(username_or_email: str, password: str, db: Session = Depends(get_db)):
    usuario = UsuarioService.login_usuario(db, username_or_email, password)
    if usuario is None:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    # Criando o token
    access_token = create_access_token(data={"sub": usuario.username})
    return {"access_token": access_token, "token_type": "bearer"}
