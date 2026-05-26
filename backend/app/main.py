from fastapi import FastAPI
from .database.database import engine
from sqlmodel import SQLModel

from app.models.familia import Familia
from app.models.participante import Participante
from app.models.prova import Prova


from .routes.participante_router import router as participantes_router

# print("TABELAS DETECTADAS NA MEMÓRIA:", list(SQLModel.metadata.tables.keys()))


def lifespan(app: FastAPI):
    
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(participantes_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}