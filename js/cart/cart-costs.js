// ============================================
// CART-COSTS.JS - CÁLCULO DE COSTOS
// ============================================
// Este módulo maneja todos los cálculos relacionados con
// subtotal, envío y total del carrito
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // ENTREGA 4 - Autor: Máximo Gallo
  // ENTREGA 5 - Función mejorada que actualiza el resumen de compra
  // Calcula: subtotal, envío (basado en porcentaje seleccionado) y total
  // ============================================
  function actualizarResumen() {
    // Obtener productos del carrito
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Variables para los cálculos
    let subtotal = 0;
    
    // Calcular subtotal sumando todos los productos
    cartItems.forEach(function(producto) {
      subtotal += producto.cost * producto.quantity;
    });
    
    // Obtener el porcentaje de envío seleccionado (default 5% = 0.05)
    let shippingPercentage = obtenerPorcentajeEnvio();
    
    // Calcular costo de envío
    let costoEnvio = subtotal * shippingPercentage;
    
    // Calcular el total
    let total = subtotal + costoEnvio;
    
    // Actualizar los valores en el HTML
    document.getElementById('subtotal-amount').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shipping-amount').textContent = '$' + costoEnvio.toFixed(2);
    document.getElementById('total-amount').textContent = '$' + total.toFixed(2);
    
    // Actualizar el texto del porcentaje
    let percentageText = (shippingPercentage * 100) + '%';
    document.getElementById('shipping-percentage').textContent = '(' + percentageText + ')';
  }
  
  // ============================================
  // ENTREGA 5 - Función que obtiene el porcentaje de envío seleccionado
  // ============================================
  function obtenerPorcentajeEnvio() {
    let radioSeleccionado = document.querySelector('input[name="shipping-type"]:checked');
    if (radioSeleccionado) {
      return parseFloat(radioSeleccionado.value);
    }
    return 0.05; // Default: 5%
  }
  
  // ============================================
  // ENTREGA 5 - Configurar eventos de tipo de envío
  // ============================================
  function configurarEventosEnvio() {
    let radios = document.querySelectorAll('input[name="shipping-type"]');
    radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        // Ocultar error si estaba visible
        document.getElementById('shipping-error').style.display = 'none';
        // Actualizar resumen cuando cambia el tipo de envío
        actualizarResumen();
      });
    });
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.actualizarResumen = actualizarResumen;
  window.obtenerPorcentajeEnvio = obtenerPorcentajeEnvio;
  window.configurarEventosEnvio = configurarEventosEnvio;
  
  // Log de inicialización
  console.log('✓ Módulo cart-costs.js cargado');
  
})();
