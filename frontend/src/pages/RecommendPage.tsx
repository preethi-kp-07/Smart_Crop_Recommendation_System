import React, { useState } from 'react';
import { api } from '../services/api';
import { PredictInput, PredictResponse } from '../types';
import { useHistory } from '../hooks/useHistory';
import { ResultView } from './ResultView';
import { Sparkles, Sprout, Thermometer, Droplets, CloudRain, Info, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

interface RecommendProps {
  setActiveTab: (tab: string) => void;
}

export const RecommendPage: React.FC<RecommendProps> = ({ setActiveTab }) => {
  const { addHistory } = useHistory();

  // Form state
  const [input, setInput] = useState<PredictInput>({
    nitrogen: 80,
    phosphorus: 45,
    potassium: 40,
    ph: 6.5,
    temperature: 24.0,
    humidity: 80.0,
    rainfall: 220.0,
    state: 'Punjab',
    district: 'Ludhiana',
    season: 'Kharif'
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [error, setError] = useState('');

  // Scenario presets for quick hackathon presentation
  const presets = [
    {
      name: 'Wetland Paddy (Rice)',
      data: { nitrogen: 90, phosphorus: 42, potassium: 43, temperature: 24, humidity: 82, ph: 6.4, rainfall: 230 }
    },
    {
      name: 'Semi-Arid Pulses (Chickpea)',
      data: { nitrogen: 40, phosphorus: 68, potassium: 80, temperature: 19, humidity: 17, ph: 7.3, rainfall: 80 }
    },
    {
      name: 'Cotton Belt',
      data: { nitrogen: 118, phosphorus: 46, potassium: 20, temperature: 24, humidity: 80, ph: 6.9, rainfall: 80 }
    },
    {
      name: 'Coffee Plantation',
      data: { nitrogen: 101, phosphorus: 29, potassium: 30, temperature: 25.5, humidity: 59, ph: 6.8, rainfall: 160 }
    },
    {
      name: 'Apple Orchard',
      data: { nitrogen: 21, phosphorus: 134, potassium: 200, temperature: 22.5, humidity: 92, ph: 5.9, rainfall: 113 }
    }
  ];

  const handleInputChange = (field: keyof PredictInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (presetData: Partial<PredictInput>) => {
    setInput(prev => ({ ...prev, ...presetData }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const steps = [
      'Analyzing soil chemistry parameters...',
      'Evaluating micro-climate weather vectors...',
      'Running Random Forest classifier inference...',
      'Ranking top alternative crop options...',
      'Generating non-hallucinated advisory report...'
    ];

    // Smooth loading progression
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const res = await api.predictCrop(input);
      setResponse(res);
      addHistory(input, res);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.response?.data?.detail || "Prediction request failed. Verify FastAPI server status.");
    } finally {
      setLoading(false);
    }
  };

  if (response) {
    return (
      <ResultView
        response={response}
        input={input}
        onReset={() => setResponse(null)}
        setActiveTab={setActiveTab}
      />
    );
  }

  const loadingMessages = [
    'Analyzing soil chemistry parameters...',
    'Evaluating micro-climate weather vectors...',
    'Running Random Forest classifier inference...',
    'Ranking top alternative crop options...',
    'Generating non-hallucinated advisory report...'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Precision Agriculture Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Crop Recommendation Form</h1>
        <p className="text-xs text-slate-500">
          Enter field soil parameters and local weather metrics to predict the most suitable crop class and obtain dynamic advisories.
        </p>
      </div>

      {/* Preset Scenario Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-agri-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-agri-300">
          <Zap className="w-4 h-4 text-agri-400" />
          <span>Quick Demo Scenario Presets (1-Click Fill)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="text-xs bg-slate-800/90 hover:bg-agri-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-agri-500 transition-all font-medium"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Field Context */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-agri-100 text-agri-800 text-xs flex items-center justify-center font-bold">1</span>
              <span>Field Location Context</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Contextual information for history logs. Physical soil and weather numerical vectors below drive the ML classifier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / Region</label>
              <input
                type="text"
                value={input.state || ''}
                onChange={e => handleInputChange('state', e.target.value)}
                placeholder="e.g. Punjab"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-agri-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District / Location</label>
              <input
                type="text"
                value={input.district || ''}
                onChange={e => handleInputChange('district', e.target.value)}
                placeholder="e.g. Ludhiana"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-agri-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Season</label>
              <select
                value={input.season || 'Kharif'}
                onChange={e => handleInputChange('season', e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-agri-500 bg-white"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
                <option value="Annual">Whole Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Soil Conditions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Soil Chemistry Parameters</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Soil macronutrients N-P-K (kg/ha) and pH level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nitrogen */}
            <div className="space-y-2 p-4 bg-emerald-50/40 rounded-xl border border-emerald-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-emerald-900">Nitrogen (N)</label>
                <span className="text-xs font-mono font-bold text-emerald-700">{input.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="1"
                value={input.nitrogen}
                onChange={e => handleInputChange('nitrogen', Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 kg/ha</span>
                <span>Typical: 20-120</span>
                <span>140 kg/ha</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-2 p-4 bg-blue-50/40 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-blue-900">Phosphorus (P)</label>
                <span className="text-xs font-mono font-bold text-blue-700">{input.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="145"
                step="1"
                value={input.phosphorus}
                onChange={e => handleInputChange('phosphorus', Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 kg/ha</span>
                <span>Typical: 15-135</span>
                <span>145 kg/ha</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-2 p-4 bg-amber-50/40 rounded-xl border border-amber-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-900">Potassium (K)</label>
                <span className="text-xs font-mono font-bold text-amber-700">{input.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="205"
                step="1"
                value={input.potassium}
                onChange={e => handleInputChange('potassium', Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5 kg/ha</span>
                <span>Typical: 15-200</span>
                <span>205 kg/ha</span>
              </div>
            </div>

            {/* Soil pH */}
            <div className="space-y-2 p-4 bg-purple-50/40 rounded-xl border border-purple-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-purple-900">Soil pH</label>
                <span className="text-xs font-mono font-bold text-purple-700">{input.ph}</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="9.5"
                step="0.1"
                value={input.ph}
                onChange={e => handleInputChange('ph', Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3.5 (Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>9.5 (Alkaline)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Weather Conditions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Weather & Climatic Vectors</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Temperature, relative humidity percentage, and annual precipitation (mm)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature */}
            <div className="space-y-2 p-4 bg-rose-50/40 rounded-xl border border-rose-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-900 flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Temperature</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">{input.temperature}°C</span>
              </div>
              <input
                type="range"
                min="8"
                max="45"
                step="0.5"
                value={input.temperature}
                onChange={e => handleInputChange('temperature', Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8°C</span>
                <span>45°C</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-2 p-4 bg-sky-50/40 rounded-xl border border-sky-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sky-900 flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Humidity</span>
                </span>
                <span className="text-xs font-mono font-bold text-sky-700">{input.humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={input.humidity}
                onChange={e => handleInputChange('humidity', Number(e.target.value))}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Rainfall */}
            <div className="space-y-2 p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rainfall</span>
                </span>
                <span className="text-xs font-mono font-bold text-indigo-700">{input.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="1"
                value={input.rainfall}
                onChange={e => handleInputChange('rainfall', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20 mm</span>
                <span>300 mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-agri-600 to-emerald-700 hover:from-agri-700 hover:to-emerald-800 text-white font-bold py-4 rounded-2xl text-base shadow-xl shadow-agri-600/30 hover:shadow-agri-600/50 transition-all flex items-center justify-center space-x-3 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>Analyze Field & Predict Suitable Crop</span>
          </button>
        </div>
      </form>

      {/* Loading Modal overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6 border border-slate-200">
            <div className="w-16 h-16 bg-agri-100 text-agri-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Sprout className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Analyzing Field Telemetry</h3>
              <p className="text-xs text-slate-500 mt-1">SmartCrop AI ML Pipeline Execution</p>
            </div>

            <div className="space-y-3 text-left">
              {loadingMessages.map((msg, idx) => {
                const isCurrent = idx === loadingStep;
                const isPassed = idx < loadingStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-agri-100 text-agri-900 border border-agri-300 font-bold'
                        : isPassed
                        ? 'text-slate-500 bg-slate-50 opacity-60'
                        : 'text-slate-300'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-agri-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{msg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
