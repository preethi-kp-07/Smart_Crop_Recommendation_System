import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib

FEATURE_COLUMNS = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
TARGET_COLUMN = 'label'

def load_raw_dataset(csv_path: str) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")
    df = pd.read_csv(csv_path)
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df_clean = df.copy()
    
    # 1. Check required columns
    required_cols = FEATURE_COLUMNS + [TARGET_COLUMN]
    for col in required_cols:
        if col not in df_clean.columns:
            raise ValueError(f"Missing required column in dataset: {col}")
            
    # 2. Convert features to numeric, force invalid to NaN
    for col in FEATURE_COLUMNS:
        df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
        
    # 3. Drop missing values if any
    df_clean = df_clean.dropna(subset=required_cols)
    
    # 4. Remove exact duplicates
    df_clean = df_clean.drop_duplicates()
    
    # 5. Clean string targets
    df_clean[TARGET_COLUMN] = df_clean[TARGET_COLUMN].astype(str).str.strip().str.lower()
    
    # 6. Clip negative values for N, P, K, humidity, rainfall to 0
    df_clean['N'] = np.maximum(df_clean['N'], 0.0)
    df_clean['P'] = np.maximum(df_clean['P'], 0.0)
    df_clean['K'] = np.maximum(df_clean['K'], 0.0)
    df_clean['humidity'] = np.clip(df_clean['humidity'], 0.0, 100.0)
    df_clean['ph'] = np.clip(df_clean['ph'], 0.0, 14.0)
    df_clean['rainfall'] = np.maximum(df_clean['rainfall'], 0.0)
    
    return df_clean

def prepare_pipeline_data(csv_path: str, test_size=0.2, random_state=42):
    raw_df = load_raw_dataset(csv_path)
    df = clean_data(raw_df)
    
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=test_size, random_state=random_state, stratify=y_encoded
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return {
        'clean_df': df,
        'X_train': X_train,
        'X_test': X_test,
        'X_train_scaled': X_train_scaled,
        'X_test_scaled': X_test_scaled,
        'y_train': y_train,
        'y_test': y_test,
        'scaler': scaler,
        'label_encoder': label_encoder,
        'feature_names': FEATURE_COLUMNS,
        'classes': list(label_encoder.classes_)
    }
