#!/bin/bash
set -e

echo "=========================================="
echo "  DevPilot AI - Backend Startup"
echo "=========================================="

echo "[1/3] Running Alembic database migrations..."
python -m alembic upgrade head
echo "      Migrations applied successfully."

echo "[2/3] Running database seeds..."
python -m app.seeds.projects_seed
echo "      Seeds applied successfully."

echo "[3/3] Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
