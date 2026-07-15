  const STORAGE_KEY = 'prescriptions';

  export const PRESCRIPTION_STATUS = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  };

  const mockPrescriptions = [
    {
      id: 'RX-1001',
      patientId: '1',
      patientName: 'Test Patient',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: '3 times daily',
      duration: '7 days',
      instructions: 'Take after meals',
      prescribedBy: 'Dr. Test Doctor',
      prescribedDate: '2026-06-15',
      status: PRESCRIPTION_STATUS.ACTIVE
    },
    {
      id: 'RX-1002',
      patientId: '1',
      patientName: 'Test Patient',
      medication: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Every 6 hours',
      duration: '5 days',
      instructions: 'Take as needed for pain',
      prescribedBy: 'Dr. Test Doctor',
      prescribedDate: '2026-05-20',
      status: PRESCRIPTION_STATUS.COMPLETED
    },
    {
      id: 'RX-1003',
      patientId: '1',
      patientName: 'Test Patient',
      medication: 'Metformin',
      dosage: '850mg',
      frequency: 'Twice daily',
      duration: 'Ongoing',
      instructions: 'Take with breakfast and dinner',
      prescribedBy: 'Dr. Test Doctor',
      prescribedDate: '2026-04-10',
      status: PRESCRIPTION_STATUS.ACTIVE
    }
  ];

  function initializeStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);

    if (!existing) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mockPrescriptions)
      );
    }
  }

  export function getPrescriptions() {
    initializeStorage();

    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
    } catch {
      return [];
    }
  }

  export function savePrescriptions(prescriptions) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(prescriptions)
    );
  }

  export function addPrescription(prescription) {
    const prescriptions = getPrescriptions();

    prescriptions.push({
      ...prescription,
      id: prescription.id || `RX-${Date.now()}`
    });

    savePrescriptions(prescriptions);
  }

  export function getPatientPrescriptions(patientId) {
    return getPrescriptions().filter(
      (prescription) =>
        prescription.patientId === patientId
    );
  }

  export function updatePrescriptionStatus(
    prescriptionId,
    status
  ) {
    const prescriptions = getPrescriptions();

    const updated = prescriptions.map(
      (prescription) =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              status
            }
          : prescription
    );

    savePrescriptions(updated);
  }

  export function deletePrescription(
    prescriptionId
  ) {
    const prescriptions = getPrescriptions();

    const filtered = prescriptions.filter(
      (prescription) =>
        prescription.id !== prescriptionId
    );

    savePrescriptions(filtered);
  }