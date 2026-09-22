import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crop_recommendation.csv')

class AnalyticsService:
    def __init__(self):
        self.df = None
        self._load_dataset()
        
    def _load_dataset(self):
        if os.path.exists(DATA_PATH):
            self.df = pd.read_csv(DATA_PATH)
        else:
            self.df = pd.DataFrame()
            
    def get_dataset_summary(self) -> Dict[str, Any]:
        if self.df.empty:
            return {"total_records": 0, "total_crops": 0, "features": [], "crop_list": [], "records_per_crop": {}}
            
        counts = self.df['label'].value_counts().to_dict()
        features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        crop_list = sorted([str(c).capitalize() for c in self.df['label'].unique()])
        
        records_per_crop = {str(k).capitalize(): int(v) for k, v in counts.items()}
        
        return {
            "total_records": int(len(self.df)),
            "total_crops": int(self.df['label'].nunique()),
            "features": features,
            "crop_list": crop_list,
            "records_per_crop": records_per_crop
        }
        
    def get_full_analytics(self) -> Dict[str, Any]:
        if self.df.empty:
            return {}
            
        features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # 1. Overall Feature Stats (mean, std, min, max, median)
        feature_stats = {}
        for feat in features:
            feature_stats[feat] = {
                "mean": round(float(self.df[feat].mean()), 2),
                "std": round(float(self.df[feat].std()), 2),
                "min": round(float(self.df[feat].min()), 2),
                "max": round(float(self.df[feat].max()), 2),
                "median": round(float(self.df[feat].median()), 2)
            }
            
        # 2. Average nutrients per crop
        grouped = self.df.groupby('label')[features].mean().reset_index()
        crop_averages = []
        for _, row in grouped.iterrows():
            crop_averages.append({
                "crop": str(row['label']).capitalize(),
                "N": round(float(row['N']), 2),
                "P": round(float(row['P']), 2),
                "K": round(float(row['K']), 2),
                "temperature": round(float(row['temperature']), 2),
                "humidity": round(float(row['humidity']), 2),
                "ph": round(float(row['ph']), 2),
                "rainfall": round(float(row['rainfall']), 2)
            })
            
        # 3. Correlation matrix
        corr = self.df[features].corr().round(3).to_dict()
        
        # 4. Feature distributions (binned histograms)
        distributions = {}
        for feat in features:
            counts, bin_edges = np.histogram(self.df[feat], bins=10)
            bin_labels = [f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}" for i in range(len(counts))]
            distributions[feat] = [
                {"range": bin_labels[i], "count": int(counts[i])} for i in range(len(counts))
            ]
            
        return {
            "feature_stats": feature_stats,
            "crop_averages": crop_averages,
            "correlation_matrix": corr,
            "distributions": distributions
        }

    def get_all_crop_cards(self) -> List[Dict[str, Any]]:
        if self.df.empty:
            return []
            
        features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        grouped = self.df.groupby('label')
        
        cards = []
        for crop_name, group in grouped:
            cards.append({
                "crop_name": str(crop_name).capitalize(),
                "sample_count": int(len(group)),
                "avg_N": round(float(group['N'].mean()), 1),
                "avg_P": round(float(group['P'].mean()), 1),
                "avg_K": round(float(group['K'].mean()), 1),
                "avg_temperature": round(float(group['temperature'].mean()), 1),
                "avg_humidity": round(float(group['humidity'].mean()), 1),
                "avg_ph": round(float(group['ph'].mean()), 2),
                "avg_rainfall": round(float(group['rainfall'].mean()), 1),
                "min_rainfall": round(float(group['rainfall'].min()), 1),
                "max_rainfall": round(float(group['rainfall'].max()), 1),
            })
        return sorted(cards, key=lambda x: x['crop_name'])

    def get_crop_detail(self, crop_name: str) -> Dict[str, Any]:
        if self.df.empty:
            return {}
            
        crop_clean = crop_name.strip().lower()
        sub = self.df[self.df['label'].str.lower() == crop_clean]
        if sub.empty:
            return {}
            
        features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        stats = {}
        for feat in features:
            stats[feat] = {
                "mean": round(float(sub[feat].mean()), 2),
                "min": round(float(sub[feat].min()), 2),
                "max": round(float(sub[feat].max()), 2),
                "std": round(float(sub[feat].std()), 2)
            }
            
        return {
            "crop_name": str(crop_name).capitalize(),
            "sample_count": int(len(sub)),
            "parameter_stats": stats
        }

analytics_service = AnalyticsService()
