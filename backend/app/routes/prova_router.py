from http import HTTPStatus
from fastapi import APIRouter
from ..schemas.prova_dto import ProvaPublic
from sqlmodel import Session
from fastapi import Depends
from ..database.database import get_session
from ..services.prova_services import *


router = APIRouter(prefix='/provas', tags=['Provas'])



@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastrar_prova(prova: ProvaPublic, session: Session = Depends(get_session)):
    
    return cadastrar_services(prova, session)