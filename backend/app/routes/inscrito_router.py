from http import HTTPStatus
from fastapi import APIRouter, Security, UploadFile, File
from app.services.inscrito_services import uploadInscritos, buscar_dados, buscar_inscrito_nome, buscar_inscrito_id, check_in, delete_services, atualizar_services
from fastapi import Depends, HTTPException
from sqlmodel import Session
from ..database.database import get_session
from ..schemas.inscrito_dto import InscritoPublic

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


router = APIRouter(
    prefix='/inscritos', 
    tags=['Inscritos'], 
    dependencies=[Depends(verificar_api_key)]
    )


@router.post('/upload', status_code=HTTPStatus.CREATED)
def importar_inscritos(
    file: UploadFile = File(...), 
    session: Session = Depends(get_session)
    ):
    
    uploadInscritos(file, session)
    return {'message':'Dados Recebidos!'}



@router.get('/', )
def buscar_todos_inscritos(session: Session = Depends(get_session)):
    
    return {'inscritos': buscar_dados(session)}
    


@router.get('/{nome}', status_code=HTTPStatus.OK)
def buscar_inscrito_por_nome(
    nome: str, 
    session: Session = Depends(get_session)
    ):
    
    return {'inscritos': buscar_inscrito_nome(nome, session)}



@router.get('/busca_por_id/{id}', status_code=HTTPStatus.OK)
def buscar_inscrito_por_id(
    id: int, 
    session: Session = Depends(get_session)
    ):
    
    return {'inscrito': buscar_inscrito_id(id, session)}



@router.patch('/checkin/{id}', status_code=HTTPStatus.OK)
def checkin_inscrito(
    id: int, 
    session: Session = Depends(get_session)
    ):
    
    return {'message': check_in(id, session)}



@router.delete('/deletar/{id}', status_code=HTTPStatus.OK)
def delete_inscrito(
    id: int, 
    session: Session = Depends(get_session)
    ):
    
    msg = delete_services(id, session)
    
    if 'sucesso' in msg:
        return {'message': msg}
    
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=msg)



@router.put('/atualizar/{id}', status_code=HTTPStatus.OK, response_model=InscritoPublic)
def atualizar_inscrito(
    id: int, 
    inscrito: InscritoPublic, 
    session: Session = Depends(get_session)
    ):

    ins = atualizar_services(id, inscrito, session)
    
    if ins:
        return ins
    
    raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail='Falha ao atualizar o inscrito')