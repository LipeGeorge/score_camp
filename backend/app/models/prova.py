from sqlmodel import SQLModel, Field

class Prova:
    
    id: int = Field(default=None, primary_key=True)
    
    nome: str = Field(default=None, max_length=150, unique=True, 
                                description="Nome da prova")
    
    teto: int = Field(default=None, description="pontuacao maxima que a prova pode dar")