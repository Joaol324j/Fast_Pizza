from fastapi import FastAPI
from app.routes import menu_route, promotion_route, order_route,comment_route, user_route
from app.configs.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pizza_API")

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(menu_route.router)
app.include_router(promotion_route.router)
app.include_router(order_route.router)
app.include_router(comment_route.router)
app.include_router(user_route.router)
