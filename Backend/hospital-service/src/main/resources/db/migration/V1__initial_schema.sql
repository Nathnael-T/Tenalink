-- V1__initial_schema.sql — hospital_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS hospitals (
    id                      VARCHAR(255) PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    specialty               VARCHAR(255),
    wait_time               INTEGER,
    address                 VARCHAR(255),
    contact                 VARCHAR(255),
    latitude                DOUBLE PRECISION,
    longitude               DOUBLE PRECISION,
    icu_available           BOOLEAN NOT NULL DEFAULT FALSE,
    lab_available           BOOLEAN NOT NULL DEFAULT FALSE,
    pharmacy_available      BOOLEAN NOT NULL DEFAULT FALSE,
    radiology_available     BOOLEAN NOT NULL DEFAULT FALSE,
    ambulance_access        BOOLEAN NOT NULL DEFAULT FALSE,
    glucose_available       BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hospital_specialty ON hospitals (specialty);
