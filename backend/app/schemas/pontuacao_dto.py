from sqlmodel import SQLModel
from datetime import datetime

class PontuacaoCreateDTO(SQLModel):
    
    id: int | None
    id_familia: int 
    id_prova: int
    
    qtd_pontos: int
    timestamp_dev: datetime
    
    
    @classmethod
    def from_model(cls, ProvaFamilia):
        
        return cls(
            
            id_familia=ProvaFamilia.id_familia,
            id_prova=ProvaFamilia.id_prova,
            qtd_pontos=ProvaFamilia.qtd_pontos
            
        )


class PontuacaoPublic(SQLModel):
    id_familia: int
    id_prova: int
    qtd_pontos: int


class PontuacaoResponseDTO(SQLModel):
    
    id: int | None
    nome_familia: str 
    id_prova: int
    
    qtd_pontos: int
    timestamp_dev: datetime


class PontuacaoResponsePorProvaDTO(SQLModel):
    
    nome_familia: str
    qtd_pontos: int