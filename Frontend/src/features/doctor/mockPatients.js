export const doctorPatients = [{
  id: 'PT-1042',
  name: 'Selam Bekele',
  age: 32,
  gender: 'Female',
  hospital: 'Black Lion Hospital',
  status: 'Stable',
  lastVisit: '2026-05-28',
  condition: 'Post-operative follow-up'
}, {
  id: 'PT-1087',
  name: 'Abel Tadesse',
  age: 47,
  gender: 'Male',
  hospital: 'St. Paul Millennium Medical College',
  status: 'Monitoring',
  lastVisit: '2026-05-24',
  condition: 'Hypertension review'
}, {
  id: 'PT-1099',
  name: 'Mekdes Ali',
  age: 29,
  gender: 'Female',
  hospital: 'Black Lion Hospital',
  status: 'Critical',
  lastVisit: '2026-05-21',
  condition: 'Acute respiratory monitoring'
}, {
  id: 'PT-1105',
  name: 'Daniel Bekele',
  age: 54,
  gender: 'Male',
  hospital: 'Yekatit 12 Hospital',
  status: 'Stable',
  lastVisit: '2026-05-18',
  condition: 'Diabetes management'
}, {
  id: 'PT-1121',
  name: 'Tigist Worku',
  age: 41,
  gender: 'Female',
  hospital: 'Yekatit 12 Hospital',
  status: 'Monitoring',
  lastVisit: '2026-05-16',
  condition: 'Cardiac rehabilitation'
}, {
  id: 'PT-1134',
  name: 'Yonas Habte',
  age: 36,
  gender: 'Male',
  hospital: 'St. Paul Millennium Medical College',
  status: 'Stable',
  lastVisit: '2026-05-10',
  condition: 'Orthopedic recovery'
}];
export const hospitalOptions = ['All Hospitals', ...Array.from(new Set(doctorPatients.map(patient => patient.hospital)))];
export const statusOptions = ['All Statuses', 'Stable', 'Monitoring', 'Critical'];
