-- V1__initial_schema.sql — appointment_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS appointments (
    id              UUID PRIMARY KEY,
    patient_id      UUID NOT NULL,
    doctor_id       UUID NOT NULL,
    hospital_id     UUID NOT NULL,
    scheduled_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    status          VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appt_doctor_id ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appt_patient_id ON appointments (patient_id);
