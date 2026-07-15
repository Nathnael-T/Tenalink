-- V2__add_patient_fields.sql — user_db
-- Add health profile fields to patients table

ALTER TABLE patients ADD COLUMN IF NOT EXISTS blood_type VARCHAR(10);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS chronic_conditions TEXT;
