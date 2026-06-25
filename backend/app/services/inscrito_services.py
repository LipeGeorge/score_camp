from fastapi import File, HTTPException
from sqlmodel import Session

from app.models.inscrito import Inscrito
from app.schemas.familia_dto import FamiliaCreateDTO
from app.schemas.inscrito_dto import InscritoPublic
from app.utils.colunas import colunas
from app.repository.inscrito_repository import salvarDados, buscarDados, buscar_inscrito_nome_db, buscar_inscrito_id_db, checkin, delete_repository, atualizar_repository
from ..repository.familia_repository import listar_familias_repository

import pandas as pd
import random


def uploadInscritos(file, session):
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Formato não suportado. Envie .csv ou .xlsx")

        
        df.columns = [str(col).strip().lower() for col in df.columns]

       
        df = df.rename(columns={'nome completo': 'nome', 'participante': 'nome'})

       
        if 'nome' not in df.columns or 'rg' not in df.columns:
            raise HTTPException(
                status_code=400, 
                detail=f"A planilha precisa ter as colunas 'Nome' e 'RG'. Encontradas: {list(df.columns)}"
            )

        df = df.loc[:, ~df.columns.duplicated()].copy() 
        df = df[['nome', 'rg']]
        
        df = df.dropna(subset=['nome', 'rg'])
        
        
        df['rg'] = df['rg'].astype(str)

        df = df.drop_duplicates(subset='rg', keep=False)
        
        salvarDados(df, session)
        
    except HTTPException:
       
        raise
    except Exception as e:
        
        print(f"Erro na importação: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar arquivo: {str(e)}")


def buscar_dados(session: Session):    
    return buscarDados(session)


def buscar_inscrito_nome(nome: str, session: Session):
    
    inscritos = buscar_inscrito_nome_db(nome, session)
    return inscritos


def buscar_inscrito_id(id: int, session: Session):
    
    inscrito = buscar_inscrito_id_db(id, session)
    return inscrito
    

def check_in(id: int, session: Session):
    
    inscrito = buscar_inscrito_id(id, session)
    
    if not inscrito.familia_id:
        
       
        familias_db = listar_familias_repository(session)
        
        familias = [FamiliaCreateDTO.from_model(fam) for fam in familias_db]
        
        familia = random.choice(familias)
        inscrito.familia_id = familia.id
    
    return checkin(inscrito, session) 


def delete_services(id: int, session: Session):
    
    return delete_repository(id, session)


def atualizar_services(id: int, inscrito: InscritoPublic, session: Session):
    
    ins = Inscrito(
        id=id,
        nome=inscrito.nome,
        rg=inscrito.rg,
        familia_id=inscrito.familia_id
    )
    
    return atualizar_repository(ins, session)