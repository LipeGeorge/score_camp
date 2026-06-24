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