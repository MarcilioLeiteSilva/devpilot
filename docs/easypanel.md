# EasyPanel Deployment Guide - DevPilot AI

Este guia documenta o processo de deploy completo da plataforma **DevPilot AI** no EasyPanel com integração automática ao GitHub.

---

## Arquitetura dos Serviços

No EasyPanel, orquestramos 5 serviços principais dentro de um único projeto para compartilhar a rede interna segura:

| Serviço | Imagem / Fonte | Porta |
|---|---|---|
| `devpilot-postgres` | `postgres:16-alpine` | 5432 |
| `devpilot-redis` | `redis:7-alpine` | 6379 |
| `devpilot-qdrant` | `qdrant/qdrant:v1.9.1` | 6333 |
| `devpilot-api` | GitHub → `backend/Dockerfile` | 8000 |
| `devpilot-frontend` | GitHub → `frontend/Dockerfile` | 3000 |

---

## 1. Serviços de Banco de Dados

### A. PostgreSQL (`devpilot-postgres`)
1. Criar novo serviço usando o template **Postgres**.
2. **Nome do Serviço**: `devpilot-postgres`
3. **Variáveis de Ambiente**:
   - `POSTGRES_DB`: `devpilot`
   - `POSTGRES_USER`: `postgres`
   - `POSTGRES_PASSWORD`: `[SuaSenhaForte]`
4. **Volumes**: montar em `/var/lib/postgresql/data`

### B. Redis (`devpilot-redis`)
1. Criar novo serviço usando o template **Redis**.
2. **Nome do Serviço**: `devpilot-redis`
3. **Volumes**: montar em `/data`

### C. Qdrant (`devpilot-qdrant`)
1. Criar novo serviço usando o template **App**.
2. **Nome do Serviço**: `devpilot-qdrant`
3. **Docker Image**: `qdrant/qdrant:v1.9.1`
4. **Porta**: `6333`
5. **Volumes**: montar em `/qdrant/storage`

---

## 2. Serviços de Aplicação

### A. Backend API (`devpilot-api`)

1. Criar novo serviço usando o template **App**.
2. **Nome do Serviço**: `devpilot-api`
3. **Source**: **Git Repository**
   - **Repository**: `https://github.com/MarcilioLeiteSilva/devpilot.git`
   - **Branch**: `main`
   - **Build Path**: `/backend`
   - **Dockerfile Path**: `Dockerfile`
4. **Variáveis de Ambiente**:
   ```
   APP_NAME=DevPilot
   APP_VERSION=0.2.0
   APP_ENV=production
   DATABASE_URL=postgresql+asyncpg://postgres:[SuaSenhaForte]@devpilot-postgres:5432/devpilot
   REDIS_URL=redis://devpilot-redis:6379/0
   QDRANT_URL=http://devpilot-qdrant:6333
   JWT_SECRET=[SeuJWTSecretSeguro]
   ```
5. **Domínio**: `api.seudominio.com` (HTTPS automático via Caddy)

> [!IMPORTANT]
> **Startup Automático (Fase 2)**: O `entrypoint.sh` executa automaticamente ao subir o container:
> 1. `alembic upgrade head` → cria/atualiza a tabela `projects` no PostgreSQL
> 2. `python -m app.seeds.projects_seed` → insere os 6 projetos iniciais (idempotente)
> 3. `uvicorn app.main:app` → inicia o servidor FastAPI
>
> Nenhuma ação manual é necessária no banco de dados.

### B. Frontend (`devpilot-frontend`)

1. Criar novo serviço usando o template **App**.
2. **Nome do Serviço**: `devpilot-frontend`
3. **Source**: **Git Repository**
   - **Repository**: `https://github.com/MarcilioLeiteSilva/devpilot.git`
   - **Branch**: `main`
   - **Build Path**: `/frontend`
   - **Dockerfile Path**: `Dockerfile`
4. **Variáveis de Ambiente**:
   ```
   NEXT_PUBLIC_API_URL=https://api.seudominio.com
   ```
5. **Domínio**: `devpilot.seudominio.com`

---

## 3. Fluxo de Deploy (GitHub → EasyPanel)

```
Push para main
     │
     ▼
EasyPanel detecta mudança
     │
     ├─► Build devpilot-api  (backend/Dockerfile)
     │         │
     │         ▼
     │   Container sobe → entrypoint.sh executa:
     │     [1] alembic upgrade head   (cria tabela projects)
     │     [2] projects_seed.py       (insere dados iniciais)
     │     [3] uvicorn start          (API online)
     │
     └─► Build devpilot-frontend  (frontend/Dockerfile)
               │
               ▼
         Next.js online → /dashboard /projects
```

---

## 4. Verificação Pós-Deploy

### API Health
```
GET https://api.seudominio.com/health
```
Resposta esperada:
```json
{
  "app": "DevPilot",
  "version": "0.2.0",
  "api": "ok",
  "postgres": "ok",
  "redis": "ok",
  "qdrant": "ok"
}
```

### Endpoints do Módulo Projects (Fase 2)
```
GET  https://api.seudominio.com/api/projects
POST https://api.seudominio.com/api/projects
GET  https://api.seudominio.com/api/projects/{id}
GET  https://api.seudominio.com/api/projects/slug/{slug}
PUT  https://api.seudominio.com/api/projects/{id}
PATCH https://api.seudominio.com/api/projects/{id}/archive
DELETE https://api.seudominio.com/api/projects/{id}
```

### Swagger (Documentação Interativa)
```
https://api.seudominio.com/docs
```

### Páginas do Frontend
```
https://devpilot.seudominio.com/dashboard         → Painel com métricas reais
https://devpilot.seudominio.com/projects          → Listagem de projetos
https://devpilot.seudominio.com/projects/new      → Criar projeto
https://devpilot.seudominio.com/projects/{id}     → Detalhes do projeto
https://devpilot.seudominio.com/projects/{id}/edit → Editar projeto
```

---

## 5. Variáveis Obrigatórias por Serviço

| Variável | Serviço | Descrição |
|---|---|---|
| `DATABASE_URL` | `devpilot-api` | String de conexão PostgreSQL (asyncpg) |
| `REDIS_URL` | `devpilot-api` | String de conexão Redis |
| `QDRANT_URL` | `devpilot-api` | URL do Qdrant |
| `JWT_SECRET` | `devpilot-api` | Chave de segurança JWT |
| `NEXT_PUBLIC_API_URL` | `devpilot-frontend` | URL pública da API (HTTPS) |

---

## 6. Logs Esperados no Startup do Backend

Ao subir o container `devpilot-api`, os logs devem exibir:

```
==========================================
  DevPilot AI - Backend Startup
==========================================
[1/3] Running Alembic database migrations...
INFO  [alembic.runtime.migration] Running upgrade  -> 321dc067679a, create_projects_table
      Migrations applied successfully.
[2/3] Running database seeds...
INFO  projects_seed - Adding project 'Flux Limp'...
INFO  projects_seed - Adding project 'Flux Guard'...
INFO  projects_seed - Adding project 'Consigo'...
INFO  projects_seed - Adding project 'ZapScore'...
INFO  projects_seed - Adding project 'Job Pilot AI'...
INFO  projects_seed - Adding project 'Agente Idiomas'...
INFO  projects_seed - Seed completed successfully.
[3/3] Starting FastAPI server...
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```
