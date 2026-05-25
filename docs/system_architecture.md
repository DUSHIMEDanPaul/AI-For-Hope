# AI for Hope — Production-Grade System Architecture & Engineering Blueprint

This document details the high-level system architecture, service designs, database schemas, DevOps configurations, security mechanisms, and scaling strategies for **AI for Hope**—a state-of-the-art, AI-powered healthcare platform designed to deliver clinical accessibility, administrative efficiency, and reliable diagnostics across Rwanda and the African continent.

---

## 1. System Architecture

AI for Hope is designed as a **hybrid federated monorepo/microservices architecture** to balance early velocity with long-term horizontal scale. It decouples high-frequency web operations, heavy analytical AI workloads, and mission-critical electronic health records (EHR/EMR) to ensure high availability ($99.99\%$), strict regulatory compliance, and rapid integration.

### High-Level Architecture Diagram
```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Responsive & Kiosk)"]
        WebPortal["Patient/Doctor Web Portal\n(Next.js / TS / Tailwind)"]
        KioskApp["Self-Service Intake Kiosk\n(React / TS Electron)"]
    end

    subgraph GatewayLayer ["Gateway & Edge Routing"]
        Cloudflare["Cloudflare WAF / DDoS Protection"]
        KongGateway["Kong API Gateway\n(OAuth2, Rate Limiting, CORS)"]
    end

    subgraph ServiceLayer ["Core Microservices (FastAPI / Python)"]
        AuthService["Auth & RBAC Service\n(JWT / Keycloak)"]
        PatientService["Patient & EMR Service\n(PostgreSQL)"]
        ClinicService["Appointment & Queue Service\n(Redis Queue)"]
        BillingService["Billing & Payment Service\n(Momo / Stripe)"]
        NotifyService["Notification Service\n(RabbitMQ / SMS / WhatsApp)"]
    end

    subgraph AILayer ["AI & Analytics Services Layer (Python / PyTorch)"]
        TriageEngine["AI Triage & Symptom Checker\n(FastAPI / LLM Agent)"]
        ImagingService["Computer Vision Medical Imaging\n(Triton Inference Server)"]
        AnalyticsEngine["Disease Risk Predictor\n(Scikit-Learn / Ray)"]
    end

    subgraph DataStorageLayer ["Data & Messaging Layer"]
        PostgresDB[("Primary Database\n(PostgreSQL + TimescaleDB)")]
        RedisCache[("Cache & Session Store\n(Redis Enterprise Cluster)")]
        RabbitMQ[("Message Broker\n(RabbitMQ Event Bus)")]
        S3Bucket[("Secure HIPAA-compliant Object Store\n(MinIO / AWS S3)")]
    end

    %% Flow Definitions
    WebPortal --> Cloudflare
    KioskApp --> Cloudflare
    Cloudflare --> KongGateway
    
    KongGateway --> AuthService
    KongGateway --> PatientService
    KongGateway --> ClinicService
    KongGateway --> BillingService
    KongGateway --> TriageEngine
    KongGateway --> ImagingService

    %% Microservice Inter-communication
    PatientService -.-> |Event Bus| RabbitMQ
    ClinicService -.-> |Event Bus| RabbitMQ
    BillingService -.-> |Event Bus| RabbitMQ
    RabbitMQ --> NotifyService
    
    %% AI Inter-communication
    TriageEngine --> PostgresDB
    ImagingService --> S3Bucket
    
    %% Cache & Persistence
    AuthService --> RedisCache
    PatientService --> PostgresDB
    ClinicService --> RedisCache
    ClinicService --> PostgresDB
    BillingService --> PostgresDB
```

### Component Breakdown & Service Responsibilities

