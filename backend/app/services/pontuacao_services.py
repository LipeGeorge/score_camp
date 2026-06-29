from ..models.pontuacao import Pontuacao
from ..schemas.pontuacao_dto import PontuacaoPublic, PontuacaoResponsePorProvaDTO, PontuacaoResponsePorFamiliaDTO
from ..repository.pontuacao_repository import *
from ..services.familia_services import listar_familias_services
from ..services.prova_services import listar_services
from typing import List



""" --- CRIAR --- """

# cadastrar uma única pontuacao
def cadastrar_service(pontuacao: PontuacaoPublic, session: Session):
    return cadastrar_repository(pontuacao, session)



# cadastrar uma lista de pontuacoes
def cadastrar_varias_pontuacoes_service(pontuacoes: List[Pontuacao], session: Session):
    
    # Ordena a lista pelo timestamp_dev
    ordenados = sorted(pontuacoes, key=lambda p: p.timestamp_dev)

    return cadatrar_varias_pontuacoes_repository(ordenados, session)



""" --- LISTAR --- """

# listar histórico de pontuacoes de uma família
def listar_historico_familia_service(id: int, session: Session):
    
    hist = listar_historico_familia_repository(id, session)
    provas_db = listar_services(session)
    
    mapa_provas = {p.id: p.nome for p in provas_db}
    
    historico = [
        PontuacaoResponsePorFamiliaDTO(
            nome_prova=mapa_provas.get(h.id_prova, "Desconhecido"),
            qtd_pontos=h.qtd_pontos
        )
        for h in hist
    ]
    
    return historico



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
    
    rkng = ranking_geral_repository(session)
    familias = listar_familias_services(session)
    
    # dicionário rápido para mapear ID da família -> Nome da família
    mapa_nomes = {fam.id: fam.nome for fam in familias}
    
    ranking = {
        mapa_nomes[r.id_familia]: r.total_pontos
        for r in rkng
        if r.id_familia in mapa_nomes
    }
    
    """ranking = {
        fam.nome: r.total_pontos 
        for r in rkng  
        for fam in familias 
        if r.id_familia == fam.id 
    }"""

    return ranking



""" --- EDITAR --- """

def editar_pontuacao_services(pontuacao: PontuacaoPublic, session: Session):
    return editar_pontuacao_repository(pontuacao, session)



""" --- APAGAR --- """

def apagar_pontuacao_services(id: int, session: Session):
    return apagar_pontuacao_repository(id, session)