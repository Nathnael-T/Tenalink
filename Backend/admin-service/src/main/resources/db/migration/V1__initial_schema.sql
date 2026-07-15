-- V1__initial_schema.sql — admin_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY,
    admin_id        UUID NOT NULL,
    action          VARCHAR(255) NOT NULL,
    target_resource VARCHAR(255) NOT NULL,
    timestamp       TIMESTAMP WITH TIME ZONE NOT NULL,
    actor_name      VARCHAR(255),
    role            VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs (timestamp);

CREATE TABLE IF NOT EXISTS system_config (
    id              VARCHAR(255) PRIMARY KEY,
    config_key      VARCHAR(255) NOT NULL UNIQUE,
    config_value    TEXT NOT NULL,
    description     VARCHAR(255),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL
);
