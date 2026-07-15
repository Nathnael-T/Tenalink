-- V4__add_created_at.sql — appointment_db
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_appt_doctor_id ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments (status);
