import axios from 'axios';
import {
  PredictInput,
  PredictResponse,
  DatasetSummary,
  AnalyticsData,
  CropCardItem,
  ModelMetrics
} from '../types';

const API_BASE = '/api';

export const api = {
  getHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },
  
  getDatasetSummary: async (): Promise<DatasetSummary> => {
    const res = await axios.get(`${API_BASE}/dataset/summary`);
    return res.data;
  },
  
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await axios.get(`${API_BASE}/analytics`);
    return res.data;
  },
  
  getAllCrops: async (): Promise<{ total: number; crops: CropCardItem[] }> => {
    const res = await axios.get(`${API_BASE}/crops`);
    return res.data;
  },

  getCropDetail: async (cropName: string) => {
    const res = await axios.get(`${API_BASE}/crop/${cropName}`);
    return res.data;
  },
  
  getModelMetrics: async (): Promise<ModelMetrics> => {
    const res = await axios.get(`${API_BASE}/model/metrics`);
    return res.data;
  },
  
  predictCrop: async (input: PredictInput): Promise<PredictResponse> => {
    const res = await axios.post(`${API_BASE}/predict`, input);
    return res.data;
  }
};
