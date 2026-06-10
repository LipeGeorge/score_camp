from fastapi import FastAPI
from .routes.inscrito_router import router as inscritos_router


app = FastAPI()


app.include_router(inscritos_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}