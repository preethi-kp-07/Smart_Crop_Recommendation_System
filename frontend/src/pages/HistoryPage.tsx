import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { HistoryItem } from '../types';
import { ResultView } from './ResultView';
import { History, Trash2, Calendar, ChevronRight, Sprout } from 'lucide-react';

interface HistoryProps {
  setActiveTab: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryProps> = ({ setActiveTab }) => {
  const { history, clearHistory } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  if (selectedItem) {
    return (
      <ResultView
        response={selectedItem.response}
        input={selectedItem.input}
        onReset={() => setSelectedItem(null)}
        setActiveTab={setActiveTab}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Browser Session Storage</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Recommendation History</h1>
          <p className="text-xs text-slate-500">
            Previously analyzed field telemetry stored locally ({history.length} saved records)
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Saved Recommendation Records</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't run any field predictions yet in this browser session.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('recommend')}
            className="px-5 py-2.5 bg-agri-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-agri-700 transition-all"
          >
            Analyze First Field
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-agri-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 capitalize">
                      {item.response.recommended_crop}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {item.response.confidence_percentage}% Confidence
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.timestamp}</span>
                    </span>
                    <span>•</span>
                    <span>Location: {item.input.state || 'Field Input'}</span>
                  </div>
                </div>
              </div>

              {/* Input Quick Summary */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span>N: <strong>{item.input.nitrogen}</strong></span>
                <span>P: <strong>{item.input.phosphorus}</strong></span>
                <span>K: <strong>{item.input.potassium}</strong></span>
                <span>pH: <strong>{item.input.ph}</strong></span>
                <span>Rain: <strong>{item.input.rainfall}mm</strong></span>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="flex items-center space-x-1 px-4 py-2 bg-agri-50 text-agri-800 hover:bg-agri-100 rounded-xl text-xs font-bold border border-agri-200 transition-colors shrink-0"
              >
                <span>View Full Advisory</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
