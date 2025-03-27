from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from app.routes import menu_route, promotion_route, order_route,comment_route, user_route, reset_route
from app.configs.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pizza_API")

templates = Jinja2Templates(directory="app/templates")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(menu_route.router)
app.include_router(promotion_route.router)
app.include_router(order_route.router)
app.include_router(comment_route.router)
app.include_router(user_route.router)
app.include_router(reset_route.router)
