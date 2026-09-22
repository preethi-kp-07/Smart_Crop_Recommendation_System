import os
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crop_recommendation.csv')

class ExplanationEngine:
    def __init__(self):
        self.crop_stats = {}
        self.global_stats = {}
        self._load_stats()
        
    def _load_stats(self):
        if not os.path.exists(DATA_PATH):
            return
            
        df = pd.read_csv(DATA_PATH)
        feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        for col in feature_cols:
            self.global_stats[col] = {
                'min': float(df[col].min()),
                'max': float(df[col].max()),
                'mean': float(df[col].mean()),
                'std': float(df[col].std())
            }
            
        grouped = df.groupby('label')
        for crop, group in grouped:
            crop_dict = {}
            for col in feature_cols:
                crop_dict[col] = {
                    'mean': float(group[col].mean()),
                    'std': float(group[col].std()),
                    'min': float(group[col].min()),
                    'max': float(group[col].max()),
                    'p25': float(group[col].quantile(0.25)),
                    'p75': float(group[col].quantile(0.75))
                }
            self.crop_stats[crop] = crop_dict
            
    def generate_explanations_and_warnings(self, crop: str, inputs: Dict[str, float]) -> Tuple[List[str], List[str]]:
        explanations = []
        warnings = []
        
        if crop not in self.crop_stats:
            explanations.append(f"Selected based on similarity to dataset training patterns for {crop.capitalize()}.")
            return explanations, warnings
            
        stats = self.crop_stats[crop]
        
        # 1. Rainfall evaluation
        rf = inputs.get('rainfall', 0.0)
        rf_stats = stats['rainfall']
        if rf_stats['min'] <= rf <= rf_stats['max']:
            explanations.append(f"Rainfall ({rf:.1f} mm) is within the dataset-derived optimal range ({rf_stats['min']:.1f} - {rf_stats['max']:.1f} mm) for {crop.capitalize()}.")
        elif rf < rf_stats['min']:
            diff = rf_stats['min'] - rf
            explanations.append(f"Rainfall ({rf:.1f} mm) is slightly lower than the training mean ({rf_stats['mean']:.1f} mm), supplementary irrigation recommended.")
        else:
            explanations.append(f"Rainfall ({rf:.1f} mm) is higher than dataset average ({rf_stats['mean']:.1f} mm), good field drainage will be beneficial.")

        # 2. Temperature evaluation
        temp = inputs.get('temperature', 0.0)
        t_stats = stats['temperature']
        if t_stats['min'] <= temp <= t_stats['max']:
            explanations.append(f"Temperature ({temp:.1f}°C) matches the observed climatic range ({t_stats['min']:.1f} - {t_stats['max']:.1f}°C) in the dataset.")
        else:
            explanations.append(f"Temperature ({temp:.1f}°C) diverges slightly from dataset mean ({t_stats['mean']:.1f}°C).")

        # 3. Soil pH evaluation
        ph = inputs.get('ph', 7.0)
        ph_stats = stats['ph']
        if ph_stats['min'] <= ph <= ph_stats['max']:
            explanations.append(f"Soil pH ({ph:.2f}) is well aligned with dataset-observed sample range ({ph_stats['min']:.1f} - {ph_stats['max']:.1f}).")
        else:
            explanations.append(f"Soil pH ({ph:.2f}) is outside standard dataset sample range ({ph_stats['min']:.1f} - {ph_stats['max']:.1f}).")

        # 4. Nitrogen (N) / Nutrients evaluation
        n_val = inputs.get('N', 0.0)
        n_stats = stats['N']
        if n_stats['min'] <= n_val <= n_stats['max']:
            explanations.append(f"Nitrogen level ({n_val:.1f} kg/ha) supports expected nutrient demands (mean {n_stats['mean']:.1f} kg/ha).")
        else:
            explanations.append(f"Nitrogen level ({n_val:.1f} kg/ha) differs from training sample average ({n_stats['mean']:.1f} kg/ha).")

        # 5. Check global out-of-distribution warnings
        for feat, val in inputs.items():
            if feat in self.global_stats:
                g_min = self.global_stats[feat]['min']
                g_max = self.global_stats[feat]['max']
                if val < g_min or val > g_max:
                    warnings.append(
                        f"Warning: Input '{feat}' ({val}) is outside the training dataset range ({g_min:.1f} to {g_max:.1f}). Prediction confidence may be affected."
                    )
                    
        return explanations, warnings

    def derive_suitability_status(self, confidence_prob: float) -> str:
        """
        Derives suitability tag from model output confidence using a documented threshold system.
        """
        if confidence_prob >= 0.75:
            return "Highly Suitable"
        elif confidence_prob >= 0.50:
            return "Suitable"
        elif confidence_prob >= 0.30:
            return "Moderate"
        else:
            return "Lower Confidence"

explanation_engine = ExplanationEngine()
