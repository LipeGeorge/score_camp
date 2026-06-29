from sqlmodel import SQLModel



class FamiliaCreateDTO(SQLModel):
    
    id: int | None
    nome: str
    cor: str
    
    
    @classmethod
    def from_model(cls, familia):
        
        return cls(
            id = familia.id,
            nome = familia.nome,
            cor = familia.cor,
        )


class FamiliaPublic(SQLModel):
    nome: str
    cor: str