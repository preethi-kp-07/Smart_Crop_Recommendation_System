import React from 'react';
import { AdvisoryOutput } from '../types';
import { ShieldAlert, CheckCircle, Lightbulb, Thermometer, Droplets, Compass } from 'lucide-react';

interface AdvisoryCardProps {
  advisory: AdvisoryOutput;
  cropName: string;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory, cropName }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-agri-600" />
            <span>Crop Advisory & Field Management</span>
          </h3>
          <p className="text-xs text-slate-500">
            Agronomic recommendations for <strong className="text-slate-800 capitalize">{cropName}</strong>
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-300">
          Dataset-Derived Advisory
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Soil Status */}
        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
            <Droplets className="w-4 h-4 text-emerald-600" />
            <span>Soil Status</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {advisory.soil_status}
          </p>
        </div>

        {/* Climate Status */}
        <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200/80 space-y-2">
          <div className="flex items-center space-x-2 text-sky-800 font-bold text-sm">
            <Thermometer className="w-4 h-4 text-sky-600" />
            <span>Climate Status</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {advisory.climate_status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Favourable Conditions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Key Favourable Conditions</span>
          </h4>
          <ul className="space-y-2">
            {advisory.favourable_conditions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions Needing Attention */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Conditions Needing Attention</span>
          </h4>
          <ul className="space-y-2">
            {advisory.attention_conditions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* General Sowing Guidance */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800">
        <div className="flex items-center space-x-2 text-agri-400 font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Sowing & Cultivation Guidance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {advisory.sowing_guidance}
        </p>
      </div>
    </div>
  );
};
