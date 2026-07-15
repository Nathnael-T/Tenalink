-- V1__initial_schema.sql — medical_record_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS medical_events (
    id              UUID PRIMARY KEY,
    patient_id      UUID NOT NULL,
    hospital_id     UUID NOT NULL,
    author_id       UUID NOT NULL,
    timestamp       TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type      VARCHAR(255) NOT NULL,
    event_data      TEXT NOT NULL
);
