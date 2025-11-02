// Sistema de tema claro/oscuro
(function() {
  // Obtener tema guardado o usar 'light' por defecto
  let currentTheme = localStorage.getItem('theme') || 'light';
  
  // Aplicar tema inmediatamente para evitar parpadeo
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // También agregar clase .dark-mode al body para compatibilidad
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    if (document.body) {
      document.body.classList.add('dark-mode');
    }
  }
  
  // Esperar a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que body tenga la clase si es necesario
    if (currentTheme === 'dark' && document.body) {
      document.body.classList.add('dark-mode');
    }
    
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
    
    // Agregar/quitar clase dark-mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  }
})();
