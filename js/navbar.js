window.addEventListener("DOMContentLoaded", () => {
  const navImage = document.getElementById("navProfileImage");
  const navName = document.getElementById("navUserName");

  // Recuperar todo el objeto guardado
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  
  // Mostrar imagen
  if (navImage) {
    if (userData.photo) {
      navImage.src = userData.photo;
    } else {
      navImage.src = "img/userProfile.webp";
    }
  }

  // Mostrar nombre
  if (navName) {
    if (userData.name) {
      navName.textContent = userData.name;
    } else if (userData.email) {
      // Si no hay nombre, mostrar email
      navName.textContent = userData.email.split('@')[0];
    } else {
      navName.textContent = "Usuario";
    }
  }
});