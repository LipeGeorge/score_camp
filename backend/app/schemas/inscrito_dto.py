from sqlmodel import SQLModel
from typing import Optional



class InscritoCreateDTO(SQLModel):
    
    id: int | None
    nome: str
    rg: str
    familia_id: Optional[int]
    check_in: Optional[bool]
    
    
    @classmethod
    def from_model(cls, inscrito):
        
        return cls(
            id = inscrito.id,
            nome = inscrito.nome,
            rg = inscrito.rg,
            familia_id = inscrito.familia_id,
            check_in = inscrito.check_in
        )
    
    @classmethod
    def model_up(cls, inscrito):
        
        return cls(
            id = None,
            nome = inscrito.nome,
            rg = str(inscrito.rg),
            familia_id = None,
            check_in = False
        )
        


class InscritoPublic(SQLModel):
    nome: str
    rg: str
    familia_id: Optional[int]