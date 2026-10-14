from fastapi import FastAPI

from api.endpoints import runs, compare, reports

app = FastAPI(title="Optimizer Benchmark Study API")

app.include_router(runs.router, prefix="/api/v1")
app.include_router(compare.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
