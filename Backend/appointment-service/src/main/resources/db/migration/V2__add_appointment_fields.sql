-- V2__add_appointment_fields.sql — appointment_db
-- Add frontend-compatible fields to appointments table

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS hospital_name VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS date VARCHAR(50);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time VARCHAR(50);
