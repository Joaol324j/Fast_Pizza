from fastapi import FastAPI
from app.routes import menu_route

app = FastAPI(title="Pizza_API")

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(menu_route.router)
