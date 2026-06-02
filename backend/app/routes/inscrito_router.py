from fastapi import APIRouter, UploadFile, File
from app.services.inscrito_services import serviceInscritos, buscar_dados


router = APIRouter(prefix='/inscritos', tags=['Inscritos'])

@router.post('/upload')
def importar_inscritos(file: UploadFile = File(...)):
        
    serviceInscritos(file.file)
    
    return {'message':'Dados Recebidos!'}



@router.get('/inscritos')
def buscar_todos_inscritos():
    
    return {'inscritos': buscar_dados()}
        


@router.get('/inscritos/{nome}')
def buscar_todos_inscritos():
    ...