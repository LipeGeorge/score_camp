from sqlmodel import create_engine

DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/scorecamp'

engine = create_engine(DATABASE_URL)