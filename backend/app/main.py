from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.database.database import create_db_and_tables
from .routes.inscrito_router import router as inscritos_router
from .routes.familia_router import router as familias_router
from .models.familia import Familia
from .models.inscrito import Inscrito
from .models.prova import Prova
from .models.provas_familia import ProvasFamilia


@asynccontextmanager
async def lifespan(app: FastAPI):

    create_db_and_tables()
    yield  


app = FastAPI(lifespan=lifespan)


app.include_router(inscritos_router)
app.include_router(familias_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}