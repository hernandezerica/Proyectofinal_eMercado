// Sistema de tema claro/oscuro
(function() {
  // Obtener tema guardado o usar 'light' por defecto
  let currentTheme = localStorage.getItem('theme') || 'light';
  
  // Aplicar tema inmediatamente para evitar parpadeo
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Esperar a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    let themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
      // Establecer estado inicial del toggle
      themeToggle.checked = currentTheme === 'dark';
      
      // Cambiar tema al hacer clic
      themeToggle.onchange = function() {
        if (this.checked) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      };
    }
  });
  
  // Función para cambiar el tema
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
})();
