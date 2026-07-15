export const medicalEventTemplates = [{
  type: 'VISIT_CREATED',
  label: 'Visit Created',
  description: 'Document a new outpatient or inpatient visit entry.',
  fields: [{
    name: 'title',
    label: 'Title',
    placeholder: 'Emergency outpatient visit opened'
  }, {
    name: 'facility',
    label: 'Facility',
    placeholder: 'Tikur Anbessa Specialized Hospital'
  }, {
    name: 'priority',
    label: 'Priority',
    placeholder: 'urgent'
  }]
}, {
  type: 'DIAGNOSIS_ADDED',
  label: 'Diagnosis Added',
  description: 'Capture a new diagnosis after evaluation.',
  fields: [{
    name: 'title',
    label: 'Diagnosis Title',
    placeholder: 'Hypertension exacerbation documented'
  }, {
    name: 'primaryDiagnosis',
    label: 'Primary Diagnosis',
    placeholder: 'Hypertension exacerbation'
  }, {
    name: 'notes',
    label: 'Clinical Notes',
    placeholder: 'No acute cardiac event suspected'
  }]
}, {
  type: 'PRESCRIPTION_ISSUED',
  label: 'Prescription Issued',
  description: 'Add the medication plan for this timeline record.',
  fields: [{
    name: 'title',
    label: 'Medication Title',
    placeholder: 'Amlodipine prescription issued'
  }, {
    name: 'medication',
    label: 'Medication',
    placeholder: 'Amlodipine 5 mg'
  }, {
    name: 'instructions',
    label: 'Instructions',
    placeholder: 'Once daily after breakfast'
  }]
}, {
  type: 'LAB_RESULT_UPLOADED',
  label: 'Lab Result Uploaded',
  description: 'Attach a lab result to the clinical timeline.',
  fields: [{
    name: 'title',
    label: 'Lab Title',
    placeholder: 'Complete blood count uploaded'
  }, {
    name: 'lab',
    label: 'Lab Type',
    placeholder: 'CBC'
  }, {
    name: 'result',
    label: 'Result Summary',
    placeholder: 'Hemoglobin and WBC within target range'
  }]
}, {
  type: 'DOCTOR_NOTE_ADDED',
  label: 'Doctor Note Added',
  description: 'Record follow-up guidance and consultation notes.',
  fields: [{
    name: 'title',
    label: 'Note Title',
    placeholder: 'Follow-up note added'
  }, {
    name: 'summary',
    label: 'Summary',
    placeholder: 'Lifestyle counseling reinforced'
  }, {
    name: 'followUp',
    label: 'Follow-up Plan',
    placeholder: 'Review blood pressure in two weeks'
  }]
}];
export function getMedicalEventTemplate(type) {
  return medicalEventTemplates.find(item => item.type === type) ?? medicalEventTemplates[0];
}
