from fastapi import APIRouter, Depends, Security
from http import HTTPStatus
from sqlmodel import Session
from typing import List

from app.schemas.pontuacao_dto import PontuacaoPublic
from app.database.database import get_session
from app.services.pontuacao_services import *

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


router = APIRouter(prefix='/pontuacao', tags=['Pontuacoes'])


@router.post('/cadastrar', status_code=HTTPStatus.CREATED)
def cadastar_pontuacao(
    pontuacao: PontuacaoPublic, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return cadastrar_service(pontuacao, session)



@router.post('/sync', status_code=HTTPStatus.CREATED)
def cadastrar_varias_pontuacoes(
    pontuacoes: List[PontuacaoPublic], 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
    ):
    
    return cadastrar_varias_pontuacoes_service(pontuacoes, session)



@router.get('/historico/familia/{id}', status_code=HTTPStatus.OK)
def listar_historico_familia(
    id: int, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    
    return listar_historico_familia_service(id, session)



@router.get('/historico/prova/{id}', status_code=HTTPStatus.OK)
def listar_historico_prova(
    id: int, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return listar_historico_prova_service(id, session)



@router.get('/ranking', status_code=HTTPStatus.OK)
def ranking_geral(
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return ranking_geral_services(session)



@router.put('/editar', status_code=HTTPStatus.OK)
def editar_pontuacao(
    pontuacao: PontuacaoPublic, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return editar_pontuacao_services(pontuacao, session)



@router.delete('/apagar/{id}', status_code=HTTPStatus.OK)
def apagar_pontuacao(
    id: int, 
    session: Session = Depends(get_session),
    _token: str = Depends(verificar_api_key)
):
    return apagar_pontuacao_services(id, session)