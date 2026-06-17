from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class Inscrito(SQLModel, table=True):

    id: int = Field(default=None, primary_key=True)
    
    nome: str = Field(default=None, max_length=100, unique=True, 
                                description='Nome do Participante')
    
    rg: str = Field(
        default=None, unique=True, 
        description='RG para validacao e prevencao de duplicidade')
    
    familia_id: Optional[int] = Field(default=None, foreign_key='familia.id')
    check_in: Optional[bool] = Field(default=False, description='Flag indicatio de presença')
    
    familia: Optional['Familia'] = Relationship(back_populates='inscritos')