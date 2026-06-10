from sqlmodel import SQLModel, Field, Relationship
from typing import List
from .provas_familia import ProvasFamilia

class Prova(SQLModel, table=True):
    
    id: int = Field(default=None, primary_key=True)
    
    nome: str = Field(default=None, max_length=150, unique=True, 
                                description='Nome da prova')
    
    teto: int = Field(default=None, description='pontuacao maxima que a prova pode dar')
    
    familias: List['ProvasFamilia'] = Relationship(back_populates='prova')