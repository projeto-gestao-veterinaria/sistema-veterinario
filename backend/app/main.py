from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.tutor import router as tutor_router
from app.routes.animal import router as animal_router
from app.routes.agendamento import router as agendamento_router
from app.routes.vacina import router as vacina_router
from app.routes.prontuario import router as prontuario_router
from app.routes.catalogo_vacina import router as catalogo_vacina_router

app = FastAPI(
    title="PetAssistente API",
    description="Backend do Sistema de Gestão Veterinária",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(animal_router)

app.include_router(tutor_router)

app.include_router(agendamento_router)

app.include_router(vacina_router)

app.include_router(prontuario_router)

app.include_router(catalogo_vacina_router)

@app.get("/")
def home():
    return {"message": "PetAssistente API funcionando!"}


@app.get("/health")
def health_check():
    return {"status": "online"}
