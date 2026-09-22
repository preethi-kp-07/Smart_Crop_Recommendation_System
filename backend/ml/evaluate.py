import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)

def evaluate_classifier(model, X_test, y_test, class_names, feature_names):
    y_pred = model.predict(X_test)
    
    acc = float(accuracy_score(y_test, y_pred))
    
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(y_test, y_pred, average='macro', zero_division=0)
    
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    report_dict = classification_report(y_test, y_pred, target_names=class_names, output_dict=True, zero_division=0)
    
    # Feature importances extraction
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        feature_importance = {feat: float(imp) for feat, imp in zip(feature_names, importances)}
    elif hasattr(model, 'coef_'):
        importances = np.mean(np.abs(model.coef_), axis=0)
        # Normalize sum to 1
        total = np.sum(importances)
        if total > 0:
            importances = importances / total
        feature_importance = {feat: float(imp) for feat, imp in zip(feature_names, importances)}
    else:
        # Equal dummy attribution if model lacks builtin feature importance (e.g. KNN)
        feature_importance = {feat: float(1.0 / len(feature_names)) for feat in feature_names}

    return {
        'accuracy': round(acc, 4),
        'precision_weighted': round(float(prec_w), 4),
        'recall_weighted': round(float(rec_w), 4),
        'f1_weighted': round(float(f1_w), 4),
        'precision_macro': round(float(prec_m), 4),
        'recall_macro': round(float(rec_m), 4),
        'f1_macro': round(float(f1_m), 4),
        'confusion_matrix': cm,
        'classification_report': report_dict,
        'feature_importance': feature_importance
    }
