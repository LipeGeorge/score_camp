from pydantic import BaseModel
from sqlmodel import Field

class InscritoCreateDTO(BaseModel):
    
    nome: str = Field(min_length=3, max_length=100, description="Nome completo do participante")
    cpf: str = Field(min_length=11, max_length=11, description="CPF do participante")