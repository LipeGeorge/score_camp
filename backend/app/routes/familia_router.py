from fastapi import APIRouter, HTTPException, Security
from http import HTTPStatus
from fastapi import Depends, Header
from fastapi.params import Security
from sqlmodel import Session
from ..database.database import get_session
from ..services.familia_services import *
from ..models.familia import Familia
from typing import List

from fastapi.security import APIKeyHeader
import os

X_API_KEY_HEADER = APIKeyHeader(name='X_API_KEY_BACKEND')
X_API_KEY_BACKEND = os.getenv('X_API_KEY_BACKEND')

def verificar_api_key(api_key: str = Security(X_API_KEY_HEADER)):
    
    if api_key != X_API_KEY_BACKEND:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, 
            detail="Chave inválida."
        )
    return api_key


router = APIRouter(prefix='/familia', tags=['Familias'])


@router.get('/', status_code=HTTPStatus.OK, response_model=List[Familia])
def listar_familias(
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return listar_familias_services(session)



@router.get('/listar_por_id/{id}', status_code=HTTPStatus.OK, response_model=Familia)
def listar_familias_por_id(
    id: int, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return listar_familias_por_id_services(id, session)



@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastrar_familia(
    familia: FamiliaPublic, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return cadastrar_familia_services(familia, session)



@router.put('/atualizar/{id}', status_code=HTTPStatus.OK, response_model=Familia)
def atualizar_familia(
    id: int, 
    familia: FamiliaPublic, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):    
    return atualizar_familia_services(id, familia, session)



@router.delete('/apagar/{id}', status_code=HTTPStatus.OK)
def deletar_familia(
    id: int, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    
    msg = deletar_familia_services(id, session)
    
    if 'sucesso' in msg:
        return {'message': msg}
    
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=msg)