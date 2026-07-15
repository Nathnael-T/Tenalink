-- V1__initial_schema.sql — pharmacy_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS prescriptions (
    id              UUID PRIMARY KEY,
    patient_id      UUID NOT NULL,
    doctor_id       UUID NOT NULL,
    medication      VARCHAR(255) NOT NULL,
    dosage          VARCHAR(255) NOT NULL,
    prescribed_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    status          VARCHAR(255) NOT NULL
);
