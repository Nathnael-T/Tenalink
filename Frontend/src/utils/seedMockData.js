export function seedMockData() {
  const mockUsers = [
    {
      id: 'patient-1',
      email: 'patient@test.com',
      password: '123456',
      role: 'patient',
      full_name: 'Test Patient'
    },
    {
      id: 'doctor-1',
      email: 'doctor@test.com',
      password: '123456',
      role: 'doctor',
      full_name: 'Test Doctor'
    },
    {
      id: 'admin-1',
      email: 'admin@test.com',
      password: '123456',
      role: 'hospital_admin',
      full_name: 'Hospital Admin'
    },
    {
      id: 'super-1',
      email: 'super@test.com',
      password: '123456',
      role: 'super_admin',
      full_name: 'Super Admin'
    }
  ];

  if (!localStorage.getItem('users')) {
    localStorage.setItem(
      'users',
      JSON.stringify(mockUsers)
    );
  }
}