from fastapi import File
from pydantic import ValidationError

from app.utils.colunas import colunas
from app.schemas.inscrito_dto import InscritoCreateDTO
from app.repository.inscrito_repository import salvarDados, buscarDados

import pandas as pd
import io


def serviceInscritos(file) -> bool:

    df = pd.read_csv(file)

    df = tratamentoDados(df)
    dados_validados = validacaoDados(df)
    
    novos_inscritos = []
    duplicados = []
    
    for dado in dados_validados:
        
        novos_inscritos.append(dado)
        if not buscarDados:
            novos_inscritos.append(dado)
        
        else:
            duplicados.append(dado)
    
    
    if salvarDados(novos_inscritos):
        return True
    
    else:
        return False

def tratamentoDados(df):
    
    df['nome_tratado'] = df[colunas['nome']].str.split(' ')
    df['rg_tratado'] = df[colunas['rg']].str.replace(r'[^0-9]+', '', regex=True)
    df['idade'] = df[colunas['idade']].str.replace(r'[^0-9]+', '', regex=True)
        
    return df


def validacaoDados(df):
    
    dados = df.to_dict(orient='records')
    
    validados = []
    erros = []
    for index, linha in enumerate(dados):
        
        try:
            InscritoCreateDTO(**linha)
            validados.append(linha)
            
        except ValidationError as e:
            erros.append(f"{index + 2}" + ": CPF Inválido")
            validados.append(linha)
          
    return validados


def buscar_dados():
    
    return buscarDados()