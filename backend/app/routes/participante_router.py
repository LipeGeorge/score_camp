from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session
import pandas as pd
from data_example.colunas import colunas


router = APIRouter(prefix='/participantes', tags=['Participante'])

@router.post('/upload')
def importar_participantes(file: UploadFile = File(...)):
    
    df = pd.read_csv(file.file)
    
    # TRATAMENTO DOS DADOS
    
    # nome
    df['nome_tratado'] = df[colunas['nome']].str.split(' ')
    
    # rg
    df['rg_tratado'] = df[colunas['rg']].str.replace(r'[^0-9]+', '', regex=True)
    
    # idade
    df['idade'] = df[colunas['idade']].str.replace(r'[^0-9]+', '', regex=True)
    
    return {'idade':df['idade']}