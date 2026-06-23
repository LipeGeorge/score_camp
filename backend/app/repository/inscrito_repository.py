from fastapi import HTTPException
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
    
    inscrito_db = session.get(Inscrito, id)
    
    inscrito_response = InscritoCreateDTO.from_model(inscrito_db)
    
    return inscrito_response



def checkin(inscrito: Inscrito, session: Session):
    
    ins = session.get(Inscrito, inscrito.id)
    
    if not ins.check_in:
        ins.check_in = True
        ins.familia_id = inscrito.familia_id
    
    session.add(ins)
    session.commit()
    session.refresh(ins)
    
    return InscritoCreateDTO.from_model(ins) # Usar o DTO mantém a ordem



def delete_repository(id: int, session: Session):
    
    inscrito = session.get(Inscrito, id)
    
    if not inscrito:
        return 'Inscrito não encontrado'
    
    session.delete(inscrito)
    session.commit()
    
    return 'Inscrito deletado com sucesso'



def atualizar_repository(inscrito: Inscrito, session: Session):
    
    inscrito_db = session.get(Inscrito, inscrito.id)
    
    inscrito_db.nome = inscrito.nome
    inscrito_db.rg = inscrito.rg
    inscrito_db.familia_id = inscrito.familia_id
    
    session.add(inscrito_db)
    session.commit()
    session.refresh(inscrito_db)

    return inscrito_db