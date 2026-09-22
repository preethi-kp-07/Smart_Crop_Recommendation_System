import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart2, Filter, Layers, Database } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParam, setSelectedParam] = useState<'N' | 'P' | 'K' | 'temperature' | 'humidity' | 'ph' | 'rainfall'>('rainfall');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        setData(res);
      } catch (e) {
        console.error("Analytics fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading dataset analytics...</p>
      </div>
    );
  }

  const distData = data.distributions[selectedParam] || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart2 className="w-4 h-4" />
          <span>Exploratory Data Analysis</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Soil & Climate Analytics Dashboard</h1>
        <p className="text-xs text-slate-500">
          Statistical feature distributions, correlation matrices, and agronomic benchmarks derived directly from dataset records.
        </p>
      </div>

      {/* Feature Statistics Summary Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Feature Summary Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(data.feature_stats).map(([feat, stat]) => (
            <div key={feat} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-bold text-slate-800 uppercase block">{feat}</span>
              <div className="text-xs text-slate-600">Mean: <strong className="text-slate-900">{stat.mean}</strong></div>
              <div className="text-[10px] text-slate-400">Min: {stat.min} | Max: {stat.max}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Distribution Histogram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Parameter Distribution Histogram</h3>
            <p className="text-xs text-slate-500">Frequency distribution of samples across binned intervals</p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-semibold">Select Feature:</span>
            <select
              value={selectedParam}
              onChange={(e: any) => setSelectedParam(e.target.value)}
              className="text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white text-agri-900 focus:outline-none"
            >
              <option value="rainfall">Rainfall (mm)</option>
              <option value="temperature">Temperature (°C)</option>
              <option value="humidity">Humidity (%)</option>
              <option value="ph">Soil pH</option>
              <option value="N">Nitrogen (N)</option>
              <option value="P">Phosphorus (P)</option>
              <option value="K">Potassium (K)</option>
            </select>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="range" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} samples`, 'Frequency']} />
              <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crop Parameter Profiles Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Crop Agronomic Benchmarks</h3>
          <p className="text-xs text-slate-500">Dataset-derived average soil and climatic demands across 22 crop classes</p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.crop_averages} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="crop" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="humidity" name="Humidity (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="temperature" name="Temp (°C)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
