# from app.utils.colunas import colunas
from sqlmodel import Session, select
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



def buscarDados(session: Session):
    
    stmnt = select(Inscrito)
    inscritos_db = session.exec(stmnt)
    
    inscritos_response = [InscritoCreateDTO.from_model(ins) for ins in inscritos_db]
    
    return inscritos_response



def buscar_inscrito_nome_db(nome: str, session: Session):
    
    stmnt = select(Inscrito).where(Inscrito.nome.contains(nome))
    inscritos_db = session.exec(stmnt)
    
    inscritos_response = [InscritoCreateDTO.from_model(ins) for ins in inscritos_db]
    
    return inscritos_response



def buscar_inscrito_id_db(id: int, session: Session):
    
    stmnt = select(Inscrito).where(Inscrito.id == id)
    inscrito_db = session.exec(stmnt)
    
    inscrito_response = InscritoCreateDTO.from_model(inscrito_db.first())
    
    return inscrito_response