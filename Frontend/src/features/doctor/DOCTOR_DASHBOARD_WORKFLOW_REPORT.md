# Doctor Dashboard workflow connections

This dashboard now uses only existing doctor workflow routes and mocked data.

## Connection map

- Recent Patients -> /doctor/patients/:patientId
  - Each patient card opens the existing patient summary route.
- Recent Clinical Activity -> /doctor/patients/:patientId/timeline
  - Each activity item opens the existing patient timeline route.
- Clinical Tasks -> /doctor/patients/:patientId
  - Each task card opens the appropriate patient summary route.
- Quick Actions -> existing doctor routes
  - Browse patients -> /doctor/patients
  - Open summary -> /doctor/patients/PT-1042
  - View timeline -> /doctor/patients/PT-1042/timeline
  - Add medical event -> /doctor/patients/PT-1042/add-event

## Implementation notes

- No new pages were added.
- No layout files were modified.
- No API connections were introduced.
- All dashboard content remains mocked.
