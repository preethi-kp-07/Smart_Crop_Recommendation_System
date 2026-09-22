import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CropCardItem } from '../types';
import { CropCard } from '../components/CropCard';
import { CropDetailModal } from '../components/CropDetailModal';
import { BookOpen, Search, Filter, SlidersHorizontal } from 'lucide-react';

export const CropExplorerPage: React.FC = () => {
  const [crops, setCrops] = useState<CropCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rainfall' | 'nitrogen' | 'temp'>('name');
  const [selectedCrop, setSelectedCrop] = useState<CropCardItem | null>(null);

  useEffect(() => {
    async function loadCrops() {
      try {
        setLoading(true);
        const res = await api.getAllCrops();
        setCrops(res.crops);
      } catch (e) {
        console.error("Crop explorer fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  const filteredCrops = crops.filter(c => 
    c.crop_name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'rainfall') return b.avg_rainfall - a.avg_rainfall;
    if (sortBy === 'nitrogen') return b.avg_N - a.avg_N;
    if (sortBy === 'temp') return b.avg_temperature - a.avg_temperature;
    return a.crop_name.localeCompare(b.crop_name);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading crop catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-agri-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Agronomic Catalog</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Crop Explorer Catalog</h1>
        <p className="text-xs text-slate-500">
          Browse dataset profiles for all {crops.length} crop classes. Filter by parameter demands and open detailed specifications.
        </p>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search crop name (e.g. Rice, Coffee)..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-agri-500 bg-slate-50"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
            >
              <option value="name">Crop Name (A-Z)</option>
              <option value="rainfall">Highest Avg Rainfall</option>
              <option value="nitrogen">Highest Nitrogen Demand</option>
              <option value="temp">Highest Avg Temperature</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Crop Cards */}
      {filteredCrops.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          No crop matching "{search}" found. Try another search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCrops.map((c, idx) => (
            <CropCard key={idx} crop={c} onClick={setSelectedCrop} />
          ))}
        </div>
      )}

      {/* Spec Modal */}
      <CropDetailModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  );
};
