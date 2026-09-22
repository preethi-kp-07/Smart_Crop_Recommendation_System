import React from 'react';
import { BookOpen, Database, Cpu, Sparkles, CheckCircle2, ArrowDown, Layers, Server } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const steps = [
    { title: '1. Raw Dataset Acquisition', desc: 'Standard Kaggle Crop Recommendation dataset containing 2,200 records across 22 crop classes with 7 numeric features (N, P, K, Temp, Humidity, pH, Rainfall).' },
    { title: '2. Data Cleaning & Sanitization', desc: 'Removing missing values, converting string types to float, removing duplicates, and clipping invalid negative values (e.g. negative NPK or pH out of 0-14 range).' },
    { title: '3. Data Transformation & Scaling', desc: 'LabelEncoding target crop labels into numeric target indices. StandardScaler normalizes feature distributions for distance-based models (Logistic Regression & KNN).' },
    { title: '4. Stratified Train-Test Split', desc: '80-20 stratified split ensuring balanced representation of all 22 crop classes across training (1,760 samples) and test sets (440 samples).' },
    { title: '5. Multi-Candidate Model Training', desc: 'Training 5 candidate classification algorithms: Random Forest (100 trees), Gradient Boosting, Decision Tree, Logistic Regression, and K-Nearest Neighbors.' },
    { title: '6. Automated Model Evaluation', desc: 'Computing test Accuracy, Weighted & Macro Precision, Recall, F1-scores, Confusion Matrix, and selecting winner candidate (Random Forest F1: 0.9977).' },
    { title: '7. Artifact Serialization via Joblib', desc: 'Serializing winning model (`best_model.joblib`), scaler, label encoder, metrics JSON, and feature importances to `backend/saved_models/`.' },
    { title: '8. FastAPI REST API Serving', desc: 'Exposing endpoint `/api/predict` receiving JSON inputs, running inference, computing class probabilities, and generating ranked alternatives.' },
    { title: '9. Dynamic Explanation & Advisory Engine', desc: 'Comparing user field vectors against dataset-derived crop statistics (min, max, mean, std) to generate factual explanations and soil management advice.' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>System Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Methodology & Pipeline Flowchart</h1>
        <p className="text-xs text-slate-500">
          Complete technical architecture breakdown matching hackathon Problem Statement PS23 requirements.
        </p>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-agri-600" />
          <span>End-to-End Machine Learning Pipeline</span>
        </h2>

        <div className="space-y-4 max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-agri-300 transition-all flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-agri-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1 text-slate-300">
                  <ArrowDown className="w-5 h-5 animate-pulse text-agri-500" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-agri-400" />
            <span>Technology Stack Implementation</span>
          </h2>
          <p className="text-xs text-slate-400">Strictly adheres to specified project technology stack</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="text-agri-400 font-bold uppercase tracking-wider block">Frontend</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• React 18 + TypeScript</li>
              <li>• Vite Build Tool</li>
              <li>• Tailwind CSS (AgriTech Palette)</li>
              <li>• Recharts Data Graphics</li>
              <li>• Lucide React Icons</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="text-agri-400 font-bold uppercase tracking-wider block">Backend</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Python 3.11</li>
              <li>• FastAPI Framework</li>
              <li>• Uvicorn ASGI Server</li>
              <li>• Pydantic Schema Validation</li>
              <li>• CORS Middleware Enabled</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="text-agri-400 font-bold uppercase tracking-wider block">Data & Machine Learning</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Scikit-Learn Classifier Suite</li>
              <li>• Pandas Dataframe Operations</li>
              <li>• NumPy Numerical Computing</li>
              <li>• Joblib Model Serialization</li>
              <li>• Optional PySpark Batch Script</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
