import { useState, useEffect } from 'react';
import { HistoryItem, PredictInput, PredictResponse } from '../types';

const STORAGE_KEY = 'smartcrop_recommendation_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const addHistory = (input: PredictInput, response: PredictResponse) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      input,
      response
    };
    setHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep latest 50
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addHistory, clearHistory };
}
