from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session
import pandas as pd


router = APIRouter(prefix='/participantes', tags=['Participante'])

@router.post('/upload')
def importar_participantes(file: UploadFile = File(...)):
    
    df = pd.read_csv(file.file)
    
    # tratando nome
    df['nome_tratado'] = df['Nome'].str.split(' ')
    
    # tratando cpf
    df['cpf_tratado'] = df['CPF'].str.replace(r'[.; ]+', '', regex=True)
    
    
    return {"nomes":df['nome_tratado'].head(2)}