import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExplanationsProps {
  explanations: string[];
  warnings: string[];
  cropName: string;
}

export const DynamicExplanations: React.FC<ExplanationsProps> = ({
  explanations,
  warnings,
  cropName
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
        <div className="p-2 rounded-xl bg-agri-100 text-agri-700">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Why {cropName}?</h3>
          <p className="text-xs text-slate-500">Dataset-derived evidence comparing field inputs with crop sample statistics</p>
        </div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warn, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {explanations.map((exp, idx) => (
          <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">{exp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
