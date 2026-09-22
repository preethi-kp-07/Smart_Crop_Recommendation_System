import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ModelMetrics } from '../types';
import { ModelMetricsCard } from '../components/ModelMetricsCard';
import { ConfusionMatrixTable } from '../components/ConfusionMatrixTable';
import { Cpu, Award, HelpCircle, CheckCircle2, ShieldCheck, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ModelInsightsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const res = await api.getModelMetrics();
        setMetrics(res);
      } catch (e) {
        console.error("Model metrics fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading ML evaluation metrics & confusion matrix...</p>
      </div>
    );
  }

  const selectedMetrics = metrics.selected_model_metrics;
  const classes = Object.keys(selectedMetrics.classification_report || {}).filter(
    k => !['accuracy', 'macro avg', 'weighted avg'].includes(k)
  );

  const featImportance = selectedMetrics.feature_importance || {};
  const featData = Object.entries(featImportance).map(([key, value]) => ({
    feature: key,
    importance: Number((value * 100).toFixed(2))
  })).sort((a, b) => b.importance - a.importance);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#22c55e'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Machine Learning Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Model Insights & Metric Evaluations</h1>
        <p className="text-xs text-slate-500">
          Empirical evaluation results comparing candidate classifiers and feature importance attributions.
        </p>
      </div>

      {/* Top Banner Winner Model */}
      <div className="bg-gradient-to-r from-slate-900 via-agri-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
            <Award className="w-4 h-4" />
            <span>Winner Candidate Selected</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{metrics.selected_model}</h2>
          <p className="text-xs text-slate-300">
            Selected dynamically by F1-score evaluation across 5 candidate classifiers on test set split.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
          <div className="text-center">
            <span className="block text-2xl font-extrabold text-emerald-400">
              {(selectedMetrics.f1_weighted * 100).toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-300 font-medium">Weighted F1 Score</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Component */}
      <ModelMetricsCard
        accuracy={selectedMetrics.accuracy}
        precision={selectedMetrics.precision_weighted}
        recall={selectedMetrics.recall_weighted}
        f1Score={selectedMetrics.f1_weighted}
        modelName={metrics.selected_model}
      />

      {/* All Candidates Comparison Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Evaluated Candidate Classifier Models</h3>
          <p className="text-xs text-slate-500">Real validation performance metrics computed during `python ml/train.py` execution</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold">
                <th className="p-3 rounded-l-lg">Model Name</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision (Weighted)</th>
                <th className="p-3">Recall (Weighted)</th>
                <th className="p-3">F1-Score (Weighted)</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(metrics.all_models_evaluated || {}).map(([name, m]) => {
                const isSelected = name === metrics.selected_model;
                return (
                  <tr key={name} className={isSelected ? 'bg-agri-50/80 font-bold text-slate-900' : 'text-slate-600'}>
                    <td className="p-3 flex items-center space-x-2">
                      <span>{name}</span>
                      {isSelected && <span className="px-2 py-0.5 rounded-md bg-agri-600 text-white text-[10px] font-bold">ACTIVE</span>}
                    </td>
                    <td className="p-3 font-mono">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-3 font-mono">{(m.precision_weighted * 100).toFixed(2)}%</td>
                    <td className="p-3 font-mono">{(m.recall_weighted * 100).toFixed(2)}%</td>
                    <td className="p-3 font-mono font-bold text-agri-800">{(m.f1_weighted * 100).toFixed(2)}%</td>
                    <td className="p-3">
                      {isSelected ? (
                        <span className="text-emerald-700 text-[11px] font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Winner</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multiclass Confusion Matrix */}
      <ConfusionMatrixTable
        matrix={selectedMetrics.confusion_matrix}
        classes={classes}
      />

      {/* Feature Importance Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Feature Importance Breakdown</h3>
          <p className="text-xs text-slate-500">Relative contribution of input features in the trained classifier</p>
        </div>

        <div className="h-64 w-full">
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

      {/* Explanatory Footer Box */}
      <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl space-y-2 border border-slate-800">
        <div className="flex items-center space-x-2 text-agri-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What does Feature Importance mean?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Feature importance indicates how strongly each input variable (e.g. rainfall, temperature, soil N-P-K) contributed to reducing impurity or variance across node splits in the decision trees. It reflects statistical pattern association within the dataset, not independent agronomic causality.
        </p>
      </div>
    </div>
  );
};
