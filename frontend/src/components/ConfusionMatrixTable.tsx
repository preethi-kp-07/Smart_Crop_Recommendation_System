import React from 'react';

interface ConfusionMatrixProps {
  matrix: number[][];
  classes: string[];
}

export const ConfusionMatrixTable: React.FC<ConfusionMatrixProps> = ({ matrix, classes }) => {
  if (!matrix || matrix.length === 0 || !classes || classes.length === 0) {
    return <div className="text-slate-400 text-xs">No confusion matrix data available.</div>;
  }

  // Find max value in matrix for heatmap intensity
  let maxVal = 1;
  matrix.forEach(row => row.forEach(val => { if (val > maxVal) maxVal = val; }));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Multiclass Confusion Matrix</h4>
          <p className="text-xs text-slate-500">Rows = Actual Crop Labels, Columns = Predicted Crop Labels</p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
          <span className="inline-block w-3 h-3 bg-agri-600 rounded-xs"></span>
          <span>Diagonal = Correct Predictions</span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar max-h-96">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-slate-200 bg-slate-100 font-semibold text-slate-700 sticky left-0 z-10">
                Actual \ Pred
              </th>
              {classes.map((cls, idx) => (
                <th key={idx} className="p-2 border border-slate-200 bg-slate-100 font-medium text-slate-700 capitalize whitespace-nowrap min-w-[50px]">
                  {cls}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => {
              const actualClass = classes[rIdx] || `C${rIdx}`;
              return (
                <tr key={rIdx}>
                  <td className="p-2 border border-slate-200 bg-slate-50 font-medium text-slate-800 capitalize sticky left-0 z-10 whitespace-nowrap">
                    {actualClass}
                  </td>
                  {row.map((cellVal, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    let bgStyle = 'bg-white text-slate-600';
                    if (isDiagonal && cellVal > 0) {
                      const alpha = Math.max(0.25, cellVal / maxVal);
                      bgStyle = `bg-agri-600 text-white font-bold`;
                    } else if (cellVal > 0) {
                      bgStyle = 'bg-rose-100 text-rose-800 font-semibold';
                    }
                    return (
                      <td
                        key={cIdx}
                        className={`p-2 border border-slate-200 text-xs transition-colors ${bgStyle}`}
                        title={`Actual: ${actualClass}, Predicted: ${classes[cIdx]}, Count: ${cellVal}`}
                      >
                        {cellVal}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
