from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from uuid import UUID, uuid4
from datetime import date, datetime
from typing import List, Optional

app = FastAPI(
    title="AI for Hope — Patient & EMR Microservice",
    description="Operational Service managing Patient Registrations, medical history, and clinical records",
    version="1.0.0",
)


# --- Pydantic Data Models ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str  # DOCTOR, NURSE, LAB_TECH, BILLING_CLERK, PATIENT


class Token(BaseModel):
    access_token: str
    token_type: str


class PatientCreate(BaseModel):
    national_id: str
    first_name: str
    last_name: str
    birth_date: date
    phone_number: str
    gender: str


class PatientResponse(BaseModel):
    id: UUID
    national_id: str
    first_name: str
    last_name: str
    birth_date: date
    phone_number: str
    gender: str
    created_at: datetime

    class Config:
        from_attributes = True


class EMRRecordCreate(BaseModel):
    diagnosis: str
    prescription_details: str
    laboratory_recommendations: Optional[str] = None


class EMRRecordResponse(BaseModel):
    id: UUID
    patient_id: UUID
    doctor_id: UUID
    diagnosis: str
    prescription_details: str
    laboratory_recommendations: Optional[str] = None
    created_at: datetime


# --- Dummy Memory Stores ---
DUMMY_PATIENTS = []
DUMMY_EMR = {}


# --- API Routes ---
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "patient-service",
        "version": "1.0.0",
        "health": "healthy"
    }


@app.post("/api/v1/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    # In-memory mock register
    return {
        "access_token": "mock_jwt_token_for_" + user.email,
        "token_type": "bearer"
    }


@app.post("/api/v1/auth/login", response_model=Token)
def login_user():
    return {
        "access_token": "mock_jwt_token_valid_for_24h",
        "token_type": "bearer"
    }


@app.post("/api/v1/patients/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate):
    # Verify unique national ID constraint
    for p in DUMMY_PATIENTS:
        if p["national_id"] == patient.national_id:
            raise HTTPException(status_code=400, detail="Patient with this National ID already exists")
    
    new_patient = {
        "id": uuid4(),
        "national_id": patient.national_id,
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "birth_date": patient.birth_date,
        "phone_number": patient.phone_number,
        "gender": patient.gender,
        "created_at": datetime.utcnow()
    }
    DUMMY_PATIENTS.append(new_patient)
    return new_patient


@app.get("/api/v1/patients/", response_model=List[PatientResponse])
def get_patients():
    return DUMMY_PATIENTS


@app.get("/api/v1/patients/{patient_id}/emr", response_model=List[EMRRecordResponse])
def get_patient_emr(patient_id: UUID):
    # Return patient medical history or empty array
    return DUMMY_EMR.get(patient_id, [])


@app.post("/api/v1/patients/{patient_id}/emr", response_model=EMRRecordResponse, status_code=status.HTTP_201_CREATED)
def add_patient_emr(patient_id: UUID, record: EMRRecordCreate):
    # In production, doctor_id would be extracted from the active JWT session context
    new_record = {
        "id": uuid4(),
        "patient_id": patient_id,
        "doctor_id": uuid4(),
        "diagnosis": record.diagnosis,
        "prescription_details": record.prescription_details,
        "laboratory_recommendations": record.laboratory_recommendations,
        "created_at": datetime.utcnow()
    }
    
    if patient_id not in DUMMY_EMR:
        DUMMY_EMR[patient_id] = []
        
    DUMMY_EMR[patient_id].append(new_record)
    return new_record
