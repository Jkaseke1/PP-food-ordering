// Save the token and role to local storage
export const login = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
};

// Remove the token and role from local storage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

// Check if the user is authenticated by verifying the presence of a token
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Check if the user has an admin role
export const isAdmin = () => {
  return localStorage.getItem('role') === 'admin';
};