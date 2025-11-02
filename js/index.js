document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

// ericahernandez - Mostrar el nombre del usuario en el index
document.addEventListener("DOMContentLoaded", function () { 
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // Verificar si hay sesión activa
  const data = localStorage.getItem("userData"); // Obtener datos del usuario

  if (isLoggedIn === "true" && data) { // Si hay sesión activa
    const user = JSON.parse(data); 
    const userNameElement = document.getElementById("userName"); 
    if (userNameElement) {
      userNameElement.textContent = user.name;// Mostrar el nombre del usuario
    }
  } else {
    // Si no hay sesión activa → redirigimos a login
    window.location.href = "login.html";
  }
});