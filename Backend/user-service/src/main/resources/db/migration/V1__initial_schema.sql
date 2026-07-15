-- V1__initial_schema.sql — user_db
-- Managed by Flyway; do not edit applied migrations.

CREATE TABLE IF NOT EXISTS patients (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL UNIQUE,
    fayda_id        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    date_of_birth   VARCHAR(255) NOT NULL,
    gender          VARCHAR(255) NOT NULL,
    contact_phone   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS doctors (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL UNIQUE,
    full_name       VARCHAR(255) NOT NULL,
    specialization  VARCHAR(255) NOT NULL,
    contact_phone   VARCHAR(255) NOT NULL
);
