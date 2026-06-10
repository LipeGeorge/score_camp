# from app.utils.colunas import colunas
from sqlmodel import Session
from ..schemas.inscrito_dto import InscritoCreateDTO
from ..models.inscrito import Inscrito



def salvarDados(dados, session: Session):
    
    inscritos = []
    
    for inscrito in dados.itertuples():
        
        ins_dto = InscritoCreateDTO.from_model(inscrito)
        ins = Inscrito(**ins_dto.model_dump())
        
        inscritos.append(ins)
    
    
    session.add_all(inscritos)
    session.commit()
    
    print("Deu tudo certo")



def buscarDados():
    return 'Leu os inscritos'



def buscar_dado_inscrito(nome: str):
    return f"Buscou {nome} no banco"