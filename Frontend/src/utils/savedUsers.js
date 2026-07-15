const STORAGE_KEY = 'tenalink_saved_users';
export function getSavedUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
export function saveUser(user) {
  try {
    const users = getSavedUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...user,
        lastLogin: new Date().toISOString()
      };
    } else {
      users.push({
        ...user,
        lastLogin: new Date().toISOString()
      });
    }
    users.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}
export function removeSavedUser(email) {
  try {
    const users = getSavedUsers().filter(u => u.email !== email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
}
