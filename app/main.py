from fastapi import FastAPI

app = FastAPI(title="Compliance Photo Gallery")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Compliance Photo Gallery API"}
