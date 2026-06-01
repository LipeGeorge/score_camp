from fastapi import FastAPI
from .database.database import engine
from sqlmodel import SQLModel

from app.models.familia import Familia
from app.models.inscrito import Inscrito
from app.models.prova import Prova


from .routes.inscrito_router import router as inscritos_router


def lifespan(app: FastAPI):
    
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(inscritos_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}