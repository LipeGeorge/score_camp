# from app.utils.colunas import colunas
from sqlmodel import Session
from ..schemas.inscrito_dto import InscritoCreateDTO



def salvarDados(dados, session: Session):
    
    inscritos = []
    id = 0
    
    for inscrito in dados.itertuples():
        
        ins = InscritoCreateDTO.from_model(inscrito)
        inscritos.append(ins)
        
        id += 1
    
    
    session.add_all(inscritos)
    session.commit()
    session.refresh()
    
    print("Deu tudo certo")



def buscarDados():
    return 'Leu os inscritos'



def buscar_dado_inscrito(nome: str):
    return f"Buscou {nome} no banco"