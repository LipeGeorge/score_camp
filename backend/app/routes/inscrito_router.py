from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session
import pandas as pd
from data_example.colunas import colunas


router = APIRouter(prefix='/inscritos', tags=['Inscritos'])

@router.post('/upload')
def importar_participantes(file: UploadFile = File(...)):
    
    df = pd.read_csv(file.file)
    
    # TRATAMENTO DOS DADOS
    df['nome_tratado'] = df[colunas['nome']].str.split(' ')
    df['rg_tratado'] = df[colunas['rg']].str.replace(r'[^0-9]+', '', regex=True)
    df['idade'] = df[colunas['idade']].str.replace(r'[^0-9]+', '', regex=True)
    
    return {'message':'Dados Recebidos!'}