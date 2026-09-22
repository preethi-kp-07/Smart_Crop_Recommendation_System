import os
import numpy as np
import pandas as pd

def generate_crop_dataset():
    np.random.seed(42)
    
    # Agronomic profiles for 22 standard crops (N, P, K, Temp, Humidity, pH, Rainfall)
    crop_profiles = {
        'rice': {'N': (80, 10), 'P': (47, 7), 'K': (40, 5), 'temp': (23.6, 2.0), 'humidity': (82.3, 3.0), 'ph': (6.4, 0.4), 'rainfall': (236.2, 25.0)},
        'maize': {'N': (77, 10), 'P': (48, 7), 'K': (20, 3), 'temp': (22.4, 2.5), 'humidity': (65.2, 4.0), 'ph': (6.2, 0.3), 'rainfall': (84.8, 12.0)},
        'chickpea': {'N': (40, 6), 'P': (67, 8), 'K': (80, 5), 'temp': (18.9, 1.5), 'humidity': (16.8, 2.0), 'ph': (7.3, 0.4), 'rainfall': (80.1, 8.0)},
        'kidneybeans': {'N': (20, 4), 'P': (67.5, 7), 'K': (20, 3), 'temp': (20.1, 2.0), 'humidity': (21.6, 2.5), 'ph': (5.7, 0.2), 'rainfall': (105.9, 15.0)},
        'pigeonpeas': {'N': (20.7, 5), 'P': (67.7, 7), 'K': (20, 3), 'temp': (27.7, 2.5), 'humidity': (48.1, 6.0), 'ph': (5.8, 0.5), 'rainfall': (149.5, 20.0)},
        'mothbeans': {'N': (20, 5), 'P': (48, 6), 'K': (20, 3), 'temp': (28.2, 2.0), 'humidity': (53.2, 5.0), 'ph': (6.8, 0.6), 'rainfall': (51.2, 8.0)},
        'mungbean': {'N': (20.9, 5), 'P': (47.3, 6), 'K': (19.9, 3), 'temp': (28.5, 1.5), 'humidity': (85.5, 3.0), 'ph': (6.7, 0.3), 'rainfall': (48.4, 6.0)},
        'blackgram': {'N': (40, 6), 'P': (67.5, 7), 'K': (19.2, 3), 'temp': (29.9, 2.0), 'humidity': (65.1, 4.0), 'ph': (7.1, 0.3), 'rainfall': (67.8, 6.0)},
        'lentil': {'N': (18.8, 4), 'P': (68, 7), 'K': (19.4, 3), 'temp': (24.5, 2.5), 'humidity': (64.8, 4.0), 'ph': (6.9, 0.4), 'rainfall': (45.7, 5.0)},
        'pomegranate': {'N': (18.8, 4), 'P': (18.8, 4), 'K': (40.2, 4), 'temp': (21.8, 2.0), 'humidity': (90.1, 2.5), 'ph': (6.4, 0.3), 'rainfall': (107.5, 6.0)},
        'banana': {'N': (100.2, 12), 'P': (82, 8), 'K': (50, 4), 'temp': (27.4, 1.5), 'humidity': (80.4, 3.0), 'ph': (6.0, 0.3), 'rainfall': (104.6, 8.0)},
        'mango': {'N': (20.1, 5), 'P': (27.2, 4), 'K': (30, 3), 'temp': (31.2, 2.5), 'humidity': (50.2, 3.5), 'ph': (5.8, 0.4), 'rainfall': (94.7, 6.0)},
        'grapes': {'N': (23.2, 5), 'P': (132.5, 8), 'K': (200, 5), 'temp': (23.8, 3.0), 'humidity': (81.9, 2.5), 'ph': (6.0, 0.3), 'rainfall': (69.6, 4.0)},
        'watermelon': {'N': (99.4, 10), 'P': (17, 3), 'K': (50.2, 4), 'temp': (25.6, 1.2), 'humidity': (85.2, 3.0), 'ph': (6.5, 0.3), 'rainfall': (50.8, 5.0)},
        'muskmelon': {'N': (100.3, 10), 'P': (17.7, 3), 'K': (50.1, 4), 'temp': (28.6, 1.2), 'humidity': (92.3, 2.0), 'ph': (6.4, 0.2), 'rainfall': (24.7, 3.0)},
        'apple': {'N': (20.8, 5), 'P': (134.2, 8), 'K': (199.9, 5), 'temp': (22.6, 1.5), 'humidity': (92.3, 2.0), 'ph': (5.9, 0.3), 'rainfall': (112.7, 7.0)},
        'orange': {'N': (19.6, 5), 'P': (15.8, 3), 'K': (10.0, 2), 'temp': (22.8, 3.0), 'humidity': (92.2, 2.0), 'ph': (7.0, 0.4), 'rainfall': (110.5, 7.0)},
        'papaya': {'N': (49.9, 7), 'P': (59.1, 6), 'K': (50.0, 4), 'temp': (33.7, 3.5), 'humidity': (92.5, 2.0), 'ph': (6.7, 0.2), 'rainfall': (142.6, 20.0)},
        'coconut': {'N': (21.9, 5), 'P': (16.9, 3), 'K': (30.1, 3), 'temp': (27.4, 1.5), 'humidity': (94.8, 2.0), 'ph': (6.0, 0.3), 'rainfall': (175.7, 18.0)},
        'cotton': {'N': (117.8, 12), 'P': (46.2, 6), 'K': (19.6, 3), 'temp': (23.9, 1.8), 'humidity': (79.8, 3.0), 'ph': (6.9, 0.4), 'rainfall': (80.4, 8.0)},
        'jute': {'N': (78.4, 10), 'P': (46.8, 6), 'K': (39.9, 4), 'temp': (24.9, 1.5), 'humidity': (79.6, 3.5), 'ph': (6.7, 0.3), 'rainfall': (174.8, 15.0)},
        'coffee': {'N': (101.2, 10), 'P': (28.7, 4), 'K': (29.9, 3), 'temp': (25.5, 1.8), 'humidity': (58.9, 4.0), 'ph': (6.8, 0.3), 'rainfall': (158.1, 18.0)},
    }
    
    samples_per_crop = 100
    rows = []
    
    for crop, profile in crop_profiles.items():
        for _ in range(samples_per_crop):
            n = float(np.clip(np.random.normal(profile['N'][0], profile['N'][1]), 0, 140))
            p = float(np.clip(np.random.normal(profile['P'][0], profile['P'][1]), 5, 145))
            k = float(np.clip(np.random.normal(profile['K'][0], profile['K'][1]), 5, 205))
            temp = float(np.clip(np.random.normal(profile['temp'][0], profile['temp'][1]), 8.0, 45.0))
            humidity = float(np.clip(np.random.normal(profile['humidity'][0], profile['humidity'][1]), 10.0, 100.0))
            ph = float(np.clip(np.random.normal(profile['ph'][0], profile['ph'][1]), 3.5, 9.5))
            rainfall = float(np.clip(np.random.normal(profile['rainfall'][0], profile['rainfall'][1]), 20.0, 300.0))
            
            rows.append({
                'N': round(n, 2),
                'P': round(p, 2),
                'K': round(k, 2),
                'temperature': round(temp, 2),
                'humidity': round(humidity, 2),
                'ph': round(ph, 2),
                'rainfall': round(rainfall, 2),
                'label': crop
            })
            
    df = pd.DataFrame(rows)
    # Shuffle dataset
    df = df.sample(frac=1.0, random_state=42).reset_index(drop=True)
    
    os.makedirs('backend/data', exist_ok=True)
    filepath = 'backend/data/crop_recommendation.csv'
    df.to_csv(filepath, index=False)
    print(f"Dataset generated cleanly at {filepath} with {len(df)} rows across {df['label'].nunique()} crop classes.")

if __name__ == '__main__':
    generate_crop_dataset()
