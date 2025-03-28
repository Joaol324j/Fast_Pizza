from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.reset_service import PasswordResetService
from app.configs.db import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/reset", tags=["Reset"])

@router.post("/solicitar-recuperacao/")
def solicitar_recuperacao(email: str, db: Session = Depends(get_db)):
    return PasswordResetService.solicitar_recuperacao_senha(db, email)

class ResetSenhaRequest(BaseModel):
    nova_senha: str

@router.post("/resetar-senha/{token}")
def resetar_senha(token: str, reset_data: ResetSenhaRequest, db: Session = Depends(get_db)):
    nova_senha = reset_data.nova_senha
    resultado = PasswordResetService.redefinir_senha(db, token, nova_senha)
    if "erro" in resultado:
        raise HTTPException(status_code=400, detail=resultado["erro"])
    return resultado