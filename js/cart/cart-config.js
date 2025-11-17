// ============================================
// CART-CONFIG.JS - CONFIGURACIÓN GLOBAL
// ============================================
// Este módulo contiene las variables globales compartidas
// entre todos los módulos del carrito
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // VARIABLES GLOBALES
  // ============================================
  
  // Método de pago seleccionado: 'card' (tarjeta) o 'transfer' (transferencia)
  window.selectedPaymentMethod = null;
  
  // Objeto que almacena los datos del método de pago seleccionado
  // Para tarjeta: {tipo, numero, vencimiento, cvv, titular}
  // Para transferencia: {tipo, banco, cuenta, titular}
  window.paymentData = {};
  
  // Log de inicialización (útil para debugging)
  console.log('✓ Módulo cart-config.js cargado');
  
})();
