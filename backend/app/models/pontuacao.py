from sqlmodel import SQLModel, Relationship, Field
from datetime import datetime

class Pontuacao(SQLModel, table=True):
    
    id: int | None = Field(default=None, primary_key=True)
    id_familia: int = Field(foreign_key='familia.id', index=True, description='id da familia associada')
    id_prova: int = Field(foreign_key='prova.id', index=True, description='id da prova associada')
    
    qtd_pontos: int = Field(default=None, description='quantidade de pontos da equipe na prova')
    
    timestamp_dev: datetime = Field(description='horario em que foi registrado a pontuacao')
    
    familia: 'Familia' = Relationship(back_populates='provas')
    prova: 'Prova' = Relationship(back_populates='familias')