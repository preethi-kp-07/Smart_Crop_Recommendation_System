import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes import health, dataset, analytics, predict, model_info
from backend.app.services.ml_service import ml_service

app = FastAPI(
    title="SmartCrop AI API",
    description="Smart Crop Recommendation & Advisory System Powered by Soil & Weather Analytics",
    version="1.0.0"
)

# Enable CORS for local React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(dataset.router, prefix="/api", tags=["Dataset"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(model_info.router, prefix="/api", tags=["Model Info"])

@app.on_event("startup")
def startup_event():
    print("="*60)
    print("SmartCrop AI FastAPI Server Started Successfully.")
    print(f"Loaded ML Model: {ml_service.metadata.get('selected_model', 'None')}")
    print("API Documentation: http://127.0.0.1:8000/docs")
    print("="*60)
