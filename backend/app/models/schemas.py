from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PredictRequest(BaseModel):
    nitrogen: float = Field(..., ge=0.0, le=250.0, description="Nitrogen content in soil (kg/ha)")
    phosphorus: float = Field(..., ge=0.0, le=250.0, description="Phosphorus content in soil (kg/ha)")
    potassium: float = Field(..., ge=0.0, le=300.0, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=0.0, le=60.0, description="Temperature (°C)")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity (%)")
    ph: float = Field(..., ge=0.0, le=14.0, description="Soil pH value")
    rainfall: float = Field(..., ge=0.0, le=500.0, description="Rainfall (mm)")
    
    # Optional contextual fields
    state: Optional[str] = Field(None, description="State / Region context")
    district: Optional[str] = Field(None, description="District / Location context")
    season: Optional[str] = Field(None, description="Kharif, Rabi, Zaid, Annual")

class AlternativeCrop(BaseModel):
    crop: str
    score: float
    percentage: float
    suitability_label: str

class AdvisoryOutput(BaseModel):
    soil_status: str
    climate_status: str
    favourable_conditions: List[str]
    attention_conditions: List[str]
    sowing_guidance: str

class PredictResponse(BaseModel):
    recommended_crop: str
    confidence: float
    confidence_percentage: float
    suitability_status: str  # "Highly Suitable", "Suitable", "Moderate", "Lower Confidence"
    alternatives: List[AlternativeCrop]
    input_summary: Dict[str, Any]
    explanations: List[str]
    advisory: AdvisoryOutput
    agronomic_warnings: List[str]

class CropDetail(BaseModel):
    crop_name: str
    sample_count: int
    avg_N: float
    avg_P: float
    avg_K: float
    avg_temperature: float
    avg_humidity: float
    avg_ph: float
    avg_rainfall: float
    min_rainfall: float
    max_rainfall: float

class DatasetSummary(BaseModel):
    total_records: int
    total_crops: int
    features: List[str]
    crop_list: List[str]
    records_per_crop: Dict[str, int]

class ModelMetricsResponse(BaseModel):
    selected_model: str
    requires_scaled_input: bool
    all_models_evaluated: Dict[str, Any]
    selected_model_metrics: Dict[str, Any]

class FeatureImportanceResponse(BaseModel):
    selected_model: str
    feature_importance: Dict[str, float]
