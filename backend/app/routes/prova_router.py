from http import HTTPStatus
from typing import List
from fastapi import APIRouter
from ..schemas.prova_dto import ProvaPublic
from sqlmodel import Session
from fastapi import Depends
from ..database.database import get_session
from ..services.prova_services import *
from ..models.prova import Prova


router = APIRouter(prefix='/provas', tags=['Provas'])



@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastrar_prova(prova: ProvaPublic, session: Session = Depends(get_session)):
    
    return cadastrar_services(prova, session)



@router.get('/listar', status_code=HTTPStatus.OK, response_model=List[Prova])
def listar_provas(session: Session = Depends(get_session)):
    
    return listar_services(session)



@router.put('/atualizar/{id}', status_code=HTTPStatus.OK, response_model=Prova)
def atualizar_prova(id: int, prova: ProvaPublic, session: Session = Depends(get_session)):
    
    return atualizar_sevices(id, prova, session)



@router.delete('/apagar/{id}', status_code=HTTPStatus.OK)
def apagar_prova(id: int, session: Session = Depends(get_session)):
    
    return apagar_services(id, session)