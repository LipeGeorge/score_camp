from sqlmodel import SQLModel
from typing import Optional



class InscritoCreateDTO(SQLModel):
    
    id: int
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
        


class InscritoPublic(SQLModel):
    nome: str
    rg: str
    familia_id: Optional[int]