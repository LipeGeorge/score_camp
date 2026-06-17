from sqlmodel import Session, func, select
from ..models.familia import Familia
from ..schemas.familia_dto import FamiliaPublic, FamiliaCreateDTO



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



def listar_familias_repository(session: Session):
    
    stmnt = select(Familia)
    familias_db = session.exec(stmnt)
    
    familias = [FamiliaCreateDTO.from_model(fam) for fam in familias_db]
    
    return familias



def listar_familias_por_id_repository(id: int, session: Session):
    
    familia_db = session.get(Familia, id)
    
    familia = FamiliaCreateDTO.from_model(familia_db)
    print(familia)
    
    return familia