| Service Name | Primary Tech Stack | Primary Responsibility | Data Store | Communication Patterns |
| :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | Kong (Nginx/Lua) | SSL termination, reverse proxying, global rate limiting, path routing, JWT validation, and CORS policy enforcement. | Redis (Rate limiting counters) | Synchronous HTTP/HTTPS |
| **Auth Service** | FastAPI + Keycloak / Auth0 | Multi-tenant authentication, user registration, Single Sign-On (SSO), MFA, and Role-Based Access Control (RBAC) token generation. | PostgreSQL (Auth DB) | REST JSON, Redis Session Cache |
| **Patient & EMR Service** | FastAPI + SQLAlchemy | Patient onboarding, demographic records, digital medical histories, lab test results, prescriptions, and audit logs. | PostgreSQL (Main EMR schemas) | Synchronous REST & Async RabbitMQ Events |
| **Appointment & Queue** | FastAPI + Celery | Booking, queue token allocation, real-time wait-list status updates, and clinic resource calendars. | PostgreSQL & Redis (Queue states) | WebSockets (via Redis Pub/Sub) & REST |
| **Billing Service** | FastAPI + Stripe / Mobile Money SDKs | Invoice generation, payments processing via MTN Mobile Money (MoMo) & Airtel Money, and insurance billing reconciliations. | PostgreSQL (Billing schema) | Synchronous Webhooks & REST |
| **AI Triage & Symptom Service** | FastAPI + Hugging Face / LangChain | Dynamic symptom questioning, urgency categorizations, disease probability modeling, and recommendation dispatch. | Redis (Session State) & PostgreSQL | REST JSON & Async Inference pipelines |
| **Medical Imaging Service** | FastAPI + Triton Inference Server | Chest X-ray anomaly detection, tuberculosis screening, ultrasound analysis, and metadata tagging. | S3 / MinIO (Raw DICOM/PNG files) | gRPC (Triton) / REST |
| **Notification Engine** | Python + Celery | High-volume SMS alerts (Africa's Talking API), WhatsApp updates, and secure transactional emails. | PostgreSQL (Template store) | Asynchronous RabbitMQ Worker Consumer |

---

## 2. Recommended Tech Stack

The chosen technology stack optimizes for **fast time-to-market (MVP)**, while providing **enterprise-grade robustness** and **industry-standard engineering practices**:

```
Client App (Next.js 14 App Router, TS, Tailwind CSS, TanStack Query, Zustand)
    |
    |---- (HTTPS / WSS / gRPC) ----> [ Kong API Gateway ]
                                           |
                                           |---- (HTTP / gRPC) ----> [ Services Layer (FastAPI, Python 3.11) ]
                                                                           |
                                                                           |---> [ DBs: PostgreSQL (Primary), Redis (Cache), Vector DB ]
                                                                           |---> [ AI: PyTorch, OpenCV, Triton, Hugging Face ]
                                                                           |---> [ Broker: RabbitMQ ]
                                                                           |---> [ Storage: MinIO / AWS S3 ]
```

### Frontend
*   **Next.js 14 (App Router) & TypeScript**: Enables outstanding Developer Experience (DX), type safety, Search Engine Optimization (SEO) via Server-Side Rendering (SSR), and highly responsive dashboard loads.
*   **TailwindCSS**: Utmost styling flexibility, maintaining modern, uniform design tokens across dashboards, kiosk applications, and mobile views.
*   **TanStack Query (React Query)**: Enterprise-grade client-side caching, automated re-fetching, optimistic updates, and clean state handling for API responses.
*   **Zustand**: Lightweight, predictable state management ideal for multi-step patient registration and multi-stage triage flows without the boilerplate of Redux.

### Backend
*   **FastAPI & Python 3.11+**: High performance (comparable to Node.js and Go due to `async`/`await` support), auto-generated interactive OpenAPI/Swagger docs, and direct compatibility with the Python AI ecosystem.
*   **SQLAlchemy 2.0 (ORM) & Alembic**: Advanced relational mapping with robust database migration support.
*   **Celery & RabbitMQ**: Distributed task processing to handle heavy operational tasks asynchronously (e.g., invoice compilation, diagnostic report rendering, batch predictions).

### AI Layer
*   **PyTorch**: The industry standard for training and deploying deep learning models (e.g., Convolutional Neural Networks for chest radiology).
*   **OpenCV**: High-performance image pre-processing, contrast equalization, resizing, and DICOM-to-PNG parsing.
*   **Triton Inference Server**: Enterprise-grade model serving supporting dynamic batching, concurrent model execution, and hardware acceleration (NVIDIA GPU).
*   **Qdrant or pgvector**: Vector database for managing clinical embeddings, enabling semantic search over medical guidelines and semantic analysis in LLM workflows.

### Databases & Cache
*   **PostgreSQL 16**: Relational storage supporting ACID compliance, complex relational queries, and row-level security policies.
*   **Redis Enterprise**: High-speed, in-memory key-value cache, session manager, and pub/sub engine for real-time triage queues and active connections.

### Infrastructure & DevOps
*   **Docker & Docker Compose**: Unified local development environments.
*   **AWS (ECS Fargate / EKS)**: Serverless container compute minimizing operational overhead.
*   **GitHub Actions**: Continuous integration, automated linting, test suites, and Docker image builds pushed directly to AWS ECR.
*   **Grafana, Prometheus & Loki**: Comprehensive dashboarding, log aggregation, and real-time metrics tracking.

---

## 3. Monorepo Directory Layout

To maintain cohesive code sharing, ease of deployment, and absolute type safety between services, AI for Hope uses a modular monorepo structure.

```
ai-for-hope/
├── apps/                          # Deployable User Interfaces
│   ├── web-portal/                # Patient, Doctor & Admin Portal (Next.js)
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── hooks/             # React Hooks & TanStack queries
│   │   │   └── store/             # Zustand state stores
│   │   └── package.json
│   └── kiosk-app/                 # Clinic Self-Service Intake Kiosk (Electron/React)
├── services/                      # Operational Core APIs (FastAPI)
│   ├── auth-service/              # Authentication, Keycloak integrations & RBAC
│   ├── patient-service/           # EMR, Patient Profiles & Medical Records
│   ├── clinic-service/            # Appointments & Queuing
│   ├── billing-service/           # MTN MoMo/Airtel Money integration
│   └── notification-service/      # SMS (Africa's Talking) & Email workers
├── ml-services/                   # Machine Learning & AI Inference Services
│   ├── triage-engine/             # Symptom analyzer and agent (LangChain/FastAPI)
│   ├── imaging-analysis/          # X-Ray & Ultrasound diagnostic engine
│   └── shared-models/             # Custom weights, tokenizers, and PyTorch pipelines
├── packages/                      # Shared internal npm & pip libraries
│   ├── ui-kit/                    # Shared design system components (React/Tailwind)
│   ├── core-types/                # Shared TypeScript models & schema definitions
│   └── common-py/                 # Shared Python loggers, middleware, and ORM bases
├── infrastructure/                # Infrastructure as Code & Orchestration
│   ├── docker/                    # Dockerfiles and development overrides
│   ├── k8s/                       # Kubernetes manifests (deployments, ingresses, HPA)
│   ├── terraform/                 # AWS/GCP provisioning templates
│   └── nginx/                     # Gateway routing and reverse proxy rules
├── docs/                          # Architectural and API specifications
└── docker-compose.yml             # Local Multi-Service Orchestrator
```

### Explanatory Directory Mapping
*   `/apps`: Contains client-facing codebases. All applications share Tailwind designs and layout guidelines from `/packages/ui-kit`.
*   `/services`: House dedicated, containerized API services written in Python/FastAPI. They use clean architectural boundaries and interact via the database or the RabbitMQ broker.
*   `/ml-services`: Separates resource-heavy Python model code from regular business logic. This allows ML services to run on GPU-enabled instances (like AWS `g4dn`) while keeping business APIs on cheaper CPU instances.
*   `/packages`: Houses shared dependencies to avoid copy-pasting code. Python services import standard logs, middleware, and models from `common-py`, while Node applications import components from `ui-kit`.
*   `/infrastructure`: Contains the environment-defining manifests, ensuring that what runs in staging can be easily migrated to production with absolute configuration parity.

---

## 4. Backend Design & Service Boundaries

Each FastAPI microservice is designed using a **layered clean architecture (Controller -> Service -> Repository -> Database)** to maintain separation of concerns.

```
[ HTTP Request ] -> [ Controller (API Endpoints & Pydantic Validation) ]
                           |
                           v
                    [ Service Layer (Core Business Rules & Workflows) ]
                           |
                           v
                    [ Repository Layer (SQLAlchemy ORM Data Mappers) ]
                           |
                           v
                    [ Database / Cache Persistence Engine ]
```

### Database Schema Overview (Core Schemas)

```mermaid
erDiagram
    PATIENT {
        uuid id PK
        string national_id UNIQUE
        string first_name
        string last_name
        date birth_date
        string phone_number
        string gender
        timestamp created_at
    }
    
    DOCTOR {
        uuid id PK
        string license_number UNIQUE
        string first_name
        string last_name
        string specialty
        string email
        boolean is_active
    }
    
    APPOINTMENT {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        timestamp appointment_time
        string status "scheduled | active | completed | cancelled"
        string reason
        timestamp created_at
    }
    
    TRIAGE_RECORD {
        uuid id PK
        uuid patient_id FK
        string primary_symptoms
        string urgency_level "low | medium | high | emergency"
        float temperature_c
        string heart_rate
        string blood_pressure
        jsonb ai_diagnostic_metadata
        timestamp created_at
    }
    
    EMR_RECORD {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        string diagnosis
        string prescription_details
        string laboratory_recommendations
        timestamp created_at
    }

    BILLING_TRANSACTION {
        uuid id PK
        uuid patient_id FK
        decimal amount
        string currency
        string payment_method "MTN_MOMO | AIRTEL_MONEY | CARD"
        string status "pending | settled | failed"
        string external_transaction_id UNIQUE
        timestamp created_at
    }

    PATIENT ||--o{ APPOINTMENT : books
    DOCTOR ||--o{ APPOINTMENT : hosts
    PATIENT ||--o{ TRIAGE_RECORD : undergoes
    PATIENT ||--o{ EMR_RECORD : contains
    DOCTOR ||--o{ EMR_RECORD : creates
    PATIENT ||--o{ BILLING_TRANSACTION : pays
```

### Core API Endpoints

#### Authentication & RBAC

*   `POST /api/v1/auth/register`: Onboards clinic administrators, doctors, nurses, and lab technicians.
*   `POST /api/v1/auth/login`: Validates credentials and returns JWT bearer tokens containing standard user claims and role assignments.
*   `POST /api/v1/auth/mfa/verify`: Validates TOTP/SMS codes for secondary verification.

#### Patient & EMR

*   `POST /api/v1/patients/`: Registers a new patient.
*   `GET /api/v1/patients/{id}/emr`: Fetches the patient's full EHR history (Requires `DOCTOR` or `NURSE` credentials).
*   `POST /api/v1/patients/{id}/emr`: Appends lab notes, diagnoses, and digital prescriptions to the EHR database.

#### Appointment Scheduling & Triage Queue

*   `POST /api/v1/appointments/book`: Books a consultation slots and matches them with available clinicians.
*   `POST /api/v1/triage/submit`: Accepts intake check-in vitals, triggers the AI triage routing pipeline, and updates active clinic triage queue status.
*   `GET /api/v1/triage/queue/{clinic_id}`: Stream of current active triage waiting room metrics via server-sent events or WebSockets.

---

## 5. AI System Design & Inference Pipeline

The AI architecture handles complex diagnostics asynchronously, preventing operational slowdowns. It operates two distinct systems: **Deterministic Risk & Triage Classifiers** and **Heavy Neural Image Classification**.

```
[ Client Diagnostic Scan / Symptoms Upload ]
                    |
                    v
          [ API / Triton Gateway ]
          /                      \
         / (Sync Triage)          \ (Async DICOM Image Analytics)
        v                          v
[ Symptom Analysis Engine ]    [ Image Processing Worker ]
   - Rule Engine / XGBoost        - OpenCV DICOM Parser
   - Clinical LLM Agent           - PyTorch ResNet / DenseNet Engine
        |                          |
        |                          v
        |                  [ MinIO S3 Safe Storage ]
        |                          |
        \                          /
         v                        v
      [ Secure REST/gRPC Inference Response ]
                    |
                    v
      [ EHR Record / Doctor Dashboard Alert ]
```

### Symptom Analysis & Risk Scoring Workflow
1.  **Patient Symptoms Onboarding**: A patient checks in at a self-service intake kiosk, entering primary symptoms (e.g., *persistent coughing, weight loss, night sweats*).
2.  **FastAPI Triage Routing**: The `triage-engine` queries localized historical medical metrics, runs basic rule-based risk filters, and submits inputs to a fine-tuned clinical model.
3.  **Risk Classifier**: A gradient-boosting (XGBoost/LightGBM) model evaluates the probability of regional endemic conditions (e.g., malaria, tuberculosis) based on vitals, regional factors, and symptoms.
4.  **Triage Urgency Assignment**: The system assigns an urgency score (Green: Low, Yellow: Medium, Red: High) and automatically places the patient in the corresponding clinic queue priority tier.

### Medical Image Inference Pipeline
1.  **Image Upload**: A clinician uploads an X-ray or ultrasound image (DICOM format) via the doctor dashboard.
2.  **Pre-processing**: The `imaging-analysis` service converts the DICOM image to a standardized PNG, normalizes contrast, and scales it.
3.  **Triton GPU Inference**: The image is sent via gRPC to the Triton Inference Server, where a specialized deep learning model (e.g., ResNet-50 trained on radiology datasets) runs anomaly detection.
4.  **Doctor Review Alert**: The model outputs prediction confidence classes (e.g., *Pneumonia detected with 94.2% confidence*). The results are saved in the EHR database, flagged for priority human doctor verification, and loaded on the clinician's dashboard.

---

## 6. Security Architecture & Compliance

Patient data security is built directly into every layer of the platform, adhering to international healthcare regulations (such as **HIPAA** and **GDPR**) and local national security standards.

### Cryptographic Operations & Security Controls
*   **Data at Rest Encryption**: All PostgreSQL tables containing Personally Identifiable Information (PII) or protected health information (PHI) use filesystem-level encryption (AWS KMS keys / dm-crypt) alongside column-level encryption (using AES-GCM-256) for fields like `national_id`, `phone_number`, and `birth_date`.
*   **Data in Transit Encryption**: All web traffic is strictly encrypted using TLS 1.3. Inner service-to-service gRPC communication is encrypted using mutual TLS (mTLS).
*   **Network Segmentation**: Production databases, caches, and storage buckets run inside a private AWS Virtual Private Cloud (VPC), isolated from the public internet. Only the Kong API Gateway handles public requests.
*   **Audit Logging**: Every access event or data modification (e.g., reading a patient's medical records) triggers a structured JSON audit trail. These trails are streamed to a read-only, tamper-proof storage system (such as AWS S3 with Object Lock enabled).

### Role-Based Access Control (RBAC) Permissions Matrix

The platform enforces the principle of least privilege. Users can only access the minimal set of data necessary to perform their roles:

| Role | Demographics (`/patients`) | EMR Clinical Data (`/emr`) | Financial Data (`/billing`) | AI Triage Pipeline | System Settings |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System Admin** | Read / Write | No Access | Read Only | View Metrics | Full Access |
| **Doctor** | Read / Write | Read / Write | No Access | View Predictions | No Access |
| **Nurse / Triage Tech** | Read / Write | Read Only | No Access | Trigger Inference | No Access |
| **Lab Tech** | Read Only | Add Lab Reports | No Access | No Access | No Access |
| **Billing Clerk** | Read Only | No Access | Read / Write | No Access | No Access |
| **Patient** | Read Only | Read (Own Record) | Pay / View Invoices | View Own Score | No Access |

---

## 7. Scalability Strategy

To scale efficiently from a single clinic to nationwide infrastructure, AI for Hope implements a multi-tier scaling model:

```
[ Single Clinic Deploy ] ----> [ Multi-Clinic Deploy ] ----> [ National Infrastructure ]
  - Single Postgres DB           - Regional DB Read Replicas   - Distributed Database Shards
  - Local Redis Cache            - Redis Cluster Cache         - Dynamic Triton GPU Scaling
  - Single Server Gateway        - Kong Gateway Clustering     - Multi-Region Active Failover
```

### Tier 1: Single Clinic (MVP)
*   **Architecture**: Consolidated Docker Compose deployment running on a single AWS EC2 instance.
*   **Database**: Single primary PostgreSQL instance with standard file-based automated daily backups.
*   **Caching**: Local Redis instance handles API rate limits, temporary queue states, and user sessions.

### Tier 2: Multi-Clinic (Regional Deployment)
*   **Architecture**: Dockerized applications managed via AWS ECS Fargate or a small Kubernetes (EKS) cluster.
*   **Database Scaling**: Read/Write splitting. Primary PostgreSQL handles mutations, while multi-availability zone read replicas offload dashboard analysis and reporting.
*   **Caching**: Distributed Redis cluster ensures cache consistency and handles real-time WebSockets across clinics.

### Tier 3: National Infrastructure (Enterprise Deployment)
*   **Architecture**: High-availability Kubernetes cluster deployed across multiple geographic regions with active-active failover.
*   **Database Scaling**: Database sharding based on geographical/clinic IDs. Cold medical records are systematically moved to low-cost S3 Glacier storage, keeping the primary database optimized.
*   **AI Inference Scaling**: Horizontal Pod Autoscalers (HPA) monitor Triton GPU utilization, spinning up additional GPU-accelerated container instances in response to peak triage demand.

---

## 8. DevOps and Infrastructure

The platform uses containerized components to guarantee absolute parity between development, staging, and production environments.

### Multi-Container Orchestration Blueprint (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  kong-gateway:
    image: kong:3.4
    container_name: gateway_proxy
    ports:
      - "8000:8000"
      - "8443:8443"
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /usr/local/kong/kong.yml
    volumes:
      - ./infrastructure/nginx/kong.yml:/usr/local/kong/kong.yml
    depends_on:
      - postgres-db
      - redis-cache
    networks:
      - hope_network

  patient-service:
    build:
      context: .
      dockerfile: ./services/patient-service/Dockerfile
    container_name: patient_microservice
    environment:
      - DATABASE_URL=postgresql+psycopg2://hope_usr:secure_pw@postgres-db:5432/hope_patients
      - REDIS_URL=redis://redis-cache:6379/0
      - JWT_SECRET=super_secret_signing_key
    depends_on:
      - postgres-db
    networks:
      - hope_network

  triage-engine:
    build:
      context: .
      dockerfile: ./ml-services/triage-engine/Dockerfile
    container_name: triage_ai_engine
    environment:
      - REDIS_URL=redis://redis-cache:6379/1
    depends_on:
      - redis-cache
    networks:
      - hope_network

  postgres-db:
    image: postgres:16-alpine
    container_name: relational_db
    environment:
      - POSTGRES_USER=hope_usr
      - POSTGRES_PASSWORD=secure_pw
      - POSTGRES_DB=hope_patients
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - hope_network

  redis-cache:
    image: redis:7-alpine
    container_name: memory_cache
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    networks:
      - hope_network

volumes:
  pgdata:
  redisdata:

networks:
  hope_network:
    driver: bridge
```

### Git-Driven Continuous Integration Pipeline (`.github/workflows/ci-pipeline.yml`)
```yaml
name: Continuous Integration & Service Verification

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v3

      - name: Set up Python 3.11
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install Linting & Testing Utilities
        run: |
          python -m pip install --upgrade pip
          pip install ruff pytest black

      - name: Execute Code Formatting Check (Ruff / Black)
        run: |
          black --check .

      - name: Run Backend PyTest Test Suites
        run: |
          pytest services/patient-service/tests/ --doctest-modules

  build-and-push-images:
    needs: test-and-lint
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Log in to AWS ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and Push Core Patient Container
        run: |
          docker build -t ${{ steps.login-ecr.outputs.registry }}/hope-patient-service:latest -f ./services/patient-service/Dockerfile .
          docker push ${{ steps.login-ecr.outputs.registry }}/hope-patient-service:latest
```

---

## 9. Phased Engineering Roadmap

To launch AI for Hope efficiently while ensuring robust security and technical depth, we plan development across four strategic phases:

```
[ Phase 1: MVP Core ] ----> [ Phase 2: Analytics & Payment ] ----> [ Phase 3: Diagnostics & Kiosk ] ----> [ Phase 4: National Scaling ]
  - Patient Registrations    - AI end-to-end Risk Models       - Advanced Imaging PyTorch Models   - Active-Active Clusters
  - Core FastAPI endpoints  - MoMo API integrations           - Intake Kiosk Electron apps        - HIPAA Audited Deployment
  - JWT / Auth controls     - High Volume SMS alerts          - Hospital Interop (HL7 / FHIR)     - Decentralized Edge Nodes
```

### Phase 1: Core Foundation & Patient Onboarding (Months 1–3)
*   **Goal**: Establish a baseline working system to safely register patients, manage queues, and schedule appointments.
*   **Deliverables**:
    *   Deploy the Next.js Patient Portal and Doctor Dashboard foundations.
    *   Implement the core FastAPI backend APIs (`auth-service`, `patient-service`, `clinic-service`).
    *   Implement secure JWT-based Role-Based Access Control.
    *   Set up a relational database schema in PostgreSQL.
    *   Launch local testing configurations and CI formatting checks using GitHub Actions.

### Phase 2: AI Risk Triage, Billing & Communications (Months 4–6)
*   **Goal**: Integrate AI triage models, enable localized billing, and deploy transactional patient messaging.
*   **Deliverables**:
    *   Deploy the localized XGBoost risk scoring model in the `triage-engine`.
    *   Integrate regional mobile money APIs (MTN MoMo, Airtel Money) alongside card processing.
    *   Set up RabbitMQ to handle asynchronous SMS notifications via Africa's Talking.
    *   Set up Grafana dashboards to track clinic wait times and database performance.

### Phase 3: Imaging AI, Intake Kiosks & Hospital Integrations (Months 7–9)
*   **Goal**: Implement medical imaging analysis, deploy hardware kiosks, and support hospital data standards.
*   **Deliverables**:
    *   Deploy the Triton Inference Server running PyTorch models for chest X-ray anomaly detection.
    *   Build the Electron-based intake kiosk application with integrated barcode scanners.
    *   Add support for healthcare communication standards (HL7 / FHIR) to integrate with existing hospital EHR systems.
    *   Run security audits for HIPAA and GDPR compliance.

### Phase 4: National Scale & High Availability (Months 10–12)
*   **Goal**: Scale the platform to support high concurrent national usage with robust redundancy.
*   **Deliverables**:
    *   Migrate operational workloads to high-availability multi-region Kubernetes clusters.
    *   Implement database sharding and configure active-active regional replication.
    *   Enable automatic scaling for Triton GPU inference servers.
    *   Achieve certified SOC2 Type II, HIPAA, and GDPR compliance validation.
