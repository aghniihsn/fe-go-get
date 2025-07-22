// Utility untuk cek login dan role
export function isLoggedIn() {
  return !!localStorage.getItem("jwt_token");
}

export function getUserRole() {
  return localStorage.getItem("user_role") || "user";
}

export function getUserId() {
  return localStorage.getItem("user_id");
}

export function getUserInfo() {
  return {
    id: localStorage.getItem("user_id"),
    username: localStorage.getItem("user_username"),
    email: localStorage.getItem("user_email"),
    role: localStorage.getItem("user_role")
  };
}

export function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_username");
  localStorage.removeItem("user_email");
  localStorage.removeItem("jwt_token");
}
