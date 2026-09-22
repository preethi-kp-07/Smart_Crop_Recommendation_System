import React from 'react';
import { Sprout, ShieldCheck, Database, Cpu, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SmartCrop AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data-driven agricultural advisory system evaluating soil parameters, micro-climates, and machine learning crop classification models.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1.5 rounded-md border border-emerald-800/50 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified ML Pipeline</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-agri-400 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-agri-400 transition-colors">
                  Executive Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('recommend')} className="hover:text-agri-400 transition-colors">
                  Crop Recommendation Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-agri-400 transition-colors">
                  Soil & Climate Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explorer')} className="hover:text-agri-400 transition-colors">
                  Crop Explorer Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: ML Engine */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">ML Stack & Analytics</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-agri-400" />
                <span>Random Forest Classifier</span>
              </li>
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-agri-400" />
                <span>2,200 Dataset Records</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Advisory Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">Agricultural Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Recommendations are computed dynamically from dataset statistical bounds and machine learning probabilities. Local field testing is advised before commercial planting.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Hackathon PS23 Prototype • FastAPI + Scikit-Learn + React
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 SmartCrop AI Platform. All rights reserved.</span>
          <span className="text-slate-400 font-medium">Built for Smart Agriculture & Environment Hackathon</span>
        </div>
      </div>
    </footer>
  );
};
