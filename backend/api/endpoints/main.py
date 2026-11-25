from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import runs, compare, reports

app = FastAPI(title="Optimizer Benchmark Study API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(runs.router, prefix="/api/v1")
app.include_router(compare.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
