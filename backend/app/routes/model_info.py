from fastapi import APIRouter
from backend.app.services.ml_service import ml_service

router = APIRouter()

@router.get("/model/metrics")
def get_model_metrics():
    return ml_service.metrics

@router.get("/model/feature-importance")
def get_feature_importance():
    return {
        "selected_model": ml_service.metadata.get("selected_model", "Unknown"),
        "feature_importance": ml_service.feature_importance
    }
