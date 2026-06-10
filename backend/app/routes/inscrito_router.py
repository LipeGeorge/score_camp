from http import HTTPStatus
from fastapi import APIRouter, UploadFile, File
from app.services.inscrito_services import uploadInscritos, buscar_dados, buscar_inscrito, buscar_inscrito_id
from fastapi import Depends
from sqlmodel import Session
from ..database.database import get_session


router = APIRouter(prefix='/inscritos', tags=['Inscritos'])


@router.post('/upload', status_code=HTTPStatus.CREATED)
def importar_inscritos(file: UploadFile = File(...), session: Session = Depends(get_session)):
    
    uploadInscritos(file.file, session)
    return {'message':'Dados Recebidos!'}



@router.get('/')
def buscar_todos_inscritos():
    
    return {'inscritos': buscar_dados()}
    


@router.get('/{nome}')
def buscar_inscrito_nome(nome: str):
    
    return buscar_inscrito(nome)



@router.get('/{id}')
def buscar_inscrito_id(id: int):
    
    return buscar_inscrito_id(id)

@router.patch('/checkin/{id}')
def checkin_inscrito(id: int):
    # identificar inscrito
    # marcar checkin
    # retornar mensagem de sucesso
    ...