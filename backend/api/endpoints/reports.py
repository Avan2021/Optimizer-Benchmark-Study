from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException

from api.endpoints.schemas import ReportStatusUpdate, ReportStatusResponse
from api.endpoints.store import reports_db

router = APIRouter(prefix="/reports", tags=["reports"])


@router.patch("/{report_id}/status", response_model=ReportStatusResponse)
async def update_report_status(report_id: str, payload: ReportStatusUpdate):
    now = datetime.now(timezone.utc)
    reports_db[report_id] = {
        "status": payload.status,
        "remarks": payload.remarks,
        "updated_at": now
    }

    return ReportStatusResponse(
        report_id=report_id,
        status=payload.status,
        updated_at=now
    )


@router.get("/{report_id}/status", response_model=ReportStatusResponse)
async def get_report_status(report_id: str):
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found.")
    report = reports_db[report_id]
    return ReportStatusResponse(
        report_id=report_id,
        status=report["status"],
        updated_at=report.get("updated_at", datetime.now(timezone.utc))
    )
