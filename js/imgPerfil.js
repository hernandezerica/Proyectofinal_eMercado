const input = document.getElementById('profilePic');
const preview = document.getElementById('previewImg');
const saveButton = document.getElementById('savePhoto');

// Cuando el usuario selecciona una imagen
if (input) {
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (preview) {
        preview.src = e.target.result;
        preview.classList.remove('d-none');
      }
    };
    reader.readAsDataURL(file);
  });
}

// Guardar la imagen en localStorage
if (saveButton) {
  saveButton.addEventListener('click', () => {
    if (preview && preview.src) {
      // Guardar en userData.photo en lugar de profileImage
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      userData.photo = preview.src;
      localStorage.setItem("userData", JSON.stringify(userData));
      alert('Imagen guardada correctamente.');
      
      // Actualizar la imagen del navbar inmediatamente
      const navImage = document.getElementById('navProfileImage');
      if (navImage) {
        navImage.src = preview.src;
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const navImage = document.getElementById('navProfileImage');
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  
  if (navImage) {
    if (userData.photo) {
      navImage.src = userData.photo;
    } else {
      navImage.src = 'img/userProfile.webp'; // Imagen por defecto
    }
  }
  
  // Cargar la imagen guardada en el preview si existe
  if (preview && userData.photo) {
    preview.src = userData.photo;
    preview.classList.remove('d-none');
  }
});