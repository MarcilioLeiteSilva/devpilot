# DevPilot AI — Stage 1 (Platform Foundation)

DevPilot AI is a premium SaaS platform designed for multi-tenant software development agent orchestration. It handles task queues, agent communication context, and semantic code indexing. 

This repository contains **Stage 1 (Platform Foundation)**, implementing the core infrastructure, base FastAPI APIs, a Next.js 15 analytics dashboard, and backend database links.

---

## Technical Stack

- **Backend**:
  - **FastAPI**: Modern, high-performance web framework.
  - **SQLAlchemy 2.0**: Next-gen Async SQL toolkit and ORM.
  - **Alembic**: Database migrations management.
  - **Pydantic Settings**: Declarative environment parsing.
- **Frontend**:
  - **Next.js 15**: App Router framework with TypeScript.
  - **TailwindCSS**: Utilitarian styling with a premium glassmorphic dark theme.
  - **Lucide Icons**: Crisp dashboard iconography.
- **Storage & Infrastructure**:
  - **PostgreSQL 16**: Relational storage engine.
  - **Redis 7**: Distributed in-memory message broker & cache.
  - **Qdrant v1.9.1**: Enterprise-grade semantic vector store for long-term agent memory.
- **DevOps**:
  - **Docker & Docker Compose**: Unified local orchestrations.
  - **EasyPanel / VPS / GitHub**: Multi-instance cloud deployments.

---

## Directory Structure

```text
devpilot/
├── backend/            # FastAPI Async API Gateway
│   ├── app/
│   │   ├── api/        # Routers (health, status, metrics)
│   │   ├── core/       # Configurations, DB connectors, Redis, Qdrant
│   │   ├── models/     # SQL models (Stage 2)
│   │   ├── schemas/    # Pydantic validation structures
│   │   ├── services/   # Agentic logic layer
│   │   └── workers/    # Background pipeline handlers
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/           # Next.js Analytics Console
│   ├── src/
│   │   ├── app/        # Pages, layouts, dashboards
│   │   ├── components/ # Universal visual elements
│   │   └── services/   # Data fetching services
│   ├── Dockerfile
│   └── package.json
├── docs/               # Advanced deployment blueprints
│   └── easypanel.md
├── docker-compose.yml  # Multi-container local orchestration
└── README.md
```

---

## Local Installation & Setup

Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Quick Start (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/devpilot.git
   cd devpilot
   ```

2. Spin up the entire infrastructure stack:
   ```bash
   docker compose up --build
   ```

3. Explore the interfaces:
   - **Frontend Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - **FastAPI Core Gateway**: [http://localhost:8000](http://localhost:8000)
   - **API OpenAPI Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Qdrant Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

---

## API Endpoints Reference

### Health Diagnostics
- **`GET /health`**
  Queries PostgreSQL, Redis, and Qdrant connections concurrently and reports overall system health.
  
  *Response (200 OK)*:
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
  If a backing store is offline, its value is marked `"error"` and returns a `503 Service Unavailable` status code.

### Gateway Status
- **`GET /api/status`**
  Returns static state metadata.
  
  *Response (200 OK)*:
  ```json
  {
    "name": "DevPilot",
    "environment": "development",
    "status": "running"
  }
  ```

---

## Production EasyPanel Deployment

To deploy this platform onto a cloud VPS using EasyPanel:
1. Set up individual template configurations for **PostgreSQL** and **Redis**.
2. Deploy **Qdrant** using its official Docker image (`qdrant/qdrant:v1.9.1`).
3. Connect your GitHub repository to pull and build the backend and frontend using their designated `Dockerfiles`.
4. Define the necessary environmental links (e.g. `DATABASE_URL`, `REDIS_URL`, `QDRANT_URL`, and `NEXT_PUBLIC_API_URL`).

Refer to the complete, step-by-step **[EasyPanel Deployment Guide](docs/easypanel.md)** for further instructions on scaling, volume attachments, and custom routing setups.
