from fastapi import APIRouter, UploadFile, File
from app.services.inscrito_services import uploadInscritos, buscar_dados, buscar_inscrito

router = APIRouter(prefix='/inscritos', tags=['Inscritos'])


@router.post('/upload')
def importar_inscritos(file: UploadFile = File(...)):
    
    uploadInscritos(file.file)
    
    return {'message':'Dados Recebidos!'}



@router.get('/')
def buscar_todos_inscritos():
    
    return {'inscritos': buscar_dados()}
    


@router.get('/{nome}')
def buscar_inscrito_nome(nome: str):
    
    return buscar_inscrito(nome)