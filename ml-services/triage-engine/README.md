# AI Triage & Symptom Analysis Engine

This service implements the AI-powered symptom analysis, disease risk scoring, and urgency prioritizations for the **AI for Hope** clinic waiting room queue pipeline.

## System Features
1.  **Patient Check-in Onboarding**: Integrates vitals data (temperature, heart rate, blood pressure) alongside multi-select symptom listings.
2.  **Risk Modeling**: Evaluates structural regional endemics (such as malaria, cholera, and tuberculosis) based on localized environmental factors and symptom clusters.
3.  **Dynamic Triage Routing**: Automatically assigns clinical urgency categories (Green, Yellow, Red, Emergency) and ranks the patient in the queue.

## Setup & Running (Standalone)

### Prerequisites
Ensure Python 3.11+ is installed locally.

### Installation
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

## API Specifications

*   `POST /api/v1/triage/submit`: Main endpoint for vital intake processing and urgency generation.
*   `GET /api/v1/triage/models`: List currently deployed weights, classifiers, and training timestamps.
