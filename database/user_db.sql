-- Tenalink Development Dataset: user_db
BEGIN;

TRUNCATE TABLE patients RESTART IDENTITY CASCADE;
TRUNCATE TABLE doctors RESTART IDENTITY CASCADE;

INSERT INTO doctors (id, user_id, full_name, specialization, contact_phone) VALUES
('30000001-0000-4000-8000-000000000001', '20000001-0000-4000-8000-000000000001', 'Dr. Kidist Assefa', 'Cardiology', '+251-11-555-1100'),
('30000001-0000-4000-8000-000000000002', '20000001-0000-4000-8000-000000000002', 'Dr. Solomon Hailu', 'Pediatrics', '+251-11-555-1101'),
('30000001-0000-4000-8000-000000000003', '20000001-0000-4000-8000-000000000003', 'Dr. Eden Mekonnen', 'Emergency Medicine', '+251-11-555-1102'),
('30000001-0000-4000-8000-000000000004', '20000001-0000-4000-8000-000000000004', 'Dr. Berhanu Desta', 'Radiology', '+251-11-555-1103'),
('30000001-0000-4000-8000-000000000005', '20000001-0000-4000-8000-000000000005', 'Dr. Rahel Worku', 'General Practice', '+251-11-555-1104'),
('30000001-0000-4000-8000-000000000006', '20000001-0000-4000-8000-000000000006', 'Dr. Getachew Fikru', 'Orthopedics', '+251-11-555-1105'),
('30000001-0000-4000-8000-000000000007', '20000001-0000-4000-8000-000000000007', 'Dr. Makeda Tadesse', 'Dermatology', '+251-11-555-1106'),
('30000001-0000-4000-8000-000000000008', '20000001-0000-4000-8000-000000000008', 'Dr. Nesibu Girma', 'Internal Medicine', '+251-11-555-1107');

