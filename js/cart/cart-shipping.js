// ============================================
// CART-SHIPPING.JS - GESTIÓN DE ENVÍO
// ============================================
// Este módulo maneja la validación de la dirección de envío
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // ENTREGA 5 - Validar dirección de envío
  // ============================================
  function validarDireccionEnvio() {
    let valido = true;
    
    // Campos requeridos
    let campos = [
      { id: 'department', nombre: 'Departamento' },
      { id: 'locality', nombre: 'Localidad' },
      { id: 'street', nombre: 'Calle' },
      { id: 'number', nombre: 'Número' },
      { id: 'corner', nombre: 'Esquina' }
    ];
    
    // Limpiar errores previos
    campos.forEach(function(campo) {
      let input = document.getElementById(campo.id);
      let errorDiv = document.getElementById(campo.id + '-error');
      input.classList.remove('error');
      input.classList.remove('success');
      if (errorDiv) errorDiv.style.display = 'none';
    });
    
    // Validar cada campo
    campos.forEach(function(campo) {
      let input = document.getElementById(campo.id);
      let valor = input.value.trim();
      
      if (!valor) {
        if (window.mostrarError) {
          window.mostrarError(campo.id, 'Este campo es requerido');
        }
        valido = false;
      } else {
        // Marcar como válido
        input.classList.add('success');
        input.classList.remove('error');
      }
    });
    
    return valido;
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.validarDireccionEnvio = validarDireccionEnvio;
  
  // Log de inicialización
  console.log('✓ Módulo cart-shipping.js cargado');
  
})();
