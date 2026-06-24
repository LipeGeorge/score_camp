from ..models.prova import Prova
from sqlmodel import Session
from ..repository.prova_repository import *
from fastapi import HTTPException
from http import HTTPStatus
from ..schemas.prova_dto import ProvaPublic



def cadastrar_services(prova: Prova, session: Session):
    
    msg = cadastrar_repository(prova, session)
    
    if 'sucesso' in msg:
        return {'message': msg}
    
    raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, details=msg)



def listar_services(session: Session):
    
    provas = listar_repository(session)
    
    return provas



def atualizar_sevices(id: int, prova: ProvaPublic, session: Session):
    
    p = Prova(
        id=id,
        nome=prova.nome,
        teto=prova.teto
    )
    
    prova_db = atualizar_repository(p, session)
    
    return prova_db