INSERT INTO patients (id, user_id, fayda_id, full_name, date_of_birth, gender, contact_phone, blood_type, allergies, chronic_conditions) VALUES
('50000001-0000-4000-8000-000000000001', '40000001-0000-4000-8000-000000000001', 'FAYDA000001', 'Almaz Tesfaye', '1985-03-12', 'FEMALE', '+251-91-201-3001', 'A+', '["Penicillin"]', '[{"condition":"Hypertension","since":"2019"},{"emergency_contact":{"name":"Tesfaye Assefa","phone":"+251-91-201-3999","relationship":"Spouse"}}]'),
('50000001-0000-4000-8000-000000000002', '40000001-0000-4000-8000-000000000002', 'FAYDA000002', 'Bekele Assefa', '1978-07-22', 'MALE', '+251-91-202-3002', 'O+', '[]', '[{"condition":"Type 2 Diabetes","since":"2015"},{"emergency_contact":{"name":"Assefa Bekele","phone":"+251-91-202-3998","relationship":"Brother"}}]'),
('50000001-0000-4000-8000-000000000003', '40000001-0000-4000-8000-000000000003', 'FAYDA000003', 'Chaltu Mengistu', '1992-11-05', 'FEMALE', '+251-91-203-3003', 'B+', '["Sulfa drugs"]', '[{"emergency_contact":{"name":"Mengistu Haile","phone":"+251-91-203-3997","relationship":"Father"}}]'),
('50000001-0000-4000-8000-000000000004', '40000001-0000-4000-8000-000000000004', 'FAYDA000004', 'Desta Alemu', '1980-01-18', 'MALE', '+251-91-204-3004', 'AB-', '["Latex"]', '[{"condition":"Asthma","since":"2010"},{"emergency_contact":{"name":"Alemu Desta","phone":"+251-91-204-3996","relationship":"Wife"}}]'),
('50000001-0000-4000-8000-000000000005', '40000001-0000-4000-8000-000000000005', 'FAYDA000005', 'Emebet Shiferaw', '1995-06-30', 'FEMALE', '+251-91-205-3005', 'O-', '[]', '[{"condition":"Anemia","since":"2021"},{"emergency_contact":{"name":"Shiferaw Kidist","phone":"+251-91-205-3995","relationship":"Mother"}}]'),
('50000001-0000-4000-8000-000000000006', '40000001-0000-4000-8000-000000000006', 'FAYDA000006', 'Fikadu Negash', '1975-09-14', 'MALE', '+251-91-206-3006', 'A-', '["Aspirin","Ibuprofen"]', '[{"condition":"Coronary artery disease","since":"2018"},{"emergency_contact":{"name":"Negash Fikadu","phone":"+251-91-206-3994","relationship":"Son"}}]'),
('50000001-0000-4000-8000-000000000007', '40000001-0000-4000-8000-000000000007', 'FAYDA000007', 'Genet Birhanu', '1988-12-08', 'FEMALE', '+251-91-207-3007', 'B-', '["Shellfish"]', '[{"emergency_contact":{"name":"Birhanu Solomon","phone":"+251-91-207-3993","relationship":"Husband"}}]'),
('50000001-0000-4000-8000-000000000008', '40000001-0000-4000-8000-000000000008', 'FAYDA000008', 'Hailemariam Wolde', '1970-04-25', 'MALE', '+251-91-208-3008', 'O+', '[]', '[{"condition":"Chronic kidney disease","since":"2016"},{"emergency_contact":{"name":"Wolde Hailemariam","phone":"+251-91-208-3992","relationship":"Daughter"}}]'),
('50000001-0000-4000-8000-000000000009', '40000001-0000-4000-8000-000000000009', 'FAYDA000009', 'Iman Tadesse', '1998-02-17', 'FEMALE', '+251-91-209-3009', 'AB+', '["Peanuts"]', '[{"emergency_contact":{"name":"Tadesse Iman","phone":"+251-91-209-3991","relationship":"Sister"}}]'),
('50000001-0000-4000-8000-000000000010', '40000001-0000-4000-8000-000000000010', 'FAYDA000010', 'Jemila Yusuf', '1983-08-03', 'FEMALE', '+251-91-210-3010', 'A+', '[]', '[{"condition":"Hypothyroidism","since":"2017"},{"emergency_contact":{"name":"Yusuf Ahmed","phone":"+251-91-210-3990","relationship":"Husband"}}]'),
('50000001-0000-4000-8000-000000000011', '40000001-0000-4000-8000-000000000011', 'FAYDA000011', 'Kebede Hailu', '1977-05-19', 'MALE', '+251-91-211-3011', 'B+', '["Codeine"]', '[{"condition":"Gout","since":"2014"},{"emergency_contact":{"name":"Hailu Kebede","phone":"+251-91-211-3989","relationship":"Wife"}}]'),
('50000001-0000-4000-8000-000000000012', '40000001-0000-4000-8000-000000000012', 'FAYDA000012', 'Lulit Demissie', '1990-10-11', 'FEMALE', '+251-91-212-3012', 'O-', '[]', '[{"emergency_contact":{"name":"Demissie Lulit","phone":"+251-91-212-3988","relationship":"Mother"}}]'),
('50000001-0000-4000-8000-000000000013', '40000001-0000-4000-8000-000000000013', 'FAYDA000013', 'Meseret Abebe', '1986-03-27', 'FEMALE', '+251-91-213-3013', 'A-', '["Dust mites"]', '[{"condition":"Eczema","since":"2005"},{"emergency_contact":{"name":"Abebe Meseret","phone":"+251-91-213-3987","relationship":"Brother"}}]'),
('50000001-0000-4000-8000-000000000014', '40000001-0000-4000-8000-000000000014', 'FAYDA000014', 'Nebiyu Girma', '1993-07-09', 'MALE', '+251-91-214-3014', 'O+', '[]', '[{"condition":"Migraine","since":"2012"},{"emergency_contact":{"name":"Girma Nebiyu","phone":"+251-91-214-3986","relationship":"Father"}}]'),
('50000001-0000-4000-8000-000000000015', '40000001-0000-4000-8000-000000000015', 'FAYDA000015', 'Ruth Haile', '1989-12-21', 'FEMALE', '+251-91-215-3015', 'B-', '["Penicillin","Amoxicillin"]', '[{"emergency_contact":{"name":"Haile Ruth","phone":"+251-91-215-3985","relationship":"Sister"}}]');

COMMIT;
