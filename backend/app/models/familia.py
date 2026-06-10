from sqlmodel import SQLModel, Field, Relationship
from typing import List
from .inscrito import Inscrito
from .provas_familia import ProvasFamilia


class Familia(SQLModel, table=True):
    
    id: int = Field(default=None, primary_key=True)
    
    nome: str = Field(default=None, max_length=100, unique=True, 
                                description='Nome da família')
    
    cor: str = Field(
        default=None, max_length=7, nullable=False, 
        description='Valor hexadecimal da cor da familia')
    
    inscritos: List['Inscrito'] = Relationship(back_populates='familia')
    provas: List['ProvasFamilia'] = Relationship(back_populates='familia')