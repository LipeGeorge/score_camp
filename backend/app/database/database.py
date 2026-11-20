from sqlmodel import create_engine, SQLModel, Session 
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)



# Cria todas as tabelas definidas no modelo para uma engine específica
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
    

def get_session():
    with Session(engine) as session:
        yield session