document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("userData")) || {};
  document.getElementById("userName").value = data.name || "";
  document.getElementById("userLastName").value = data.lastName || "";
  document.getElementById("userPhone").value = data.phone || "";
  document.getElementById("userEmailInput").value = data.email || "";
  document.getElementById("userEmail").textContent = data.email || "usuario@email.com";

  // Tema guardado
  const theme = localStorage.getItem("theme") || "light";
  applyTheme(theme);
  document.getElementById("themeToggle").checked = theme === "dark";

  // Imagen previa si existe
  if (data.photo) {
    const img = document.getElementById("previewImg");
    img.src = data.photo;
    img.classList.remove("d-none");
  }
});

// === Guardar datos personales ===
document.getElementById("userForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    name: document.getElementById("userName").value,
    lastName: document.getElementById("userLastName").value,
    phone: document.getElementById("userPhone").value,
    email: document.getElementById("userEmailInput").value,
    photo: JSON.parse(localStorage.getItem("userData"))?.photo || ""
  };
  localStorage.setItem("userData", JSON.stringify(data));
  alert("✅ Datos guardados correctamente");
});

// === Imagen de perfil ===
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("profilePic");
const preview = document.getElementById("previewImg");

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.classList.remove("d-none");
      const data = JSON.parse(localStorage.getItem("userData")) || {};
      data.photo = reader.result;
      localStorage.setItem("userData", JSON.stringify(data));
    };
    reader.readAsDataURL(file);
  }
});