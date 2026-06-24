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