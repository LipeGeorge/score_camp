from http import HTTPStatus
from fastapi import APIRouter, UploadFile, File
from app.services.inscrito_services import uploadInscritos, buscar_dados, buscar_inscrito_nome, buscar_inscrito_id, check_in
from fastapi import Depends
from sqlmodel import Session
from ..database.database import get_session


router = APIRouter(prefix='/inscritos', tags=['Inscritos'])


@router.post('/upload', status_code=HTTPStatus.CREATED)
def importar_inscritos(file: UploadFile = File(...), session: Session = Depends(get_session)):
    
    uploadInscritos(file.file, session)
    return {'message':'Dados Recebidos!'}



@router.get('/')
def buscar_todos_inscritos(session: Session = Depends(get_session)):
    
    return {'inscritos': buscar_dados(session)}
    


@router.get('/{nome}')
def buscar_inscrito_por_nome(nome: str, session: Session = Depends(get_session)):
    
    return {'inscritos': buscar_inscrito_nome(nome, session)}



@router.get('/busca_por_id/{id}')
def buscar_inscrito_por_id(id: int, session: Session = Depends(get_session)):
    
    return {'inscrito': buscar_inscrito_id(id, session)}



@router.patch('/checkin/{id}')
def checkin_inscrito(id: int, session: Session = Depends(get_session)):
    
    return {'message': check_in(id, session)}