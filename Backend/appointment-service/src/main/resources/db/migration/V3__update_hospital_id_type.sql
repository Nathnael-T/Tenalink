-- Change hospital_id from UUID to VARCHAR(255)
ALTER TABLE appointments ALTER COLUMN hospital_id TYPE VARCHAR(255);
