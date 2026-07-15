-- V2__add_audit_log_actor_fields.sql — admin_db
-- Add actor metadata columns to audit_logs

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_name VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS role VARCHAR(255);
