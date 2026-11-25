import React, { useState } from 'react';
import { Mountain, ArrowRight, Layers, Compass, CheckCircle2 } from 'lucide-react';

export default function LandscapeTab({ selectedOptimizer = 'adam', onNavigateCompare }) {
  const [activeOptimizer, setActiveOptimizer] = useState(selectedOptimizer);

  const optimizerProfiles = {
    adam: {
      name: 'Adam',
      formalName: 'Adaptive Moment Estimation',
      minimaType: 'Broad, Flat Basin',
      sharpnessScore: '0.14 (Very Flat)',
      epochsTo90: 12,
      finalAccuracy: '84.88%',
      gradVariance: 0.0471,
      lossValue: '0.36',
      observations: [
        'Exhibits a wide, convex basin around converged weights, indicating high tolerance to parameter perturbations.',
        'Adaptive per-parameter learning rates prevent severe oscillations in high-curvature dimensions.',
        'Flat minima geometry strongly correlates with superior test-set generalization on CIFAR-10.'
      ]
    },
    sgd_momentum: {
      name: 'SGD + Momentum',
      formalName: 'Polyak Momentum Accelerated SGD',
      minimaType: 'Elongated Valley',
      sharpnessScore: '0.38 (Moderate)',
      epochsTo90: 21,
      finalAccuracy: '84.01%',
      gradVariance: 0.0632,
      lossValue: '0.48',
      observations: [
        'Accumulates velocity along persistent gradients, dampening oscillations across narrow ravines.',
        'Settles into an elongated valley with moderate curvature along secondary directions.',
        'Demonstrates competitive test accuracy (84.01%) while requiring nearly double the epochs of Adam.'
      ]
    },
    sgd: {
      name: 'Standard SGD',
      formalName: 'Stochastic Gradient Descent',
      minimaType: 'Narrow, Steep Well',
      sharpnessScore: '0.79 (Sharp)',
      epochsTo90: 34,
      finalAccuracy: '77.90%',
      gradVariance: 0.0814,
      lossValue: '0.74',
      observations: [
        'Converges to a significantly sharper, steeper minimum prone to loss spikes under small weight shifts.',
        'High gradient variance (0.0814) causes slow traversal through flat loss regions and saddle points.',
        'Requires 34 epochs to reach 90% of best accuracy, yielding the lowest final generalization (77.90%).'
      ]
    },
  };

  const profile = optimizerProfiles[activeOptimizer] || optimizerProfiles.adam;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Compact Header: Integrated Title and Optimizer Switcher */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mountain className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Filter-Normalized Loss Landscape
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2D loss-surface projection sampled along two filter-normalized random perturbation directions (Li et al., 2018).
          </p>
        </div>

        {/* Optimizer Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          {[
            { id: 'adam', label: 'Adam' },
            { id: 'sgd_momentum', label: 'SGD + Momentum' },
            { id: 'sgd', label: 'SGD' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveOptimizer(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeOptimizer === item.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Center Canvas: Contour Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {profile.name} Converged Minimum
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {profile.minimaType}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-[11px]">Resolution: 15 × 15 grid</span>
              <span>•</span>
              <span className="font-mono text-[11px]">Span: [-1.0, 1.0]</span>
            </div>
          </div>

          {/* Clean SVG Contour Plot */}
          <div className="relative flex-1 min-h-[360px] my-4 rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
            
            {/* Subtle background coordinate grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <svg className="w-full h-full max-w-[400px] max-h-[340px]" viewBox="0 0 100 100">
              {/* Axes */}
              <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
              <line x1="50" y1="8" x2="50" y2="92" stroke="#334155" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
              
              <text x="86" y="47" fill="#94a3b8" fontSize="2.8" fontFamily="monospace">Direction 1</text>
              <text x="52" y="12" fill="#94a3b8" fontSize="2.8" fontFamily="monospace">Direction 2</text>

              {/* Contours by optimizer */}
              {activeOptimizer === 'adam' ? (
                <>
                  <ellipse cx="50" cy="50" rx="42" ry="38" fill="none" stroke="#2563eb" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
                  <ellipse cx="50" cy="50" rx="34" ry="30" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
                  <ellipse cx="50" cy="50" rx="25" ry="22" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.8" />
                  <ellipse cx="50" cy="50" rx="16" ry="14" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.9" />
                  <ellipse cx="50" cy="50" rx="8" ry="7" fill="rgba(37, 99, 235, 0.25)" stroke="#bfdbfe" strokeWidth="1.5" />
                  
                  <circle cx="50" cy="50" r="2.2" fill="#16a34a" />
                  <text x="53" y="49" fill="#f8fafc" fontSize="2.8" fontFamily="monospace font-semibold">Min (L = 0.36)</text>
                  <text x="76" y="54" fill="#93c5fd" fontSize="2.2" fontFamily="monospace">L = 0.50</text>
                  <text x="84" y="54" fill="#60a5fa" fontSize="2.2" fontFamily="monospace">L = 0.70</text>
                </>
              ) : activeOptimizer === 'sgd_momentum' ? (
                <>
                  <ellipse cx="50" cy="50" rx="40" ry="24" transform="rotate(-25 50 50)" fill="none" stroke="#ea580c" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
                  <ellipse cx="50" cy="50" rx="31" ry="18" transform="rotate(-25 50 50)" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.6" />
                  <ellipse cx="50" cy="50" rx="22" ry="12" transform="rotate(-25 50 50)" fill="none" stroke="#fb923c" strokeWidth="1" opacity="0.8" />
                  <ellipse cx="50" cy="50" rx="13" ry="7" transform="rotate(-25 50 50)" fill="rgba(234, 88, 12, 0.25)" stroke="#fdba74" strokeWidth="1.2" />
                  
                  <circle cx="50" cy="50" r="2.2" fill="#f59e0b" />
                  <text x="53" y="49" fill="#f8fafc" fontSize="2.8" fontFamily="monospace font-semibold">Min (L = 0.48)</text>
                  <text x="74" y="42" fill="#fb923c" fontSize="2.2" fontFamily="monospace">L = 0.65</text>
                  <text x="83" y="38" fill="#f97316" fontSize="2.2" fontFamily="monospace">L = 0.85</text>
                </>
              ) : (
                <>
                  <ellipse cx="50" cy="50" rx="38" ry="34" fill="none" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="1.5,1.5" opacity="0.4" />
                  <ellipse cx="50" cy="50" rx="26" ry="23" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.6" />
                  <ellipse cx="50" cy="50" rx="16" ry="14" fill="none" stroke="#f87171" strokeWidth="1" opacity="0.8" />
                  <ellipse cx="50" cy="50" rx="7" ry="6" fill="rgba(220, 38, 38, 0.3)" stroke="#fca5a5" strokeWidth="1.5" />
                  
                  <circle cx="50" cy="50" r="2.2" fill="#dc2626" />
                  <text x="53" y="49" fill="#f8fafc" fontSize="2.8" fontFamily="monospace font-semibold">Min (L = 0.74)</text>
                  <text x="68" y="54" fill="#f87171" fontSize="2.2" fontFamily="monospace">L = 0.95</text>
                  <text x="78" y="54" fill="#ef4444" fontSize="2.2" fontFamily="monospace">L = 1.25</text>
                </>
              )}
            </svg>

            {/* Compact Curvature Indicator */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800 text-[11px] text-slate-300">
              Curvature: <span className="text-white font-medium">{profile.sharpnessScore}</span>
            </div>
          </div>

          {/* Methodology Footnote */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Direction vectors normalized by filter Frobenius norm (Li et al., NeurIPS 2018).
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Seed: 42</span>
          </div>
        </div>

        {/* Right Sidebar: Diagnostics & Qualitative Analysis */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">
                Diagnostics Panel
              </h3>
              <span className="text-xs text-slate-500 font-medium">CIFAR-10</span>
            </div>

            {/* Metric Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Regime:</span>
                <span className="font-medium text-slate-900">{profile.formalName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Convergence to 90%:</span>
                <span className="font-medium text-slate-900">{profile.epochsTo90} Epochs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Final Test Accuracy:</span>
                <span className="font-semibold text-blue-600">{profile.finalAccuracy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Gradient Norm Variance:</span>
                <span className="font-mono text-slate-900">{profile.gradVariance}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Loss at Center:</span>
                <span className="font-mono text-slate-900">L = {profile.lossValue}</span>
              </div>
            </div>

            {/* Qualitative Observations */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-800 mb-2">Observations:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {profile.observations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onNavigateCompare}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <span>Compare Convergence Curves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact Methodology Note */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Normalization Standard</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Filter-wise normalization scales each random perturbation direction to match the Frobenius norm of its corresponding weight filter, ensuring curvature comparisons remain invariant to parameter scale.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
