from fastapi import APIRouter

router = APIRouter(prefix="/animais", tags=["Animais"])


@router.get("/status")
def status():
    return {"module": "animais", "status": "em construção"}
