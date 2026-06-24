from ..models.prova import Prova
from sqlmodel import Session
from ..repository.prova_repository import *
from fastapi import HTTPException
from http import HTTPStatus



def cadastrar_services(prova: Prova, session: Session):
    
    msg = cadastrar_repository(prova, session)
    
    if 'sucesso' in msg:
        return {'message': msg}
    
    raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, details=msg)