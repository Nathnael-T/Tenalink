-- V2__make_hospital_id_nullable.sql
-- Allow medical events to be created without a specific hospital (outpatient/telemedicine cases).
ALTER TABLE medical_events
    ALTER COLUMN hospital_id DROP NOT NULL;
