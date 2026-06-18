from sqlmodel import Session
from ..repository.familia_repository import cadastrar_familia_repository, listar_familias_por_id_repository, listar_familias_repository
from ..schemas.familia_dto import FamiliaPublic



def listar_familias_services(session: Session):
    familias = listar_familias_repository(session)
    return familias



def listar_familias_por_id_services(id: int, session: Session):
    return listar_familias_por_id_repository(id, session)



def cadastrar_familia_services(familia: FamiliaPublic, session: Session):
    return cadastrar_familia_repository(familia, session)