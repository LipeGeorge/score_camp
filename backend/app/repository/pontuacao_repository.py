from app.schemas.pontuacao_dto import PontuacaoPublic
from ..models.pontuacao import Pontuacao

from sqlmodel import select, Session, desc
from typing import List
from sqlalchemy import func
from fastapi import HTTPException
from http import HTTPStatus



""" --- CRIAR --- """

# Cadastar uma única pontuacao
def cadastrar_repository(pontuacao: PontuacaoPublic, session: Session):
    
    pont = Pontuacao(**pontuacao.model_dump())
    
    session.add(pont)
    session.commit()
    
    return 'Lancamento feito com sucesso'



# Cadastrar várias pontuacoes
def cadatrar_varias_pontuacoes_repository(pontuacoes: List[Pontuacao], session: Session):
    
    ponts = [Pontuacao(**p.model_dump()) for p in pontuacoes]
    
    session.add_all(ponts)
    session.commit()



""" --- LISTAR --- """

# Listar histórico de pontuacao de uma família
def listar_historico_familia_repository(id: int, session: Session):

    stmnt = select(Pontuacao).where(Pontuacao.id_familia==id)
    historico = session.exec(stmnt)

    return historico



# Ranking por prova
def listar_historico_prova_repository(id: int, session: Session):
    
    stmnt = select(Pontuacao).where(Pontuacao.id_prova==id)
    pontuacoes = session.exec(stmnt)
    
    return pontuacoes



# Ranking geral
def ranking_geral_repository(session: Session):
    
    stmnt = (
        select(Pontuacao.id_familia, func.sum(Pontuacao.qtd_pontos).label('total_pontos'))
        .group_by(Pontuacao.id_familia)
        .order_by(desc(func.sum(Pontuacao.qtd_pontos)))
    )
    ranking = session.exec(stmnt).all()

    return ranking



""" --- ATUALIZAR --- """

# pontuacao de familia em uma prova
def editar_pontuacao_repository(pontuacao: PontuacaoPublic, session: Session):
    
    stmnt = select(Pontuacao).where(
        Pontuacao.id_prova==pontuacao.id_prova, 
        Pontuacao.id_familia==pontuacao.id_familia
    )
    
    lancamento = session.exec(stmnt)
    
    lancamento.id_prova = pontuacao.id_prova 
    lancamento.id_familia = pontuacao.id_familia
    lancamento.qtd_pontos = pontuacao.qtd_pontos
    lancamento.timestamp_dev = pontuacao.timestamp_dev
    
    lancamento_db = Pontuacao.model_validate(lancamento)
    
    session.add(lancamento_db)
    session.commit()
    session.refresh(lancamento_db)
    
    return 'Pontuação atualizada com sucesso!'


""" --- APAGAR --- """

# Apagar lancamento
def apagar_pontuacao_repository(id: int, session: Session):
    
    lancamento = session.get(Pontuacao, id)
    
    if not lancamento:
        return 'Pontuação não encontrada'
    
    session.delete(lancamento)
    session.commit()
    
    return 'Pontuação excluida com sucesso!'