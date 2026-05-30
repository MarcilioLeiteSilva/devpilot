# EasyPanel Deployment Guide - DevPilot AI

This document provides step-by-step instructions for deploying the **DevPilot AI** platform on EasyPanel (a modern, Docker-based hosting control panel).

---

## Architecture Overview

On EasyPanel, we will orchestrate 5 main services:
1. **`devpilot-postgres`**: Relational database (PostgreSQL 16)
2. **`devpilot-redis`**: Worker and task queue (Redis 7)
3. **`devpilot-qdrant`**: Long-term memory vector database (Qdrant)
4. **`devpilot-api`**: Backend server (FastAPI)
5. **`devpilot-frontend`**: Web interface (Next.js 15)

All services should be deployed in a single EasyPanel project to share the internal secure network and resolve each other by container name.

---

## 1. Database Services

### A. PostgreSQL (`devpilot-postgres`)
1. Create a new service in your project using the **Postgres** template.
2. **Service Name**: `devpilot-postgres`
3. **Environment Variables**:
   - `POSTGRES_DB`: `devpilot`
   - `POSTGRES_USER`: `postgres`
   - `POSTGRES_PASSWORD`: `[YourStrongPassword]` (e.g., `devpilotpass123`)
4. **Volumes**:
   - EasyPanel handles persistent volume allocation automatically. Ensure a mount is mapped to `/var/lib/postgresql/data`.

### B. Redis (`devpilot-redis`)
1. Create a new service in your project using the **Redis** template.
2. **Service Name**: `devpilot-redis`
3. **Volumes**:
   - Ensure a persistent mount is mapped to `/data`.

### C. Qdrant (`devpilot-qdrant`)
1. Create a new service using the standard **App** template.
2. **Service Name**: `devpilot-qdrant`
3. **Docker Image**: `qdrant/qdrant:v1.9.1`
4. **Ports**:
   - Map container port `6333` to host port `6333` (optional, or keep it private to project).
5. **Volumes**:
   - Create a volume and mount it to `/qdrant/storage`.

---

## 2. Application Services

### A. Backend API (`devpilot-api`)
The backend is built from the GitHub repository using the `backend/Dockerfile`.

1. Create a new service using the **App** template.
2. **Service Name**: `devpilot-api`
3. **Source**: Select **Git Repository**
   - **Repository**: `https://github.com/your-username/devpilot.git`
   - **Branch**: `main`
   - **Build Path**: `/backend`
   - **Dockerfile Path**: `Dockerfile` (relative to build path)
4. **Environment Variables**:
   - `APP_NAME`: `DevPilot`
   - `APP_VERSION`: `0.1.0`
   - `APP_ENV`: `production`
   - `DATABASE_URL`: `postgresql+asyncpg://postgres:[YourStrongPassword]@devpilot-postgres:5432/devpilot`
   - `REDIS_URL`: `redis://devpilot-redis:6379/0`
   - `QDRANT_URL`: `http://devpilot-qdrant:6333`
   - `JWT_SECRET`: `[YourProductionJWTSecret]`
5. **Domains**:
   - Add your API domain, e.g. `api.devpilot.yourdomain.com` (configured with HTTPS automatically by EasyPanel/Caddy).

### B. Frontend (`devpilot-frontend`)
The frontend is built from the GitHub repository using the `frontend/Dockerfile`.

1. Create a new service using the **App** template.
2. **Service Name**: `devpilot-frontend`
3. **Source**: Select **Git Repository**
   - **Repository**: `https://github.com/your-username/devpilot.git`
   - **Branch**: `main`
   - **Build Path**: `/frontend`
   - **Dockerfile Path**: `Dockerfile`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://api.devpilot.yourdomain.com` (pointing to the public HTTPS domain of the backend API)
5. **Domains**:
   - Add your main app domain, e.g. `devpilot.yourdomain.com`.

---

## Deployment & Verification Flow

1. **Order of Launch**:
   - Deploy `devpilot-postgres`, `devpilot-redis`, and `devpilot-qdrant` first. Ensure they are running and healthy.
   - Deploy `devpilot-api` next. Check logs to verify connection tests pass successfully:
     ```text
     PostgreSQL -> verified
     Redis -> verified
     Qdrant -> verified
     ```
   - Deploy `devpilot-frontend`.
2. **Verification Check**:
   - Open your browser and visit `https://api.devpilot.yourdomain.com/health`.
   - Ensure the JSON response reports `"ok"` for all backing systems:
     ```json
     {
       "app": "DevPilot",
       "version": "0.1.0",
       "api": "ok",
       "postgres": "ok",
       "redis": "ok",
       "qdrant": "ok"
     }
     ```
   - Visit `https://devpilot.yourdomain.com/dashboard` to verify metrics displaying and the "Connected" health badge showing green.
