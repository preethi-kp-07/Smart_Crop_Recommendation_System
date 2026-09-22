import React from 'react';
import { Target, CheckCircle2, RefreshCw, Award } from 'lucide-react';

interface MetricsProps {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  modelName: string;
}

export const ModelMetricsCard: React.FC<MetricsProps> = ({
  accuracy,
  precision,
  recall,
  f1Score,
  modelName
}) => {
  const formatPct = (val: number) => (val * 100).toFixed(2) + '%';

  const metrics = [
    {
      title: 'Accuracy',
      value: formatPct(accuracy),
      desc: 'Overall correct crop predictions out of test set',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Precision (Weighted)',
      value: formatPct(precision),
      desc: 'Proportion of predicted crops that were correct',
      icon: CheckCircle2,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Recall (Weighted)',
      value: formatPct(recall),
      desc: 'Proportion of actual crop samples correctly identified',
      icon: RefreshCw,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'F1 Score (Weighted)',
      value: formatPct(f1Score),
      desc: 'Harmonic mean of precision and recall',
      icon: Award,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Active Classification Metrics</h3>
          <p className="text-xs text-slate-500">Evaluated on test split (20% holdout dataset)</p>
        </div>
        <span className="px-3 py-1 bg-agri-100 text-agri-800 text-xs font-semibold rounded-full border border-agri-300">
          Selected Model: {modelName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${m.borderColor} ${m.bgColor} shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{m.title}</span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${m.color} text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-extrabold ${m.textColor} mb-1`}>
                {m.value}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {m.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
