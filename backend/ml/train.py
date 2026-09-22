import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier

from backend.ml.preprocess import prepare_pipeline_data, FEATURE_COLUMNS
from backend.ml.evaluate import evaluate_classifier
from backend.data.generate_dataset import generate_crop_dataset

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'crop_recommendation.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'saved_models')

def train_and_evaluate_all():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    if not os.path.exists(DATA_PATH):
        print(f"Dataset not found at {DATA_PATH}. Generating demo dataset...")
        generate_crop_dataset()
        
    print(f"Loading and preprocessing data from {DATA_PATH}...")
    pipeline_data = prepare_pipeline_data(DATA_PATH, test_size=0.2, random_state=42)
    
    X_train = pipeline_data['X_train']
    X_test = pipeline_data['X_test']
    X_train_scaled = pipeline_data['X_train_scaled']
    X_test_scaled = pipeline_data['X_test_scaled']
    y_train = pipeline_data['y_train']
    y_test = pipeline_data['y_test']
    classes = pipeline_data['classes']
    scaler = pipeline_data['scaler']
    label_encoder = pipeline_data['label_encoder']
    
    # Candidate Classifiers Dictionary
    candidates = {
        'Random Forest': (
            RandomForestClassifier(n_estimators=100, random_state=42),
            X_train, X_test
        ),
        'Gradient Boosting': (
            GradientBoostingClassifier(n_estimators=100, random_state=42),
            X_train, X_test
        ),
        'Decision Tree': (
            DecisionTreeClassifier(random_state=42),
            X_train, X_test
        ),
        'Logistic Regression': (
            LogisticRegression(max_iter=1000, random_state=42),
            X_train_scaled, X_test_scaled
        ),
        'K-Nearest Neighbors (KNN)': (
            KNeighborsClassifier(n_neighbors=5),
            X_train_scaled, X_test_scaled
        )
    }
    
    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_model_obj = None
    best_eval_dict = None
    best_requires_scaled = False
    
    print("\n" + "="*70)
    print(f"{'MODEL EVALUATION COMPARISON':^70}")
    print("="*70)
    print(f"{'Model Name':<28} | {'Accuracy':<10} | {'Precision':<10} | {'F1-Score':<10}")
    print("-" * 70)
    
    for name, (model, X_tr, X_te) in candidates.items():
        model.fit(X_tr, y_train)
        eval_metrics = evaluate_classifier(model, X_te, y_test, classes, FEATURE_COLUMNS)
        results[name] = eval_metrics
        
        f1 = eval_metrics['f1_weighted']
        acc = eval_metrics['accuracy']
        prec = eval_metrics['precision_weighted']
        
        print(f"{name:<28} | {acc:<10.4f} | {prec:<10.4f} | {f1:<10.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = model
            best_eval_dict = eval_metrics
            best_requires_scaled = (name in ['Logistic Regression', 'K-Nearest Neighbors (KNN)'])
            
    print("="*70)
    print(f"\nWinner Model Selected: {best_model_name} (F1 Score: {best_f1:.4f})\n")
    
    # Save artifacts
    best_model_path = os.path.join(MODEL_DIR, 'best_model.joblib')
    scaler_path = os.path.join(MODEL_DIR, 'scaler.joblib')
    encoder_path = os.path.join(MODEL_DIR, 'label_encoder.joblib')
    metrics_path = os.path.join(MODEL_DIR, 'model_metrics.json')
    importance_path = os.path.join(MODEL_DIR, 'feature_importance.json')
    meta_path = os.path.join(MODEL_DIR, 'metadata.json')
    
    joblib.dump(best_model_obj, best_model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(label_encoder, encoder_path)
    
    full_metrics_export = {
        'selected_model': best_model_name,
        'requires_scaled_input': best_requires_scaled,
        'all_models_evaluated': {k: {m: v[m] for m in ['accuracy', 'precision_weighted', 'recall_weighted', 'f1_weighted']} for k, v in results.items()},
        'selected_model_metrics': best_eval_dict
    }
    
    with open(metrics_path, 'w') as f:
        json.dump(full_metrics_export, f, indent=2)
        
    with open(importance_path, 'w') as f:
        json.dump(best_eval_dict['feature_importance'], f, indent=2)
        
    metadata = {
        'num_samples': len(pipeline_data['clean_df']),
        'num_features': len(FEATURE_COLUMNS),
        'num_classes': len(classes),
        'classes': classes,
        'feature_names': FEATURE_COLUMNS,
        'selected_model': best_model_name,
        'requires_scaled_input': best_requires_scaled,
        'test_size': 0.2,
        'random_state': 42
    }
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("ML Pipeline Artifacts successfully exported to backend/saved_models/:")
    print(f" - Best Model: {best_model_path}")
    print(f" - Scaler: {scaler_path}")
    print(f" - Label Encoder: {encoder_path}")
    print(f" - Metrics JSON: {metrics_path}")
    print(f" - Feature Importances: {importance_path}")
    print(f" - Metadata: {meta_path}")

if __name__ == '__main__':
    train_and_evaluate_all()
