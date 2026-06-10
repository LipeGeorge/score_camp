from sqlmodel import SQLModel
from typing import Optional



class InscritoCreateDTO(SQLModel):
    
    nome: str
    rg: str
    familia_id: Optional[int]
    check_in: Optional[bool]
    
    
    @classmethod
    def from_model(cls, inscrito):
        return cls(
            nome = inscrito[1],
            rg = inscrito[2],
            familia_id = None,
            check_in = False
        )