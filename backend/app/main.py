from fastapi import FastAPI
from .database.database import engine
from contextlib import contextmanager
from sqlmodel import SQLModel


from .routes.participante_router import router as participantes_router


def lifespan(app: FastAPI):
    
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(participantes_router)


@app.get('/')
def status():
    return {'Status':'ScoreCamp is online!'}