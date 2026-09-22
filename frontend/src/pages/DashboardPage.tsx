import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DatasetSummary, AnalyticsData, ModelMetrics } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { Sprout, Database, Cpu, Award, Sparkles, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [sumRes, anaRes, metRes] = await Promise.all([
          api.getDatasetSummary(),
          api.getAnalytics(),
          api.getModelMetrics()
        ]);
        setSummary(sumRes);
        setAnalytics(anaRes);
        setMetrics(metRes);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Could not load dashboard data from backend server. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading system analytics & ML metrics...</p>
      </div>
    );
  }

  if (error || !summary || !analytics || !metrics) {
    return (
      <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 space-y-3">
        <h3 className="font-bold text-base">Backend Connection Error</h3>
        <p className="text-xs">{error || 'Data payload unavailable.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Feature Importance Data for Recharts
  const featImportance = metrics.selected_model_metrics?.feature_importance || {};
  const featData = Object.entries(featImportance).map(([key, value]) => ({
    feature: key,
    importance: Number((value * 100).toFixed(2))
  })).sort((a, b) => b.importance - a.importance);

  // Top 10 crops for NPK breakdown
  const topCropsNPK = analytics.crop_averages.slice(0, 10);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive System Dashboard</h1>
          <p className="text-xs text-slate-500">Live operational data, crop sample statistics, and machine learning telemetry</p>
        </div>
        <button
          onClick={() => setActiveTab('recommend')}
          className="flex items-center space-x-2 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Field Recommendation</span>
        </button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop Classes</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{summary.total_crops}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Standard Agronomic Types</span>
          </div>
          <div className="p-3 bg-agri-100 text-agri-700 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dataset Records</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{summary.total_records.toLocaleString()}</div>
            <span className="text-[11px] text-slate-500">7 Features / Row</span>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selected Classifier</span>
            <div className="text-lg font-bold text-slate-900 mt-1 truncate max-w-[140px]" title={metrics.selected_model}>
              {metrics.selected_model}
            </div>
            <span className="text-[11px] text-purple-600 font-medium">Winner Candidate</span>
          </div>
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model F1 Accuracy</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {(metrics.selected_model_metrics.f1_weighted * 100).toFixed(2)}%
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Evaluated on Test Split</span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Importance Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Feature Importance (%)</h3>
              <p className="text-xs text-slate-500">Relative decision contribution of inputs in {metrics.selected_model}</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={featData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Importance']} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {featData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Crops NPK Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Nutrient Requirements (N-P-K)</h3>
              <p className="text-xs text-slate-500">Average Nitrogen, Phosphorus & Potassium demands for major crop types</p>
            </div>
            <button onClick={() => setActiveTab('analytics')} className="text-xs text-agri-700 font-semibold flex items-center hover:underline">
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCropsNPK} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="crop" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="N" name="Nitrogen (N)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="P" name="Phosphorus (P)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="K" name="Potassium (K)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
