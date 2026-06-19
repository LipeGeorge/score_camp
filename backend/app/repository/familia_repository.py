from sqlmodel import Session, func, select
from ..models.familia import Familia
from ..schemas.familia_dto import FamiliaPublic



def listar_familias_repository(session: Session):
    
    stmnt = select(Familia)
    familias_db = session.exec(stmnt)
    
    return familias_db



def listar_familias_por_id_repository(id: int, session: Session):
    
    familia_db = session.get(Familia, id)
    
    return familia_db



def cadastrar_familia_repository(familia: FamiliaPublic, session: Session):
    
    # Para saber o tamanho da tabela no banco
    stmnt = select(func.count(Familia.id))
    tam = session.exec(stmnt).one()
    
    f = Familia (
            id=tam + 1,
            nome=familia.nome,
            cor=familia.cor
        )
    
    session.add(f)
    session.commit()
    
    return f



def atualizar_familia_repository(familia: Familia, session: Session):
    
    familia_db = listar_familias_por_id_repository(familia.id, session)
    
    familia_db.nome = familia.nome
    familia_db.cor = familia.cor
    
    session.add(familia_db)
    session.commit()
    session.refresh(familia_db)
    
    return familia_db