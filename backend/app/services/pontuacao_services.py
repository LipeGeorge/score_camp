from ..models.pontuacao import Pontuacao
from ..schemas.pontuacao_dto import PontuacaoPublic, PontuacaoResponsePorProvaDTO
from ..repository.pontuacao_repository import *
from ..services.familia_services import listar_familias_services
from typing import List



""" --- CRIAR --- """

# cadastrar uma única pontuacao
def cadastrar_service(pontuacao: Pontuacao, session: Session):
    return cadastrar_repository(pontuacao, session)



# cadastrar uma lista de pontuacoes
def cadastrar_varias_pontuacoes_service(pontuacoes: List[Pontuacao], session: Session):
    
    # Ordena a lista pelo timestamp_dev
    ordenados = sorted(pontuacoes, key=lambda p: p.timestamp_dev)

    return cadatrar_varias_pontuacoes_repository(ordenados, session)



""" --- LISTAR --- """

# listar histórico de pontuacoes de uma família
def listar_historico_familia_service(id: int, session: Session):
    return listar_historico_familia_repository(id, session)



# Ranking por prova
def listar_historico_prova_service(id_prova: int, session: Session):

    historico = listar_historico_prova_repository(id_prova, session)
    familias_db = listar_familias_services(session)
    
    mapa_familias = {fam.id: fam.nome for fam in familias_db}
    
    ranking = [
        PontuacaoResponsePorProvaDTO(
            nome_familia=mapa_familias.get(p.id_familia, "Desconhecido"),
            qtd_pontos=p.qtd_pontos
        )
        for p in historico
    ]
    
    return ranking



# Ranking geral
def ranking_geral_services(session: Session):
    # buscar as pontuacoes no banco
    # somar a de cada equipe
    # retornar ordenado do maior para o menor
    rkng = ranking_geral(session)
    familias = listar_familias_services(session)
    
    ranking = {
        fam['nome']: r.qtd_pontos 
        for fam in familias 
        for r in rkng  
        if fam['id'] == r.id_familia 
    }

    return ranking



""" --- EDITAR --- """

def editar_pontuacao_services(pontuacao: PontuacaoPublic, session: Session):
    return editar_pontuacao_repository(pontuacao, session)



""" --- APAGAR --- """

def apagar_pontuacao_services(id: int, session: Session):
    return apagar_pontuacao_repository(id, session)