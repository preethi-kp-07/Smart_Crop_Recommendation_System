import React from 'react';
import { Sprout, Sparkles, BarChart2, Cpu, Award, ShieldCheck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-agri-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-agri-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-agri-500/20 border border-agri-400/30 text-agri-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-agri-400" />
            <span>AI-Driven Precision Agriculture Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            SmartCrop AI
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-300 leading-relaxed">
            Intelligent Crop Recommendations Powered by Soil & Weather Analytics
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Analyze field soil chemistry, atmospheric parameters, and precipitation to classify optimal crop suitability, evaluate probability-ranked alternatives, and access dataset-derived agricultural advisories.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('recommend')}
              className="flex items-center space-x-2 bg-gradient-to-r from-agri-500 to-emerald-600 hover:from-agri-600 hover:to-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-agri-600/30 hover:shadow-agri-600/50 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>Analyze My Field</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all"
            >
              <BarChart2 className="w-5 h-5 text-agri-400" />
              <span>Explore Analytics</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats Banner */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div>
            <span className="block text-2xl font-bold text-white">22</span>
            <span className="text-xs text-slate-400">Crop Classes Analyzed</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-emerald-400">99.77%</span>
            <span className="text-xs text-slate-400">Model F1-Accuracy</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">2,200</span>
            <span className="text-xs text-slate-400">Training Field Records</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-amber-400">7</span>
            <span className="text-xs text-slate-400">Soil/Climate Features</span>
          </div>
        </div>
      </section>

      {/* Workflow: How It Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">How SmartCrop AI Works</h2>
          <p className="text-sm text-slate-500">
            A end-to-end Machine Learning pipeline transforming field telemetry into actionable crop advisories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-agri-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-extrabold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Input Soil & Weather</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter Nitrogen, Phosphorus, Potassium, Soil pH, Temperature, Relative Humidity, and Annual Rainfall parameters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-agri-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-extrabold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">ML Classification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Random Forest multi-class model evaluates non-linear feature interactions and estimates class probabilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-agri-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-extrabold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Alternative Crop Ranking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ranks top suitable alternative crops using calibrated model confidence scores to mitigate monoculture risk.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-agri-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-extrabold text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Actionable Advisory</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates dataset-derived explanations, soil management tips, climate stress alerts, and sowing guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Key Platform Capabilities</h2>
          <p className="text-sm text-slate-500">Built for hackathon demonstration, agricultural research, and precision agronomy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Soil Chemistry Evaluation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Checks N-P-K nutrient balances and soil pH levels against crop-specific empirical benchmarks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Weather & Micro-climate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrates ambient temperature, relative humidity, and precipitation thresholds for stress prevention.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dynamic ML Ranking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Evaluates 5 candidate ML algorithms (Random Forest, Gradient Boosting, Decision Tree, Logistic Regression, KNN) dynamically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Non-Hallucinated Advisory</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explanations and field advisories are generated directly from dataset statistics without hallucinating unverified facts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Model Insights & Metrics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full transparency with accuracy, precision, recall, F1 scores, feature importances, and multi-class confusion matrices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Out-of-Bound Warnings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Flags input values that fall far outside training data distributions to prevent invalid agricultural decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-agri-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ready to analyze field conditions?</h3>
          <p className="text-xs text-agri-200">
            Select predefined scenario presets or enter custom soil/weather parameters to generate crop recommendations.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('recommend')}
          className="flex items-center space-x-2 bg-white text-agri-950 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-agri-50 transition-all shrink-0"
        >
          <span>Launch Recommendation Engine</span>
          <ArrowRight className="w-4 h-4 text-agri-700" />
        </button>
      </section>
    </div>
  );
};
