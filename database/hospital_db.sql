-- Tenalink Development Dataset: hospital_db
BEGIN;

TRUNCATE TABLE hospitals RESTART IDENTITY CASCADE;

INSERT INTO hospitals (id, name, specialty, wait_time, address, contact, latitude, longitude, icu_available, lab_available, pharmacy_available, radiology_available, ambulance_access, glucose_available, created_at) VALUES
('h1', 'Addis General Hospital', 'General', 18, 'Tegela Building, Bole Rd, Addis Ababa', '+251-11-555-0001', 9.0054, 38.7636, true, true, true, false, false, true, '2025-07-01 08:00:00+03'),
('h2', 'St. Mary Specialty Clinic', 'Cardiology', 25, '45 Arada Ave, Addis Ababa', '+251-11-555-0002', 9.0312, 38.7467, true, true, true, false, false, true, '2025-07-01 09:00:00+03'),
('h3', 'Northern Emergency Center', 'Emergency', 8, '12 Meskel Square, Addis Ababa', '+251-11-555-0003', 9.0108, 38.7612, true, true, true, true, true, true, '2025-07-01 10:00:00+03'),
('h4', 'Eastside Diagnostic Lab', 'Radiology', 30, '78 Gerji Rd, Addis Ababa', '+251-11-555-0004', 9.0189, 38.8012, false, true, false, true, false, true, '2025-07-01 11:00:00+03'),
('h5', 'Westside Pediatric Center', 'Pediatrics', 20, '23 Sarbet St, Addis Ababa', '+251-11-555-0005', 8.9891, 38.7345, true, true, true, false, false, true, '2025-07-01 12:00:00+03');

COMMIT;
