from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import PredictRequest, PredictResponse
from backend.app.services.ml_service import ml_service

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
def predict_crop(req: PredictRequest):
    try:
        input_dict = {
            "N": req.nitrogen,
            "P": req.phosphorus,
            "K": req.potassium,
            "temperature": req.temperature,
            "humidity": req.humidity,
            "ph": req.ph,
            "rainfall": req.rainfall
        }
        
        context_dict = {}
        if req.state:
            context_dict["state"] = req.state
        if req.district:
            context_dict["district"] = req.district
        if req.season:
            context_dict["season"] = req.season
            
        result = ml_service.predict(input_dict, context_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
