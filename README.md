# AI for Hope — Core Monorepo

Welcome to the **AI for Hope** monorepo—an AI-powered, production-grade healthcare technology platform focused on improving clinical accessibility, diagnostics, and operational efficiency across Rwanda and Africa.

## Project Structure Overview

This repository uses a structured monorepo design separating operational microservices, web user interfaces, machine learning components, and shared packages:

```
ai-for-hope/
├── apps/                          # Deployable User Interfaces
│   ├── web-portal/                # Patient, Doctor & Admin Portal (Next.js)
│   └── kiosk-app/                 # Intake Kiosk Application (React / Electron)
├── services/                      # Operational Core APIs (FastAPI)
│   ├── auth-service/              # Authentication & Role-Based Access Control
│   ├── patient-service/           # EMR & Digital Patient Records
│   ├── clinic-service/            # Appointments & Triage Queuing
│   ├── billing-service/           # Mobile Money Billing Integration
│   └── notification-service/      # SMS / WhatsApp notification workers
├── ml-services/                   # Heavy AI & ML Inference Services
│   ├── triage-engine/             # Symptom analyzer and clinical agent
│   └── imaging-analysis/          # Chest X-Ray & Ultrasound analyzer
├── packages/                      # Reusable Shared Packages
│   ├── ui-kit/                    # Reusable React components & Tailwind styles
│   └── common-py/                 # Shared Python utility code, logging, & models
├── infrastructure/                # Provisioning & Deployment Configurations
│   ├── docker/                    # Docker environments & builds
│   ├── k8s/                       # Kubernetes manifests (deployments, HPA)
│   ├── terraform/                 # Multi-cloud provisioning templates
│   └── nginx/                     # Gateway and proxy configuration rules
└── docs/                          # Architectural Design Documentation
```

## Quick Start (Local Development)

### Prerequisites
*   Docker & Docker Compose installed locally.
*   Python 3.11+ and Node.js 18+ (for local, container-less testing).

### Running the Entire Infrastructure

To orchestrate and run the full stack locally with one command:

```bash
docker-compose up --build
```

This starts:
1.  **Kong API Gateway** at `http://localhost:8000`
2.  **Patient & EMR Service** at `http://localhost:8000/api/v1/patients`
3.  **PostgreSQL Core Relational Database** at port `5432`
4.  **Redis Cache & Queue Store** at port `6379`

## System Architecture Documentation

For complete technical specifications, database schemas, role matrices, security designs, and inference pipelines, refer to the high-level system guide:
👉 **[system_architecture.md](./docs/system_architecture.md)**
