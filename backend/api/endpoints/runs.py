import json
import os
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, HTTPException

from api.endpoints.schemas import IngestResponse, RunMetricsResponse, RunArtifactsResponse, EpochMetric
from api.endpoints.store import runs_db, get_run, list_all_runs, UPLOAD_DIR, METRICS_DIR

router = APIRouter(prefix="/runs", tags=["runs"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=List[Dict[str, Any]])
async def get_all_runs():
    """Retrieve all available benchmark runs."""
    return list_all_runs()


@router.post("/ingest-defaults")
async def ingest_default_metrics():
    """Ingest benchmark runs from the backend/metrics directory."""
    if not os.path.exists(METRICS_DIR):
        raise HTTPException(status_code=404, detail="Metrics directory not found.")

    mapping = {
        "adam_metrics.json": "adam",
        "sgd_metrics.json": "sgd",
        "sgd_momentum_metrics.json": "sgd_momentum"
    }

    ingested = []
    for filename, optimizer in mapping.items():
        file_path_src = os.path.join(METRICS_DIR, filename)
        if os.path.exists(file_path_src):
            with open(file_path_src, "r") as f:
                metrics_data = json.load(f)

            run_id = uuid.uuid4()
            file_path_dest = os.path.join(UPLOAD_DIR, f"{optimizer}_{run_id}.json")

            metrics_data["optimizer"] = optimizer
            metrics_data["run_id"] = str(run_id)

            with open(file_path_dest, "w") as f:
                json.dump(metrics_data, f, indent=2)

            runs_db[str(run_id)] = {
                "optimizer": optimizer,
                "file_path": file_path_dest,
                "status": "COMPLETED"
            }

            ingested.append({
                "run_id": str(run_id),
                "optimizer": optimizer,
                "epochs": len(metrics_data.get("train_loss", [])),
                "final_test_accuracy": metrics_data.get("val_acc", [0])[-1] if metrics_data.get("val_acc") else 0.0,
                "message": f"Successfully ingested {optimizer} from {filename}"
            })

    return {"message": f"Ingested {len(ingested)} benchmark runs.", "runs": ingested}


@router.post("/{optimizer}/ingest", response_model=IngestResponse, status_code=202)
async def ingest_run(optimizer: str, file: UploadFile):
    file_bytes = await file.read()
    if not file_bytes or len(file_bytes.strip()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        metrics_data = json.loads(file_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Uploaded file is not valid JSON.")

    run_id = uuid.uuid4()
    file_path = os.path.join(UPLOAD_DIR, f"{optimizer}_{run_id}.json")

    # Add metadata into JSON content so it's clear whose metrics they are
    metrics_data["optimizer"] = optimizer
    metrics_data["run_id"] = str(run_id)

    with open(file_path, "w") as saved_file:
        json.dump(metrics_data, saved_file, indent=2)

    runs_db[str(run_id)] = {
        "optimizer": optimizer,
        "file_path": file_path,
        "status": "INDEXING"
    }

    return IngestResponse(
        run_id=run_id,
        optimizer=optimizer,
        status="INDEXING",
        message="Metrics artifact received. Comparison indexing job queued."
    )


@router.get("/{run_id}/metrics", response_model=RunMetricsResponse)
async def get_run_metrics(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

    with open(run["file_path"]) as metrics_file:
        metrics_data = json.load(metrics_file)

    epoch_list = []
    train_loss = metrics_data.get("train_loss", [])
    val_acc = metrics_data.get("val_acc", [])
    grad_norm = metrics_data.get("grad_norm", [])

    for i in range(len(train_loss)):
        epoch_list.append(EpochMetric(
            epoch=i + 1,
            train_loss=train_loss[i],
            validation_accuracy=val_acc[i] if i < len(val_acc) else 0.0,
            gradient_norm=grad_norm[i] if i < len(grad_norm) else 0.0
        ))

    return RunMetricsResponse(
        run_id=run_id,
        optimizer=run["optimizer"],
        seed=42,
        metrics=epoch_list
    )


@router.get("/{run_id}/artifacts", response_model=RunArtifactsResponse)
async def get_run_artifacts(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

    return RunArtifactsResponse(
        run_id=run_id,
        optimizer=run["optimizer"],
        loss_landscape_path=f"/artifacts/loss_landscape_{run['optimizer']}.png",
        recommendation_report_path=f"/reports/{run['optimizer']}_recommendation.pdf",
        status="AVAILABLE"
    )
