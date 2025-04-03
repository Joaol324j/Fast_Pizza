from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from app.routes import menu_route, promotion_route, order_route, comment_route, user_route, reset_route
from app.configs.db import Base, engine
import os

Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Pizza_API")

templates = Jinja2Templates(directory="app/templates")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/menu", response_class=HTMLResponse)
async def read_menu(request: Request):
    return templates.TemplateResponse("menu.html", {"request": request})

@app.get("/pedidos", response_class=HTMLResponse)
async def read_pedidos(request: Request):
    return templates.TemplateResponse("pedidos.html", {"request": request})

@app.get("/promocoes", response_class=HTMLResponse)
async def read_promocoes(request: Request):
    return templates.TemplateResponse("promocoes.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def read_register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/forgot", response_class=HTMLResponse)
async def read_forgot(request: Request):
    return templates.TemplateResponse("forgot.html", {"request": request})

@app.get("/reset-password/{token}")
async def home(request: Request, token: str):
    return templates.TemplateResponse("reset.html", {"request": request, "token": token})

app.include_router(menu_route.router)
app.include_router(promotion_route.router)
app.include_router(order_route.router)
app.include_router(comment_route.router)
app.include_router(user_route.router)
app.include_router(reset_route.router)
