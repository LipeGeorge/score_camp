from fastapi import APIRouter, HTTPException
from http import HTTPStatus
from fastapi import Depends
from sqlmodel import Session
from ..database.database import get_session
from ..services.familia_services import *
from ..models.familia import Familia
from typing import List


router = APIRouter(prefix='/familia', tags=['Familias'])


@router.get('/', status_code=HTTPStatus.OK, response_model=List[Familia])
def listar_familias(session: Session = Depends(get_session)):
    return listar_familias_services(session)



@router.get('/listar_por_id/{id}', status_code=HTTPStatus.OK, response_model=Familia)
def listar_familias_por_id(id: int, session: Session = Depends(get_session)):
    return listar_familias_por_id_services(id, session)



@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastrar_familia(familia: FamiliaPublic, session: Session = Depends(get_session)):
    return cadastrar_familia_services(familia, session)



@router.put('/atualizar/{id}', status_code=HTTPStatus.OK, response_model=Familia)
def atualizar_familia(id: int, familia: FamiliaPublic, session: Session = Depends(get_session)):    
    return atualizar_familia_services(id, familia, session)



@router.delete('/apagar/{id}', status_code=HTTPStatus.OK)
def deletar_familia(id: int, session: Session = Depends(get_session)):
    
    msg = deletar_familia_services(id, session)
    
    if 'sucesso' in msg:
        return {'message': msg}
    
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=msg)