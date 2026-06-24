from sqlmodel import SQLModel
from typing import Optional

class ProvasFamilia(SQLModel):
    
    id: int | None
    id_familia: int 
    id_prova: int
    
    qtd_pontos: int
    
    
    @classmethod
    def from_model(cls, ProvaFamilia):
        
        return cls(
            
            id_familia=ProvaFamilia.id_familia,
            id_prova=ProvaFamilia.id_prova,
            qtd_pontos=ProvaFamilia.qtd_pontos
            
        )