document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("Datos de usuario");
    const header = document.querySelector(".container");

   
    // Validar si hay sesión activa
    if (isLoggedIn === "true" && userData) {
        const user = JSON.parse(userData);
        console.log("Usuario autenticado:", user);
    }
     


         const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'login.html') {
                // Validar si usuario está logueado redireccionar a index.
   
            // Si hay sesión activa, redirigir al index
            if (isLoggedIn === "true" && userData) {
                window.location.href = "index.html";
                return;
            }
            window.location.href = "login.html";
            return;
        }
    
    // cerrar sesión.
    function logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("Datos de usuario");
        window.location.href = "login.html";
    }

});






















