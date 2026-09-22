# SmartCrop AI — Smart Crop Recommendation & Advisory System

> **Hackathon Problem Statement PS23**: Smart Crop Recommendation System Based on Soil & Weather Analytics.

SmartCrop AI is a complete, data-driven precision agriculture web application. It analyzes field soil chemistry parameters (Nitrogen, Phosphorus, Potassium, Soil pH) and atmospheric micro-climates (Temperature, Relative Humidity, Rainfall), evaluates multi-class machine learning classification models, ranks alternative crop probabilities, generates dynamic non-hallucinated crop advisories, and provides an executive analytics dashboard.

---

## 🚀 Key Features

1. **Automated ML Classification Pipeline**:
   - Evaluates 5 candidate classifiers dynamically: **Random Forest**, **Gradient Boosting**, **Decision Tree**, **Logistic Regression**, and **K-Nearest Neighbors (KNN)**.
   - Automatically selects the winner model based on validation weighted F1-score (`Random Forest` achieved **99.77% F1-score**).
   - Serializes trained pipeline artifacts via Joblib (`best_model.joblib`, `scaler.joblib`, `label_encoder.joblib`, `model_metrics.json`, `feature_importance.json`).

2. **Probability-Ranked Alternative Crops**:
   - Ranks top suitable crop alternatives using actual model output probabilities (`predict_proba()`) to prevent monoculture risks.

3. **Non-Hallucinated Explanation & Advisory Engine**:
   - Compares user input vectors against dataset-derived crop statistics (min, max, mean, std) to explain *why* a crop was selected.
   - Generates tailored soil status, climate status, key favourable conditions, conditions needing attention, and general sowing guidance.

4. **Out-of-Distribution Warning Alerts**:
   - Detects input values that fall far outside dataset training boundaries and issues soft warning alerts.

5. **Interactive Recharts Dashboards**:
   - Executive Dashboard, Soil & Climate Analytics, Crop Explorer catalog with 22 crop classes, Recommendation History stored in `localStorage`, and Model Insights page with confusion matrix heatmaps.

---

## 🏗️ Project Architecture

```
smartcrop-ai/
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point & CORS configuration
│   │   ├── routes/
│   │   │   ├── health.py             # GET /api/health
│   │   │   ├── dataset.py            # GET /api/dataset/summary, /api/crops, /api/crop/{name}
│   │   │   ├── analytics.py          # GET /api/analytics
│   │   │   ├── predict.py            # POST /api/predict
│   │   │   └── model_info.py         # GET /api/model/metrics, /api/model/feature-importance
│   │   ├── services/
│   │   │   ├── ml_service.py         # Model loading, inference & probability ranking
│   │   │   ├── analytics_service.py  # Dataset statistics & aggregation logic
│   │   │   └── advisory_service.py   # Dataset-derived crop advisory generator
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic request/response schemas
│   │   └── utils/
│   │       └── explanation_engine.py # Dynamic statistical explanation engine
│   ├── ml/
│   │   ├── preprocess.py             # Data cleaning, outlier handling & normalization
│   │   ├── evaluate.py               # Accuracy, precision, recall, F1, confusion matrix
│   │   ├── train.py                  # Candidate model evaluation & winner selection script
│   │   └── optional_pyspark_analytics.py # PySpark batch processing script
│   ├── data/
│   │   ├── crop_recommendation.csv   # Standard 2,200 sample crop dataset (22 classes)
│   │   └── generate_dataset.py       # Dataset generator script
│   ├── saved_models/                 # Serialized ML artifacts & metrics JSON
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, Metrics, Advisory, ConfusionMatrix, etc.
│   │   ├── pages/                    # Home, Dashboard, Recommend, Analytics, Explorer, History, ModelInsights, Methodology
│   │   ├── services/                 # Axios API service client
│   │   ├── hooks/                    # useHistory (LocalStorage hook)
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── App.tsx                   # Main React component
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React icons.
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic.
- **Machine Learning & Data**: Scikit-Learn, Pandas, NumPy, Joblib, SciPy, PySpark (optional batch analytics script).

---

## 📊 ML Model Evaluation Results

Evaluation performed on 20% stratified test split (440 holdout samples):

| Classifier Model | Accuracy | Precision (Weighted) | Recall (Weighted) | F1-Score (Weighted) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | **0.9977** | **0.9978** | **0.9977** | **0.9977** | **Winner Selected** |
| Gradient Boosting | 0.9909 | 0.9919 | 0.9909 | 0.9911 | Evaluated |
| K-Nearest Neighbors (KNN) | 0.9909 | 0.9913 | 0.9909 | 0.9909 | Evaluated |
| Logistic Regression | 0.9886 | 0.9894 | 0.9886 | 0.9886 | Evaluated |
| Decision Tree | 0.9727 | 0.9757 | 0.9727 | 0.9728 | Evaluated |

---

## 🔌 API Endpoints Documentation

- `GET /api/health`: Health status & loaded model info.
- `GET /api/dataset/summary`: Total records, crops count, features list.
- `GET /api/analytics`: Complete feature statistics, nutrient averages, correlation matrix, histograms.
- `GET /api/crops`: All 22 crop cards with average parameters.
- `GET /api/crop/{crop_name}`: Detailed parameters for a target crop.
- `POST /api/predict`: Runs ML prediction, returns recommended crop, confidence score, ranked alternatives, dynamic explanations, and advisory.
- `GET /api/model/metrics`: Model evaluation scores, confusion matrix, and classification report.
- `GET /api/model/feature-importance`: Feature importance dictionary.

---



## 📌 Distributed Big Data Analytics Note

For production deployments with >10M telemetry records, batch aggregations can be scaled using PySpark:
```bash
python -m backend.ml.optional_pyspark_analytics
```

---

## 🔒 Limitations & Future Enhancements

1. **Weather Integration**: Integrates user micro-climate inputs; real-time OpenWeatherMap API key integration can be plugged into `backend/app/routes/predict.py`.
2. **Soil Sensor Integration**: Hardware IoT micro-controllers (e.g. ESP32 NPK sensors) can send telemetry directly to `/api/predict`.

---
© 2026 SmartCrop AI Platform • Hackathon PS23 Prototype
