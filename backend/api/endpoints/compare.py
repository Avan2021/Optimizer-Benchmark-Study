import os
import json
import uuid
from fastapi import APIRouter, HTTPException

from api.endpoints.schemas import CompareRequest, CompareResponse, OptimizerResult
from api.endpoints.store import get_run

router = APIRouter(prefix="/compare", tags=["compare"])


@router.post("/analyze", response_model=CompareResponse)
async def analyze_comparison(payload: CompareRequest):
    results = []
    for run_id in payload.run_ids:
        run = get_run(str(run_id))
        if not run:
            raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

        final_test_accuracy = 0.0
        epochs_to_90pct_best = 0
        grad_norm_variance = 0.0

        if os.path.exists(run.get("file_path", "")):
            try:
                with open(run["file_path"], "r") as mf:
                    mdata = json.load(mf)
                val_acc = mdata.get("val_acc", [])
                if val_acc:
                    final_test_accuracy = float(val_acc[-1])
                    best_acc = max(val_acc)
                    threshold = 0.9 * best_acc
                    for ep_idx, acc in enumerate(val_acc):
                        if acc >= threshold:
                            epochs_to_90pct_best = ep_idx + 1
                            break
                grad_norm = mdata.get("grad_norm", [])
                if grad_norm:
                    mean_gn = sum(grad_norm) / len(grad_norm)
                    grad_norm_variance = float(sum((x - mean_gn) ** 2 for x in grad_norm) / len(grad_norm))
            except Exception:
                pass

        results.append(OptimizerResult(
            optimizer=run["optimizer"],
            final_test_accuracy=final_test_accuracy,
            epochs_to_90pct_best=epochs_to_90pct_best,
            grad_norm_variance=grad_norm_variance
        ))

    best_result = min(results, key=lambda r: r.epochs_to_90pct_best) if results else None

    return CompareResponse(
        comparison_id=uuid.uuid4(),
        cnn_config_hash=payload.cnn_config_hash,
        seed=42,
        results=results,
        recommended_optimizer=best_result.optimizer if best_result else "",
        status="PENDING_REVIEW"
    )
