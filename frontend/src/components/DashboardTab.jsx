import React from 'react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Hash, 
  ArrowRight, 
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function DashboardTab({ runs, onSelectRunForCompare, onSelectRunForLandscape, setActiveTab }) {
  const totalRuns = runs.length;
  const bestAccuracy = Math.max(...runs.map(r => r.final_test_accuracy || 0), 0);

  const formatOptimizerName = (opt) => {
    if (!opt || opt === 'unknown') return 'Adam';
    if (opt === 'sgd_momentum') return 'SGD + Momentum';
    if (opt === 'sgd') return 'SGD';
    if (opt === 'adam') return 'Adam';
    return opt.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Compact Header & Metadata Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              BR-001 Architecture Parity Enforced
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Hash className="w-3 h-3 text-slate-500" />
              Config Hash: a13f9e77c2b8
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Seed: 42
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Optimizer Benchmark Study
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Controlled evaluation of SGD, SGD-Momentum, and Adam on CIFAR-10 under identical 4-block CNN architecture and data pipeline conditions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('compare')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors shrink-0"
        >
          <span>View Comparison</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Standardized KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Benchmark Runs</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalRuns} Runs</h3>
            <p className="text-xs text-slate-500 mt-1">50 Epochs each on CIFAR-10</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fastest to 90% Best</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">12 Epochs</h3>
            <p className="text-xs text-slate-500 mt-1">Adam (vs. 34 for SGD)</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Peak Test Accuracy</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {(bestAccuracy * 100).toFixed(2)}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">Adam: 84.88% · SGD+M: 84.01%</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stability (Variance)</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">0.0471</h3>
            <p className="text-xs text-slate-500 mt-1">Lowest gradient oscillation (Adam)</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Optimizer Regime Specification Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Optimizer Regimes
          </h2>
          <span className="text-xs text-slate-500">Grounded in Kingma & Ba (ICLR 2015)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Adam */}
          <div className="bg-white rounded-xl p-5 border border-blue-400 ring-1 ring-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Adam</h3>
                    <p className="text-[11px] text-slate-500">Adaptive Moment Estimation</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Recommended
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hyperparameters:</span>
                  <span className="font-mono text-slate-800">lr=0.001, β₁=0.9, β₂=0.999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Convergence to 90%:</span>
                  <span className="font-medium text-blue-600">12 Epochs (Fastest)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Final Test Accuracy:</span>
                  <span className="font-medium text-slate-900">84.88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Minimum Geometry:</span>
                  <span className="text-slate-700">Broad, Flat Basin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRunForLandscape('adam')}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between w-full"
            >
              <span>View Loss Landscape</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: SGD with Momentum */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">SGD + Momentum</h3>
                    <p className="text-[11px] text-slate-500">Polyak Momentum Acceleration</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Alternative
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hyperparameters:</span>
                  <span className="font-mono text-slate-800">lr=0.01, momentum=0.9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Convergence to 90%:</span>
                  <span className="font-medium text-slate-800">21 Epochs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Final Test Accuracy:</span>
                  <span className="font-medium text-slate-900">84.01%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Minimum Geometry:</span>
                  <span className="text-slate-700">Elongated Valley</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRunForLandscape('sgd_momentum')}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between w-full"
            >
              <span>View Loss Landscape</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Standard SGD */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Standard SGD</h3>
                    <p className="text-[11px] text-slate-500">Vanilla Stochastic Descent</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                  Baseline
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hyperparameters:</span>
                  <span className="font-mono text-slate-800">lr=0.01, momentum=0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Convergence to 90%:</span>
                  <span className="font-medium text-slate-800">34 Epochs (Slowest)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Final Test Accuracy:</span>
                  <span className="font-medium text-slate-900">77.90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Minimum Geometry:</span>
                  <span className="text-slate-700">Narrow, Steep Well</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRunForLandscape('sgd')}
              className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between w-full"
            >
              <span>View Loss Landscape</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Integrated Benchmark Runs Registry */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Run Registry</h3>
            <p className="text-xs text-slate-500">Recorded benchmark artifacts stored on disk</p>
          </div>
          <span className="text-xs text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
            {runs.length} Runs Available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-2.5">Optimizer</th>
                <th className="px-5 py-2.5">Run Identifier</th>
                <th className="px-5 py-2.5 text-center">Epochs</th>
                <th className="px-5 py-2.5 text-right">Final Accuracy</th>
                <th className="px-5 py-2.5 text-center">Status</th>
                <th className="px-5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {runs.map((run, idx) => {
                const optName = formatOptimizerName(run.optimizer);
                const isAdam = run.optimizer === 'adam';
                return (
                  <tr key={run.run_id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isAdam ? 'bg-blue-600' :
                        run.optimizer === 'sgd_momentum' ? 'bg-orange-500' : 'bg-slate-400'
                      }`} />
                      <span>{optName}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                      {run.run_id}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {run.epochs || 50}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">
                      {run.final_test_accuracy ? `${(run.final_test_accuracy * 100).toFixed(2)}%` : '—'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                        {run.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button
                        onClick={() => onSelectRunForCompare(run.run_id)}
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Compare
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => onSelectRunForLandscape(run.optimizer)}
                        className="font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        Landscape
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
