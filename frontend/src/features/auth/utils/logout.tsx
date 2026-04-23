export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");

  // navigate("/login");
}


// function logout() {
//   // 1. مسح token
//   localStorage.removeItem("token");

//   // 2. (اختياري) مسح user إلا كنت مخزنو
//   localStorage.removeItem("user");

//   // 3. redirect ل login
//   window.location.href = "/login";
// }