from sqlmodel import Session, select
from ..models.prova import Prova



def cadastrar_repository(prova: Prova, session: Session):
    
    p = Prova (
        nome=prova.nome,
        teto=prova.teto
    )
    
    session.add(p)
    session.commit()
    
    return 'Prova cadastrada com sucesso'