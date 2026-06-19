from fastapi import APIRouter
from http import HTTPStatus
from fastapi import Depends
from sqlmodel import Session
from ..database.database import get_session
from ..services.familia_services import *
from ..schemas.familia_dto import FamiliaPublic
from typing import List


router = APIRouter(prefix='/familia', tags=['Familias'])


@router.get('/', status_code=HTTPStatus.OK, response_model=List[FamiliaPublic])
def listar_familias(session: Session = Depends(get_session)):
    return listar_familias_services(session)



@router.get('/listar_por_id/{id}', status_code=HTTPStatus.OK, response_model=FamiliaPublic)
def listar_familias_por_id(id: int, session: Session = Depends(get_session)):
    return listar_familias_por_id_services(id, session)



@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastrar_familia(familia: FamiliaPublic, session: Session = Depends(get_session)):
    return cadastrar_familia_services(familia, session)



@router.put('/atualizar/{id}', status_code=HTTPStatus.OK, response_model=FamiliaPublic)
def atualizar_familia(id: int, familia: FamiliaPublic, session: Session = Depends(get_session)):    
    return atualizar_familia_services(id, familia, session)