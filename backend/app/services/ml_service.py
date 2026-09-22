import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from backend.app.utils.explanation_engine import explanation_engine
from backend.app.services.advisory_service import generate_crop_advisory

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'saved_models')

class MLService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.metadata = {}
        self.metrics = {}
        self.feature_importance = {}
        self.load_artifacts()
        
    def load_artifacts(self):
        model_path = os.path.join(MODEL_DIR, 'best_model.joblib')
        scaler_path = os.path.join(MODEL_DIR, 'scaler.joblib')
        encoder_path = os.path.join(MODEL_DIR, 'label_encoder.joblib')
        meta_path = os.path.join(MODEL_DIR, 'metadata.json')
        metrics_path = os.path.join(MODEL_DIR, 'model_metrics.json')
        importance_path = os.path.join(MODEL_DIR, 'feature_importance.json')
        
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            self.label_encoder = joblib.load(encoder_path)
            
            with open(meta_path, 'r') as f:
                self.metadata = json.load(f)
            with open(metrics_path, 'r') as f:
                self.metrics = json.load(f)
            with open(importance_path, 'r') as f:
                self.feature_importance = json.load(f)
            print(f"[MLService] Loaded trained model '{self.metadata.get('selected_model')}' successfully.")
        else:
            print("[MLService] WARNING: No trained model found in backend/saved_models. Please run ml/train.py first.")

    def predict(self, input_data: Dict[str, float], context_data: Dict[str, Any] = None) -> Dict[str, Any]:
        if self.model is None:
            raise RuntimeError("ML model is not loaded. Train the model first using python ml/train.py.")
            
        feature_cols = self.metadata['feature_names']
        input_vector = np.array([[input_data[col] for col in feature_cols]])
        
        requires_scaling = self.metadata.get('requires_scaled_input', False)
        if requires_scaling:
            proc_vector = self.scaler.transform(input_vector)
        else:
            proc_vector = input_vector
            
        # Class probabilities
        if hasattr(self.model, 'predict_proba'):
            probabilities = self.model.predict_proba(proc_vector)[0]
        else:
            # Fallback for models without predict_proba
            pred_idx = self.model.predict(proc_vector)[0]
            probabilities = np.zeros(len(self.label_encoder.classes_))
            probabilities[pred_idx] = 1.0
            
        top_indices = np.argsort(probabilities)[::-1]
        
        best_idx = top_indices[0]
        best_crop_raw = self.label_encoder.classes_[best_idx]
        best_score = float(probabilities[best_idx])
        
        best_crop_name = str(best_crop_raw).capitalize()
        
        # Build alternatives list
        alternatives = []
        for idx in top_indices:
            crop_raw = self.label_encoder.classes_[idx]
            score = float(probabilities[idx])
            percentage = round(score * 100.0, 1)
            suitability_label = explanation_engine.derive_suitability_status(score)
            
            alternatives.append({
                'crop': str(crop_raw).capitalize(),
                'score': round(score, 4),
                'percentage': percentage,
                'suitability_label': suitability_label
            })
            
        # Top recommended crop details
        top_suitability = alternatives[0]['suitability_label']
        
        # Explanations & Warnings
        explanations, warnings = explanation_engine.generate_explanations_and_warnings(best_crop_raw, input_data)
        
        # Advisory
        advisory = generate_crop_advisory(best_crop_raw, input_data)
        
        summary = {
            "nitrogen": input_data["N"],
            "phosphorus": input_data["P"],
            "potassium": input_data["K"],
            "temperature": input_data["temperature"],
            "humidity": input_data["humidity"],
            "ph": input_data["ph"],
            "rainfall": input_data["rainfall"]
        }
        if context_data:
            summary.update(context_data)
            
        return {
            "recommended_crop": best_crop_name,
            "confidence": round(best_score, 4),
            "confidence_percentage": round(best_score * 100.0, 1),
            "suitability_status": top_suitability,
            "alternatives": alternatives[:6],  # Return top 6 crops
            "input_summary": summary,
            "explanations": explanations,
            "advisory": advisory,
            "agronomic_warnings": warnings
        }

ml_service = MLService()
