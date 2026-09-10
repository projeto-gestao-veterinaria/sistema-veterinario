from fastapi import FastAPI
from app.routes.tutor import router as tutor_router

app = FastAPI(
    title="PetAssistente API",
    description="Backend do Sistema de Gestão Veterinária",
    version="0.1.0",
)

app.include_router(tutor_router)

@app.get("/")
def home():
    return {"message": "PetAssistente API funcionando!"}


@app.get("/health")
def health_check():
    return {"status": "online"}
