from fastapi import File
from pydantic import ValidationError

from app.utils.colunas import colunas
from app.repository.inscrito_repository import salvarDados, buscarDados, buscar_dado_inscrito

import pandas as pd


def uploadInscritos(file, session):

    df = pd.read_csv(file)

    # df['rg_tratado'] = df[colunas['rg']].str.replace(r'\D', '', regex=True) # tratando RG
    
    df = df[[colunas['nome'], colunas['rg']]] # passo para dropar as outras colunas
    df = df.drop_duplicates(subset=colunas['rg'], keep=False)
    
    salvarDados(df, session)



def buscar_dados():    
    return buscarDados()



def buscar_inscrito(nome: str):
    
    inscritos = buscar_dado_inscrito(nome)
    return {'inscritos': inscritos}



def buscar_inscrito_id(id: int):
    
    inscrito = buscar_dado_inscrito(id)
    return {'inscrito': inscrito}
    
    # A lógica é que não vai retornar só os ids, mas todas as informações daquele inscrito.
    # Pra isso, já precisa mudar a base de dados, pois só estãos sendo salvos os nomes