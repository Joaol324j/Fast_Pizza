from fastapi import FastAPI

app = FastAPI(title="Pizza_API")

@app.get("/")
def read_root():
    return {"Hello": "World"}
