import api from '../config/axios';

// Run APIs
export const fetchRuns = async () => {
  const response = await api.get('/api/v1/runs');
  return response.data;
};

export const fetchRunMetrics = async (runId) => {
  const response = await api.get(`/api/v1/runs/${runId}/metrics`);
  return response.data;
};

export const fetchRunArtifacts = async (runId) => {
  const response = await api.get(`/api/v1/runs/${runId}/artifacts`);
  return response.data;
};

export const ingestRun = async (optimizer, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/api/v1/runs/${optimizer}/ingest`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const ingestDefaultMetrics = async () => {
  const response = await api.post('/api/v1/runs/ingest-defaults');
  return response.data;
};

// Compare API
export const analyzeComparison = async (runIds, cnnConfigHash = 'a13f9e77c2b8') => {
  const response = await api.post('/api/v1/compare/analyze', {
    run_ids: runIds,
    cnn_config_hash: cnnConfigHash,
  });
  return response.data;
};

// Report API
export const getReportStatus = async (reportId) => {
  const response = await api.get(`/api/v1/reports/${reportId}/status`);
  return response.data;
};

export const updateReportStatus = async (reportId, status, remarks = '') => {
  const response = await api.patch(`/api/v1/reports/${reportId}/status`, {
    status,
    remarks,
  });
  return response.data;
};

export default api;
