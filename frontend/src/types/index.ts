export interface PredictInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  state?: string;
  district?: string;
  season?: string;
}

export interface AlternativeCrop {
  crop: string;
  score: number;
  percentage: number;
  suitability_label: string;
}

export interface AdvisoryOutput {
  soil_status: string;
  climate_status: string;
  favourable_conditions: string[];
  attention_conditions: string[];
  sowing_guidance: string;
}

export interface PredictResponse {
  recommended_crop: string;
  confidence: number;
  confidence_percentage: number;
  suitability_status: 'Highly Suitable' | 'Suitable' | 'Moderate' | 'Lower Confidence' | string;
  alternatives: AlternativeCrop[];
  input_summary: Record<string, any>;
  explanations: string[];
  advisory: AdvisoryOutput;
  agronomic_warnings: string[];
}

export interface CropCardItem {
  crop_name: string;
  sample_count: number;
  avg_N: number;
  avg_P: number;
  avg_K: number;
  avg_temperature: number;
  avg_humidity: number;
  avg_ph: number;
  avg_rainfall: number;
  min_rainfall: number;
  max_rainfall: number;
}

export interface DatasetSummary {
  total_records: number;
  total_crops: number;
  features: string[];
  crop_list: string[];
  records_per_crop: Record<string, number>;
}

export interface AnalyticsData {
  feature_stats: Record<string, { mean: number; std: number; min: number; max: number; median: number }>;
  crop_averages: Array<{
    crop: string;
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  }>;
  correlation_matrix: Record<string, Record<string, number>>;
  distributions: Record<string, Array<{ range: string; count: number }>>;
}

export interface ModelMetrics {
  selected_model: string;
  requires_scaled_input: boolean;
  all_models_evaluated: Record<string, {
    accuracy: number;
    precision_weighted: number;
    recall_weighted: number;
    f1_weighted: number;
  }>;
  selected_model_metrics: {
    accuracy: number;
    precision_weighted: number;
    recall_weighted: number;
    f1_weighted: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    confusion_matrix: number[][];
    classification_report: Record<string, any>;
    feature_importance: Record<string, number>;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  input: PredictInput;
  response: PredictResponse;
}
