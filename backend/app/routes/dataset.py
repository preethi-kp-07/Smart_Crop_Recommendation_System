from fastapi import APIRouter, HTTPException
from backend.app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/dataset/summary")
def get_dataset_summary():
    return analytics_service.get_dataset_summary()

@router.get("/crops")
def get_all_crops():
    cards = analytics_service.get_all_crop_cards()
    return {"total": len(cards), "crops": cards}

@router.get("/crop/{crop_name}")
def get_crop_detail(crop_name: str):
    detail = analytics_service.get_crop_detail(crop_name)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Crop '{crop_name}' not found in dataset.")
    return detail
