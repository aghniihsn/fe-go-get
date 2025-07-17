// Utility untuk cek login dan role
export function isLoggedIn() {
  return !!localStorage.getItem("user_id");
}

export function getUserRole() {
  return localStorage.getItem("user_role") || "user";
}

export function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_nama");
}
