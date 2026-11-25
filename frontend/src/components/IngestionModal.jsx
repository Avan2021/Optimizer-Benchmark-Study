import React, { useState } from 'react';
import { X, UploadCloud, FileJson, AlertCircle, CheckCircle, Database, Sparkles, RefreshCw } from 'lucide-react';
import { ingestRun, ingestDefaultMetrics } from '../api/client';

export default function IngestionModal({ isOpen, onClose, onIngestSuccess }) {
  const [selectedOptimizer, setSelectedOptimizer] = useState('adam');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedFile) {
      setErrorMsg('Please select a JSON file to upload (or send an empty file to test validation).');
      return;
    }

    setLoading(true);
    try {
      const data = await ingestRun(selectedOptimizer, selectedFile);
      setSuccessMsg(`Run ingested successfully as ${selectedOptimizer}_${data.run_id}.json in uploaded_runs.`);
      if (onIngestSuccess) onIngestSuccess();
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Ingestion failed.';
      setErrorMsg(`HTTP ${err.response?.status || 400} Error: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmpty = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const emptyBlob = new Blob([''], { type: 'application/json' });
      const emptyFile = new File([emptyBlob], 'empty_test.json', { type: 'application/json' });
      await ingestRun(selectedOptimizer, emptyFile);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Empty file rejected.';
      setErrorMsg(`Expected Validation Error (HTTP ${err.response?.status}): ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestDefaults = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await ingestDefaultMetrics();
      setSuccessMsg(res.message || 'Benchmark metrics ingested from backend/metrics.');
      if (onIngestSuccess) onIngestSuccess();
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Failed to ingest defaults.';
      setErrorMsg(`Error: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Developer Ingestion Pipeline</h3>
              <p className="text-xs text-slate-500">Record training artifacts to backend/uploaded_runs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Quick Benchmark Ingest Card */}
          <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200/80 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                <Database className="w-3.5 h-3.5" />
                <span>Reference Benchmark Files</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Ingest adam_metrics.json, sgd_metrics.json, and sgd_momentum_metrics.json directly from backend/metrics.
              </p>
            </div>
            <button
              type="button"
              onClick={handleIngestDefaults}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Ingest Defaults</span>
            </button>
          </div>

          {/* Manual File Ingestion */}
          <form onSubmit={handleUpload} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Optimizer
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'adam', label: 'Adam' },
                  { id: 'sgd_momentum', label: 'SGD + Momentum' },
                  { id: 'sgd', label: 'SGD' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptimizer(opt.id)}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      selectedOptimizer === opt.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Metrics JSON File
              </label>
              <div className="relative border border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-4 text-center bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileJson className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : 'Select or drop JSON metrics artifact'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Requires train_loss, val_acc, grad_norm
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0 text-green-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestEmpty}
                disabled={loading}
                className="text-xs text-slate-500 hover:text-red-600 underline transition-colors disabled:opacity-50"
              >
                Test Empty File Validation (400)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Upload & Ingest</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
