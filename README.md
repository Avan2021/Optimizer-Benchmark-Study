# Optimizer Benchmark Study: SGD vs. SGD-Momentum vs. Adam

[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A controlled, reproducible benchmark comparing **SGD**, **SGD + Momentum**, and **Adam** on an identical CNN architecture and seed — grounded in Kingma & Ba's *Adam: A Method for Stochastic Optimization* (ICLR 2015).

---

## Table of Contents

- [Overview](#overview)
- [Why This Project](#why-this-project)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the Benchmark](#running-the-benchmark)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Results Snapshot](#results-snapshot)
- [Roadmap](#roadmap)
- [Cost](#cost)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ML teams routinely default to a single optimizer — usually Adam — without re-validating that choice against the architecture and dataset in front of them. **Optimizer Benchmark Study** replaces that instinct with evidence: it trains one fixed CNN on CIFAR-10 under three optimizer regimes, holding the seed, data pipeline, and architecture identical across all runs so any difference in outcome can be attributed to the optimizer alone.

The system logs convergence speed, final accuracy, and training stability per run, generates filter-normalized loss-landscape visualizations to make the qualitative differences between optimizers visible, and surfaces everything through a FastAPI + React application — ending in a concrete, downloadable recommendation instead of a guess.

## Why This Project

| Problem | This Project's Answer |
|---|---|
| Optimizer choice is usually based on convention, not evidence | Controlled A/B/C comparison with a fixed CNN + seed |
| Informal benchmarks vary data order, init, or hyperparameters | Global seed + config-hash verification enforced programmatically |
| Numeric metrics alone don't explain *why* one optimizer wins | Filter-normalized loss-landscape plots visualize the minima |
| Results live in a notebook nobody revisits | Persisted runs, metrics, and reports served via REST API + dashboard |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Axios |
| Backend | FastAPI (Python 3.10) |
| ML / Training | PyTorch, Torchvision, Matplotlib, NumPy |
| Database | SQLite (dev) → PostgreSQL / Supabase (prod) |
| Auth | OAuth2 + JWT (HMAC-SHA256) |
| CI/CD | GitHub Actions |
| Hosting | Netlify (frontend) · Render (backend) · Supabase (DB) — free tier |

## System Architecture

```
┌────────────────┐      ┌────────────────────┐      ┌───────────────────────┐
│   React SPA     │◄────►│   FastAPI Server    │◄────►│  SQLite / PostgreSQL   │
│ (dashboard, UX)  │      │ (routing, auth,     │      │ (runs, epoch_metrics)  │
└────────────────┘      │  recommendation svc) │      └───────────────────────┘
                          └──────────┬──────────┘
                                     │ reads artifacts
                          ┌──────────▼──────────┐
                          │ Training Orchestrator │
                          │ (seed + config-hash   │
                          │  enforcement, CLI)     │
                          └──────────┬──────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              ┌──────────┐   ┌──────────────┐  ┌──────────────┐
              │   SGD    │   │ SGD+Momentum │  │     Adam     │
              │  Trainer │   │   Trainer    │  │   Trainer    │
              └────┬─────┘   └──────┬───────┘  └──────┬───────┘
                   └────────────────┼─────────────────┘
                                     ▼
                     Matplotlib Loss-Landscape Generator
                        (filter-normalized 2D surface)
```

**Pipeline flow:**
1. Orchestrator sets the global seed and verifies the CNN config hash.
2. Each optimizer (SGD, SGD+momentum, Adam) trains against the identical CNN; per-epoch loss, accuracy, and gradient norm are logged.
3. A filter-normalized loss-landscape surface is generated per run as a post-training step.
4. FastAPI serves run metrics, comparison results, and artifacts.
5. The comparison engine computes *Epochs to 90% of Best Accuracy* and generates a plain-language recommendation.
6. The React dashboard renders convergence curves, stability stats, and the recommendation; the engineer exports the report.

## Repository Structure

```
optimizer-benchmark-study/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── runs.py
│   │   │   ├── compare.py
│   │   │   └── reports.py
│   │   ├── core/config.py
│   │   ├── db/session.py
│   │   ├── models/
│   │   │   ├── run.py
│   │   │   └── schemas.py
│   │   └── services/
│   │       ├── metrics_service.py
│   │       ├── comparison_engine.py
│   │       └── optimizer_factory.py
│   ├── tests/
│   ├── render.yaml
│   └── requirements.txt
├── frontend/
├── ml/
│   ├── notebooks/
│   │   └── optimizer_comparison.ipynb
│   ├── checkpoints/
│   │   └── cnn_adam_best.pt
│   └── train.py
├── netlify.toml
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A CUDA-capable GPU (recommended) or CPU fallback for smoke testing
- `git`

### Clone the Repository

```bash
git clone https://github.com/org/optimizer-benchmark-study.git
cd optimizer-benchmark-study
```

### Backend Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running the Benchmark

Training runs offline via the CLI orchestrator, then results are ingested by the API:

```bash
# From the repo root
python ml/train.py --optimizer all --seed 42
```

This trains SGD, SGD+momentum, and Adam sequentially against the identical CNN, logs per-epoch metrics, and generates loss-landscape artifacts under `ml/checkpoints/`.

**Access the running services:**

| Service | URL |
|---|---|
| Web Dashboard | http://localhost:5173 |
| Interactive API Docs (Swagger) | http://localhost:8000/docs |

## Configuration

Optimizer hyperparameters follow the Adam paper's defaults and are fixed for the base comparison:

| Optimizer | Learning Rate | Momentum | β1 | β2 | ε |
|---|---|---|---|---|---|
| SGD | 1e-2 | — | — | — | — |
| SGD + Momentum | 1e-2 | 0.9 | — | — | — |
| Adam | 1e-3 | — | 0.9 | 0.999 | 1e-8 |

Shared across all runs: Cross-Entropy loss, Dropout (p=0.3) before the classifier head, identical global seed, identical CNN config hash.

## API Reference

Base path: `/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/runs/{optimizer}/ingest` | Ingest a training run's metrics artifact |
| `POST` | `/compare/analyze` | Trigger comparison analysis across run IDs |
| `PATCH` | `/reports/{report_id}/status` | Approve/dismiss a recommendation report |
| `GET` | `/runs/{run_id}/metrics` | Retrieve per-epoch training metrics |
| `GET` | `/runs/{run_id}/artifacts` | Retrieve loss-landscape + report paths |

Full interactive documentation is auto-generated by FastAPI at `/docs` (Swagger UI) and `/redoc`.

## Database Schema

**`runs`** — run metadata: `id`, `optimizer`, `seed`, `cnn_config_hash`, `started_at`, `completed_at`, `final_test_accuracy`, `status`, `reviewed_by`, `loss_landscape_path`, `recommendation_report_path`

**`epoch_metrics`** — per-epoch data: `id`, `run_id`, `epoch`, `train_loss`, `val_loss`, `train_acc`, `val_acc`, `grad_norm`

Indexes: B-tree on `runs(optimizer)`, B-tree on `epoch_metrics(run_id)`, unique composite on `runs(cnn_config_hash, seed, optimizer)`.

## Testing

```bash
# Backend (unit + integration + E2E)
cd backend
pytest tests/unit tests/integration

# Frontend
cd frontend
npm run test
```

Key test coverage includes CNN forward-pass shape validation, global-seed determinism (bit-for-bit reproducibility), optimizer-factory instantiation, artifact upload validation, and an end-to-end `/compare/analyze` pipeline check.

## CI/CD

GitHub Actions runs on every push to `main` and on pull requests:

1. Checkout code
2. Set up Python 3.10 and Node.js 18
3. Install PyTorch (CPU mode) and backend dependencies
4. Run PyTest suite, including a reduced-scale training smoke test
5. Run frontend tests (Vitest/Jest)

## Deployment

| Component | Provider | Tier |
|---|---|---|
| Frontend | Netlify | Free |
| Backend | Render | Free |
| Database | Supabase (PostgreSQL) | Free |

Configuration lives in `netlify.toml` and `backend/render.yaml`.

## Results Snapshot

| Optimizer | Final Test Accuracy | Epochs to 90% Best Accuracy | Gradient-Norm Variance |
|---|---|---|---|
| SGD | 0.712 | 34 | 0.081 |
| SGD + Momentum | 0.758 | 21 | 0.063 |
| **Adam** | **0.761** | **12** | **0.047** |

*Adam reached 90% of its best accuracy in roughly a third of the epochs SGD needed, with the lowest gradient-norm variance of the three.*

## Roadmap

- [ ] Extend to additional optimizers (AdamW, RMSprop, Nadam)
- [ ] Compare across additional CNN architectures beyond the reference model
- [ ] Promote learning-rate scheduler comparison to a first-class feature

## Cost

Entire stack runs on free tiers — **~$0.00/month** (local/Colab GPU compute, Render, Netlify, Supabase free tier).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
