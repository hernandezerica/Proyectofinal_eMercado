// ============================================
// CART-INIT.JS - INICIALIZACIÓN DEL CARRITO
// ============================================
// Este módulo inicializa todos los componentes del carrito
// en el orden correcto cuando se carga la página
// Autor: Máximo Gallo
// ENTREGA 5 - Versión completa con checkout
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // INICIALIZACIÓN - Al cargar la página
  // ============================================
  document.addEventListener("DOMContentLoaded", function() {
    
    console.log('🛒 Iniciando sistema de carrito...');
    
    // PASO 1: Cargar productos desde localStorage
    if (window.cargarCarrito) {
      window.cargarCarrito();
      console.log('✓ Productos cargados');
    }
    
    // PASO 2: Actualizar badge del carrito en el navbar
    if (window.actualizarBadgeCarrito) {
      window.actualizarBadgeCarrito();
      console.log('✓ Badge actualizado');
    }
    
    // PASO 3: Configurar eventos de tipo de envío
    if (window.configurarEventosEnvio) {
      window.configurarEventosEnvio();
      console.log('✓ Eventos de envío configurados');
    }
    
    // PASO 4: Configurar eventos de forma de pago
    if (window.configurarEventosPago) {
      window.configurarEventosPago();
      console.log('✓ Eventos de pago configurados');
    }
    
    // PASO 5: Configurar evento del botón finalizar compra
    if (window.configurarBotonFinalizarCompra) {
      window.configurarBotonFinalizarCompra();
      console.log('✓ Botón de compra configurado');
    }
    
    console.log('✅ Sistema de carrito listo');
  });
  
})();
