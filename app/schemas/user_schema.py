from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UsuarioResponse(BaseModel):
    username: str
    email: str

    class Config:
        orm_mode = True
