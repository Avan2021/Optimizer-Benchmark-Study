import axios from 'axios';

// Use relative URL in development so Vite proxy handles it, with fallback
const API_BASE = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Run APIs
export const fetchRuns = async () => {
  const response = await apiClient.get('/runs');
  return response.data;
};

export const fetchRunMetrics = async (runId) => {
  const response = await apiClient.get(`/runs/${runId}/metrics`);
  return response.data;
};

export const fetchRunArtifacts = async (runId) => {
  const response = await apiClient.get(`/runs/${runId}/artifacts`);
  return response.data;
};

export const ingestRun = async (optimizer, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post(`/runs/${optimizer}/ingest`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const ingestDefaultMetrics = async () => {
  const response = await apiClient.post('/runs/ingest-defaults');
  return response.data;
};

// Compare API
export const analyzeComparison = async (runIds, cnnConfigHash = 'a13f9e77c2b8') => {
  const response = await apiClient.post('/compare/analyze', {
    run_ids: runIds,
    cnn_config_hash: cnnConfigHash,
  });
  return response.data;
};

// Report API
export const getReportStatus = async (reportId) => {
  const response = await apiClient.get(`/reports/${reportId}/status`);
  return response.data;
};

export const updateReportStatus = async (reportId, status, remarks = '') => {
  const response = await apiClient.patch(`/reports/${reportId}/status`, {
    status,
    remarks,
  });
  return response.data;
};

export default apiClient;
