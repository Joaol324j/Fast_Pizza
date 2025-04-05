from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Union
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = "b2b0f6599f1e432c85e8d00066d8ee4b9c99a3d524f76c03d6e7fdb45c705d89"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    """ Gera um token JWT de acesso """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Token gerado com sucesso para usuário: {data.get('sub', 'unknown')}")
    return encoded_jwt

def verify_token(token: str):
    """ Verifica e decodifica o token JWT """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            logger.warning("Token sem campo 'sub'")
            return None
        logger.info(f"Token válido para usuário: {username}")
        return payload
    except JWTError as e:
        logger.error(f"Erro ao verificar token: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Exceção não esperada ao verificar token: {str(e)}")
        return None
