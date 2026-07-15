-- V3__add_id_document_fields.sql — user_db
-- Add ID document storage fields and created_at timestamp to patients table

ALTER TABLE patients ADD COLUMN IF NOT EXISTS id_document_data BYTEA;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS id_document_name VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS id_document_uploaded_at TIMESTAMP;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
