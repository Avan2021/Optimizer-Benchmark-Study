import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import CompareTab from './components/CompareTab';
import LandscapeTab from './components/LandscapeTab';
import ReportTab from './components/ReportTab';
import IngestionModal from './components/IngestionModal';
import { fetchRuns } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [runs, setRuns] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [landscapeOptimizer, setLandscapeOptimizer] = useState('adam');

  const loadRuns = async () => {
    try {
      const data = await fetchRuns();
      setRuns(data || []);
      setBackendOnline(true);
    } catch (e) {
      console.warn('Backend not responding yet:', e.message);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    loadRuns();
    const interval = setInterval(loadRuns, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectRunForCompare = (runId) => {
    setActiveTab('compare');
  };

  const handleSelectRunForLandscape = (optimizer) => {
    setLandscapeOptimizer(optimizer || 'adam');
    setActiveTab('landscape');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Shared Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIngest={() => setIsIngestOpen(true)}
        backendOnline={backendOnline}
      />

      {/* Standardized Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            runs={runs}
            onSelectRunForCompare={handleSelectRunForCompare}
            onSelectRunForLandscape={handleSelectRunForLandscape}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <CompareTab runs={runs} />
        )}

        {activeTab === 'landscape' && (
          <LandscapeTab
            selectedOptimizer={landscapeOptimizer}
            onNavigateCompare={() => setActiveTab('compare')}
          />
        )}

        {activeTab === 'report' && (
          <ReportTab runs={runs} />
        )}
      </main>

      {/* Clean Secondary Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-medium text-slate-700">Optimizer Benchmark Study</span>
            <span>·</span>
            <span>CIFAR-10 Benchmark (PyTorch · FastAPI · React)</span>
          </div>
          <div>
            Grounded in Kingma & Ba (ICLR 2015) & Li et al. (NeurIPS 2018)
          </div>
        </div>
      </footer>

      {/* Ingestion Pipeline Modal */}
      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={loadRuns}
      />
    </div>
  );
}
