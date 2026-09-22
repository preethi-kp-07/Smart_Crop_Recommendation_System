import React from 'react';
import { PredictResponse, PredictInput } from '../types';
import { AdvisoryCard } from '../components/AdvisoryCard';
import { DynamicExplanations } from '../components/DynamicExplanations';
import { Sprout, RotateCcw, Award, CheckCircle2, ChevronRight, Droplets, Thermometer, CloudRain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultViewProps {
  response: PredictResponse;
  input: PredictInput;
  onReset: () => void;
  setActiveTab: (tab: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ response, input, onReset, setActiveTab }) => {
  const {
    recommended_crop,
    confidence,
    confidence_percentage,
    suitability_status,
    alternatives,
    explanations,
    advisory,
    agronomic_warnings
  } = response;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Highly Suitable':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Suitable':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const chartData = alternatives.map(alt => ({
    crop: alt.crop,
    percentage: alt.percentage,
    label: `${alt.percentage}%`
  }));

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#cbd5e1'];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Analyze Another Field</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-medium text-agri-700 hover:underline"
          >
            View Saved in History
          </button>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      <div className="bg-gradient-to-br from-agri-950 via-slate-900 to-agri-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-agri-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-agri-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(suitability_status)} shadow-xs`}>
                {suitability_status}
              </span>
              <span className="text-xs text-agri-300 font-mono">
                Model Confidence: {(confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-agri-400 font-semibold">Recommended Crop</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white capitalize">
                {recommended_crop}
              </h1>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Classified by Random Forest model using input soil chemistry (N: {input.nitrogen}, P: {input.phosphorus}, K: {input.potassium}, pH: {input.ph}) and climatic vectors (Temp: {input.temperature}°C, Humidity: {input.humidity}%, Rainfall: {input.rainfall} mm).
            </p>
          </div>

          {/* Large Confidence Circle */}
          <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-4xl font-extrabold text-emerald-400 mb-1">
              {confidence_percentage}%
            </div>
            <span className="text-xs text-slate-300 font-medium text-center">Prediction Probability</span>
            <span className="text-[10px] text-slate-400 text-center mt-2">
              (Statistically derived score)
            </span>
          </div>
        </div>
      </div>

      {/* Inputs Summary Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Input Field Configuration</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="block text-[10px] uppercase font-semibold text-emerald-700">Nitrogen</span>
            <span className="text-xs font-bold text-slate-900">{input.nitrogen} kg/ha</span>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <span className="block text-[10px] uppercase font-semibold text-blue-700">Phosphorus</span>
            <span className="text-xs font-bold text-slate-900">{input.phosphorus} kg/ha</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
            <span className="block text-[10px] uppercase font-semibold text-amber-700">Potassium</span>
            <span className="text-xs font-bold text-slate-900">{input.potassium} kg/ha</span>
          </div>
          <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
            <span className="block text-[10px] uppercase font-semibold text-purple-700">Soil pH</span>
            <span className="text-xs font-bold text-slate-900">{input.ph}</span>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
            <span className="block text-[10px] uppercase font-semibold text-rose-700">Temperature</span>
            <span className="text-xs font-bold text-slate-900">{input.temperature}°C</span>
          </div>
          <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-100">
            <span className="block text-[10px] uppercase font-semibold text-sky-700">Humidity</span>
            <span className="text-xs font-bold text-slate-900">{input.humidity}%</span>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <span className="block text-[10px] uppercase font-semibold text-indigo-700">Rainfall</span>
            <span className="text-xs font-bold text-slate-900">{input.rainfall} mm</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Alternative Crop Ranking + Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alternative Crops Ranking Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Alternative Crop Ranking</h3>
            <p className="text-xs text-slate-500">Sorted by model confidence / prediction probability</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="crop" type="category" tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Model Probability']} />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800 capitalize">#{idx + 1} {alt.crop}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-600 font-bold">{alt.percentage}%</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                    {alt.suitability_label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Dataset Explanations */}
        <DynamicExplanations
          explanations={explanations}
          warnings={agronomic_warnings}
          cropName={recommended_crop}
        />
      </div>

      {/* Advisory Component */}
      <AdvisoryCard advisory={advisory} cropName={recommended_crop} />
    </div>
  );
};
