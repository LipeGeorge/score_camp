from sqlmodel import Session
from ..repository.familia_repository import *
from ..schemas.familia_dto import FamiliaCreateDTO, FamiliaPublic



def listar_familias_services(session: Session):
    familias_db = listar_familias_repository(session)
    
    familias = [FamiliaCreateDTO.from_model(fam) for fam in familias_db]
    
    return familias



def listar_familias_por_id_services(id: int, session: Session):
    
    familia_db = listar_familias_por_id_repository(id, session)
    familia = FamiliaCreateDTO.from_model(familia_db)
    
    return familia



def cadastrar_familia_services(familia: FamiliaPublic, session: Session):
    return cadastrar_familia_repository(familia, session)



def atualizar_familia_services(id: int, familia: FamiliaPublic, session: Session):
    
    fam = Familia(
        id=id,
        nome=familia.nome,
        cor=familia.cor
    )
    
    familia_db = atualizar_familia_repository(fam, session)
    f = FamiliaCreateDTO.from_model(familia_db)
    
    return f



def deletar_familia_services(id: int, session: Session):
    
    return deletar_familia_repository(id, session)