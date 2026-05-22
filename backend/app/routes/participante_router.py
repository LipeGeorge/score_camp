from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session
import pandas as pd


router = APIRouter(prefix='/participantes', tags=['Participante'])

@router.post('/upload')
def importar_participantes(file: UploadFile = File(...)):
    
    df = pd.read_csv(file.file)
    
    return {"dataframe": df.head()}