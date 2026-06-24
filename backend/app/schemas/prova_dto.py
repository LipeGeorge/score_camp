from sqlmodel import SQLModel

class Prova(SQLModel):
    
    id: int | None
    nome: str
    teto: int 
    
    
    @classmethod
    def from_model(cls, Prova):
        
        return cls (
            nome=Prova.nome,
            teto=Prova.teto
        )

class ProvaPublic(SQLModel):
    nome: str
    teto: int