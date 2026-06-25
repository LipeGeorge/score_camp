from app.schemas.pontuacao_dto import PontuacaoPublic

from ..models.pontuacao import Pontuacao
from sqlmodel import select, Session, desc
from typing import List
from sqlalchemy import func



""" --- CRIAR --- """

# Cadastar uma única pontuacao
def cadastrar_repository(pontuacao: Pontuacao, session: Session):
    
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

    stmnt = select(Pontuacao)
    historico = session.exec(stmnt).where(Pontuacao.id_familia==id)

    return historico



# Ranking por prova
def listar_historico_prova_repository(id: int, session: Session):
    
    stmnt = select(Pontuacao)
    pontuacoes = session.exec(stmnt).where(Pontuacao.id_prova==id).order_by(desc(Pontuacao.qtd_pontos)).all()
    
    return pontuacoes



# Ranking geral
def ranking_geral(session: Session):
    
    stmnt = select(Pontuacao)
    ranking = session.exec(stmnt).group_by(Pontuacao.id_familia).order_by(desc(func.sum(Pontuacao.qtd_pontos)))

    return ranking



""" --- ATUALIZAR --- """

# pontuacao de familia em uma prova
def editar_pontuacao_repository(pontuacao: PontuacaoPublic, session: Session):
    
    stmnt = select(Pontuacao)
    
    lancamento = session.exec(stmnt).where(
        Pontuacao.id_prova==pontuacao.id_prova, 
        Pontuacao.id_familia==pontuacao.id_familia
    )

    lancamento.qtd_pontos = pontuacao.qtd_pontos
    
    session.add(lancamento)
    session.commit()
    session.refresh(lancamento)
    
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