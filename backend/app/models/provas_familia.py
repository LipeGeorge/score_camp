from sqlmodel import SQLModel, Relationship, Field
from typing import Optional


class ProvasFamilia(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    id_familia: int = Field(foreign_key='familia.id', index=True, description='id da familia associada')
    id_prova: int = Field(foreign_key='prova.id', index=True, description='id da prova associada')
    
    familia: 'Familia' = Relationship(back_populates='provas')
    prova: 'Prova' = Relationship(back_populates='familias')