from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class IngestResponse(BaseModel):
    run_id: UUID
    optimizer: str
    status: str
    message: str


class CompareRequest(BaseModel):
    run_ids: List[UUID]
    cnn_config_hash: str


class OptimizerResult(BaseModel):
    optimizer: str
    final_test_accuracy: float
    epochs_to_90pct_best: int
    grad_norm_variance: float


class CompareResponse(BaseModel):
    comparison_id: UUID
    cnn_config_hash: str
    seed: int
    results: List[OptimizerResult]
    recommended_optimizer: str
    status: str


class ReportStatusUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None


class ReportStatusResponse(BaseModel):
    report_id: UUID
    status: str
    updated_at: datetime


class EpochMetric(BaseModel):
    epoch: int
    train_loss: float
    validation_accuracy: float
    gradient_norm: float


class RunMetricsResponse(BaseModel):
    run_id: UUID
    optimizer: str
    seed: int
    metrics: List[EpochMetric]


class RunArtifactsResponse(BaseModel):
    run_id: UUID
    optimizer: str
    loss_landscape_path: str
    recommendation_report_path: str
    status: str
