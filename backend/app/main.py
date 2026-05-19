from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def is_online():
    return {"Status":"ScoreCamp is online!"}