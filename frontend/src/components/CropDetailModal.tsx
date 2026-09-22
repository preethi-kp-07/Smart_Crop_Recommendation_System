import React from 'react';
import { CropCardItem } from '../types';
import { X, Sprout, Thermometer, Droplets, CloudRain, Activity } from 'lucide-react';

interface ModalProps {
  crop: CropCardItem | null;
  onClose: () => void;
}

export const CropDetailModal: React.FC<ModalProps> = ({ crop, onClose }) => {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center shadow-lg shadow-agri-500/30">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{crop.crop_name}</h2>
            <p className="text-xs text-slate-500">Agronomic profile from {crop.sample_count} training records</p>
          </div>
        </div>

        {/* NPK Parameters Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Soil Nutrient Demands</h4>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="block text-[11px] font-semibold text-emerald-700 uppercase">N</span>
              <span className="text-base font-bold text-emerald-950">{crop.avg_N} <span className="text-[10px]">kg/ha</span></span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="block text-[11px] font-semibold text-blue-700 uppercase">P</span>
              <span className="text-base font-bold text-blue-950">{crop.avg_P} <span className="text-[10px]">kg/ha</span></span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="block text-[11px] font-semibold text-amber-700 uppercase">K</span>
              <span className="text-base font-bold text-amber-950">{crop.avg_K} <span className="text-[10px]">kg/ha</span></span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="block text-[11px] font-semibold text-purple-700 uppercase">pH</span>
              <span className="text-base font-bold text-purple-950">{crop.avg_ph}</span>
            </div>
          </div>
        </div>

        {/* Climate Metrics */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Climatic Growth Requirements</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-rose-700 text-xs font-bold">
                <Thermometer className="w-4 h-4" />
                <span>Temperature</span>
              </div>
              <div className="mt-2 text-lg font-bold text-rose-950">{crop.avg_temperature}°C</div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-sky-700 text-xs font-bold">
                <Droplets className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <div className="mt-2 text-lg font-bold text-sky-950">{crop.avg_humidity}%</div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-indigo-700 text-xs font-bold">
                <CloudRain className="w-4 h-4" />
                <span>Rainfall</span>
              </div>
              <div className="mt-2 text-lg font-bold text-indigo-950">{crop.avg_rainfall} <span className="text-xs">mm</span></div>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-agri-600 shrink-0" />
          <span>Observed dataset rainfall boundaries range from {crop.min_rainfall} mm to {crop.max_rainfall} mm.</span>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Close Spec Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
