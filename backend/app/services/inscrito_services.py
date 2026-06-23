from fastapi import File
from sqlmodel import Session

from app.models.inscrito import Inscrito
from app.schemas.inscrito_dto import InscritoPublic
from app.utils.colunas import colunas
from app.repository.inscrito_repository import salvarDados, buscarDados, buscar_inscrito_nome_db, buscar_inscrito_id_db, checkin, delete_repository, atualizar_repository
from ..repository.familia_repository import listar_familias_repository

import pandas as pd
import random



def uploadInscritos(file, session):

    df = pd.read_csv(file)

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
    
    inscrito = buscar_inscrito_id(id, session)
    
    if not inscrito.familia_id:
        
        # Lógica para sortear a família
        
        familia = random.choice(listar_familias_repository(session))
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