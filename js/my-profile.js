document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("userData")) || {};
  document.getElementById("userName").value = data.name || "";
  document.getElementById("userLastName").value = data.lastName || "";
  document.getElementById("userPhone").value = data.phone || "";
  document.getElementById("userEmailInput").value = data.email || "";

  // Imagen previa si existe
  if (data.photo) {
    const img = document.getElementById("previewImg");
    if (img) {
      img.src = data.photo;
      img.classList.remove("d-none");
    }
  }
});

// === Guardar datos personales ===
const userForm = document.getElementById("userForm");
if (userForm) {
  userForm.addEventListener("submit", e => {
    e.preventDefault();
    const currentData = JSON.parse(localStorage.getItem("userData")) || {};
    const data = {
      name: document.getElementById("userName").value,
      lastName: document.getElementById("userLastName").value,
      phone: document.getElementById("userPhone").value,
      email: document.getElementById("userEmailInput").value,
      photo: currentData.photo || ""
    };
    localStorage.setItem("userData", JSON.stringify(data));
    
    // Actualizar navbar
    const navUserName = document.getElementById("navUserName");
    if (navUserName) {
      navUserName.textContent = data.name || "";
    }
    
    alert("✅ Datos guardados correctamente");
  });
}

// === Imagen de perfil - Drop Zone ===
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("profilePic");
const preview = document.getElementById("previewImg");

// Click para abrir selector de archivos
if (dropZone && fileInput) {
  dropZone.addEventListener("click", () => fileInput.click());

  // Cambio de archivo
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      loadImageFile(file);
    }
  });

  // Drag & Drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#007bff";
    dropZone.style.background = "#f0f8ff";
  });

  dropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#d0d0d0";
    dropZone.style.background = "#fafafa";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#d0d0d0";
    dropZone.style.background = "#fafafa";
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImageFile(file);
    }
  });
}

// Función para cargar la imagen
function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    if (preview) {
      preview.src = reader.result;
      preview.classList.remove("d-none");
    }
  };
  reader.readAsDataURL(file);
}

// === Botón guardar foto ===
const savePhotoBtn = document.getElementById("savePhoto");
if (savePhotoBtn && preview) {
  savePhotoBtn.addEventListener("click", () => {
    if (preview.src && !preview.classList.contains("d-none")) {
      const data = JSON.parse(localStorage.getItem("userData")) || {};
      data.photo = preview.src;
      localStorage.setItem("userData", JSON.stringify(data));
      
      // Actualizar navbar
      const navImage = document.getElementById("navProfileImage");
      if (navImage) {
        navImage.src = preview.src;
      }
      
      alert("✅ Imagen guardada correctamente");
    } else {
      alert("⚠️ Por favor, selecciona una imagen primero");
    }
  });
}