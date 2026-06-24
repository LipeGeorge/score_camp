from ..models.pontuacao import Pontuacao
from ..schemas.pontuacao_dto import PontuacaoResponsePorProvaDTO
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




""" --- EDITAR --- """
""" --- APAGAR --- """