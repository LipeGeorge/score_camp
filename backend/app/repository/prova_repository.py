from sqlmodel import Session, select
from ..models.prova import Prova
from ..schemas.prova_dto import ProvaCreateDTO



def cadastrar_repository(prova: Prova, session: Session):
    
    p = Prova (
        nome=prova.nome,
        teto=prova.teto
    )
    
    session.add(p)
    session.commit()
    
    return 'Prova cadastrada com sucesso'



def listar_repository(session: Session):
    
    stmnt = select(Prova)
    provas_db = session.exec(stmnt)
    
    provas = [ProvaCreateDTO.from_model(p) for p in provas_db]
    
    return provas



def atualizar_repository(prova: Prova, session: Session):
    
    prova_db = session.get(Prova, prova.id)
    
    prova_db.nome = prova.nome
    prova_db.teto = prova.teto
    
    session.add(prova_db)
    session.commit()
    session.refresh(prova_db)
    
    return prova_db



def apagar_repository(id: int, session: Session):
    
    prova = session.get(Prova, id)
    
    if not prova:
        return 'Prova não encontrada!'
    
    session.delete(prova)
    session.commit()
    
    return 'Prova apagada com sucesso!'