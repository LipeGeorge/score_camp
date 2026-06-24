from sqlmodel import SQLModel, Field, Relationship
from typing import List
from .pontuacao import Pontuacao

class Prova(SQLModel, table=True):
    
    id: int | None = Field(default=None, primary_key=True)
    
    nome: str = Field(default=None, max_length=150, unique=True, 
                                description='Nome da prova')
    
    teto: int = Field(default=None, description='pontuacao maxima que a prova pode dar')
    
    familias: List['Pontuacao'] = Relationship(back_populates='prova')