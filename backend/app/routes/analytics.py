from fastapi import APIRouter
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/analytics")
def get_analytics():
    return analytics_service.get_full_analytics()
