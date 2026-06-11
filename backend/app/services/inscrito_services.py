from fastapi import File
from sqlmodel import Session

from app.utils.colunas import colunas
from app.repository.inscrito_repository import salvarDados, buscarDados, buscar_inscrito_nome_db, buscar_inscrito_id_db, checkin

import pandas as pd


def uploadInscritos(file, session):

    df = pd.read_csv(file)

    # df['rg_tratado'] = df[colunas['rg']].str.replace(r'\D', '', regex=True) # tratando RG
    
    df = df[[colunas['nome'], colunas['rg']]] # passo para dropar as outras colunas
    df = df.drop_duplicates(subset=colunas['rg'], keep=False)
    
    salvarDados(df, session)



def buscar_dados(session: Session):    
    return buscarDados(session)



def buscar_inscrito_nome(nome: str, session: Session):
    
    inscritos = buscar_inscrito_nome_db(nome, session)
    return inscritos



def buscar_inscrito_id(id: int, session: Session):
    
    inscrito = buscar_inscrito_id_db(id, session)
    return inscrito
    


def check_in(id: int, session: Session):
    
    return checkin(id, session)