import React from 'react';
import { CropCardItem } from '../types';
import { Thermometer, Droplets, CloudRain, ShieldAlert } from 'lucide-react';

interface CropCardProps {
  crop: CropCardItem;
  onClick: (crop: CropCardItem) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, onClick }) => {
  return (
    <div
      onClick={() => onClick(crop)}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-agri-300 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-agri-700 transition-colors capitalize">
            {crop.crop_name}
          </h3>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-full group-hover:bg-agri-100 group-hover:text-agri-800 transition-colors">
            {crop.sample_count} samples
          </span>
        </div>

        {/* NPK Badge Bar */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="block text-[10px] uppercase font-semibold text-emerald-700">Nitrogen</span>
            <span className="text-xs font-bold text-emerald-900">{crop.avg_N}</span>
          </div>
          <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
            <span className="block text-[10px] uppercase font-semibold text-blue-700">Phosphorus</span>
            <span className="text-xs font-bold text-blue-900">{crop.avg_P}</span>
          </div>
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
            <span className="block text-[10px] uppercase font-semibold text-amber-700">Potassium</span>
            <span className="text-xs font-bold text-amber-900">{crop.avg_K}</span>
          </div>
        </div>

        {/* Climate averages */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-500">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>Avg Temp</span>
            </span>
            <span className="font-semibold text-slate-800">{crop.avg_temperature}°C</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-500">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>Avg Humidity</span>
            </span>
            <span className="font-semibold text-slate-800">{crop.avg_humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-500">
              <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
              <span>Avg Rainfall</span>
            </span>
            <span className="font-semibold text-slate-800">{crop.avg_rainfall} mm</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-agri-700 font-semibold group-hover:translate-x-0.5 transition-transform">
        <span>View Agronomic Specs</span>
        <span>→</span>
      </div>
    </div>
  );
};
