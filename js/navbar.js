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
  if (navName && userData.name) {
    navName.textContent = userData.name;
  }
});