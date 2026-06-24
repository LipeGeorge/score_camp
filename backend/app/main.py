from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.database.database import create_db_and_tables
from app.routes.inscrito_router import router as inscritos_router
from app.routes.familia_router import router as familias_router
from app.routes.prova_router import router as provas_router
from app.models.familia import Familia
from app.models.inscrito import Inscrito
from app.models.prova import Prova
from app.models.pontuacao import Pontuacao


@asynccontextmanager
async def lifespan(app: FastAPI):

    create_db_and_tables()
    yield  


app = FastAPI(lifespan=lifespan)


app.include_router(inscritos_router)
app.include_router(familias_router)
app.include_router(provas_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}