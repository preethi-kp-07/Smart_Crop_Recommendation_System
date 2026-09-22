from fastapi import APIRouter
from backend.app.services.ml_service import ml_service

router = APIRouter()

@router.get("/health")
def health_check():
    model_loaded = ml_service.model is not None
    return {
        "status": "online",
        "service": "SmartCrop AI Backend API",
        "version": "1.0.0",
        "model_loaded": model_loaded,
        "selected_model": ml_service.metadata.get("selected_model", "None")
    }
