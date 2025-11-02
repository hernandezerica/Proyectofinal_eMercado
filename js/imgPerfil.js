const input = document.getElementById('profileImageInput');
const preview = document.getElementById('profilePreview');
const saveButton = document.getElementById('saveProfileImage');

// Cuando el usuario selecciona una imagen
input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Guardar la imagen en localStorage
saveButton.addEventListener('click', () => {
  if (preview.src) {
    localStorage.setItem('profileImage', preview.src);
    alert('Imagen guardada correctamente.');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const navImage = document.getElementById('navProfileImage');
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    navImage.src = savedImage;
  } else {
    navImage.src = 'img/default-avatar.png'; // opcional, una imagen por defecto
  }
});