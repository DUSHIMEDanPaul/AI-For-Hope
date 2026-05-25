FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY services/patient-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/patient-service/ /app/services/patient-service/
COPY packages/ /app/packages/

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "services.patient-service.main:app", "--host", "0.0.0.0", "--port", "8000"]
