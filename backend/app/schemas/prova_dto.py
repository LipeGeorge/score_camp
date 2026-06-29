from sqlmodel import SQLModel

class ProvaCreateDTO(SQLModel):
    
    id: int | None
    nome: str
    teto: int 
    
    
    @classmethod
    def from_model(cls, Prova):
        
        return cls (
            id=Prova.id,
            nome=Prova.nome,
            teto=Prova.teto
        )

class ProvaPublic(SQLModel):
    nome: str
    teto: int