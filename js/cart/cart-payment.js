// ============================================
// CART-PAYMENT.JS - MÉTODOS DE PAGO
// ============================================
// Este módulo gestiona todos los métodos de pago:
// tarjeta de crédito y transferencia bancaria
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // ENTREGA 5 - Configurar eventos de forma de pago
  // ============================================
  function configurarEventosPago() {
    // Botón de tarjeta de crédito
    document.getElementById('payment-card-btn').addEventListener('click', function() {
      abrirModalPago('card');
    });
    
    // Botón de transferencia bancaria
    document.getElementById('payment-transfer-btn').addEventListener('click', function() {
      abrirModalPago('transfer');
    });
    
    // === MODAL TARJETA DE CRÉDITO ===
    
    // Cerrar modal (X)
    document.getElementById('close-card-modal').addEventListener('click', function() {
      cerrarModalPago('card');
    });
    
    // Cancelar modal
    document.getElementById('cancel-card-modal').addEventListener('click', function() {
      cerrarModalPago('card');
    });
    
    // Guardar datos de tarjeta
    document.getElementById('save-card-payment').addEventListener('click', function() {
      guardarDatosPago('card');
    });
    
    // Formateo automático del número de tarjeta
    document.getElementById('card-number').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
    
    // Formateo automático de fecha de vencimiento
    document.getElementById('card-expiry').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
    
    // Solo números en CVV
    document.getElementById('card-cvv').addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // === MODAL TRANSFERENCIA BANCARIA ===
    
    // Cerrar modal (X)
    document.getElementById('close-transfer-modal').addEventListener('click', function() {
      cerrarModalPago('transfer');
    });
    
    // Cancelar modal
    document.getElementById('cancel-transfer-modal').addEventListener('click', function() {
      cerrarModalPago('transfer');
    });
    
    // Guardar datos de transferencia
    document.getElementById('save-transfer-payment').addEventListener('click', function() {
      guardarDatosPago('transfer');
    });
    
    // Cerrar modal al hacer click fuera
    document.getElementById('payment-card-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        cerrarModalPago('card');
      }
    });
    
    document.getElementById('payment-transfer-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        cerrarModalPago('transfer');
      }
    });
  }
  
  // ============================================
  // ENTREGA 5 - Abrir modal de pago
  // ============================================
  function abrirModalPago(tipo) {
    if (tipo === 'card') {
      document.getElementById('payment-card-modal').classList.add('active');
    } else if (tipo === 'transfer') {
      document.getElementById('payment-transfer-modal').classList.add('active');
    }
  }
  
  // ============================================
  // ENTREGA 5 - Cerrar modal de pago
  // ============================================
  function cerrarModalPago(tipo) {
    if (tipo === 'card') {
      document.getElementById('payment-card-modal').classList.remove('active');
      // Limpiar errores
      limpiarErroresFormulario('card-payment-form');
    } else if (tipo === 'transfer') {
      document.getElementById('payment-transfer-modal').classList.remove('active');
      // Limpiar errores
      limpiarErroresFormulario('transfer-payment-form');
    }
  }
  
  // ============================================
  // ENTREGA 5 - Guardar datos del método de pago
  // ============================================
  function guardarDatosPago(tipo) {
    let valido = false;
    
    if (tipo === 'card') {
      valido = validarFormularioTarjeta();
      if (valido) {
        // Guardar datos (en la práctica, esto sería encriptado)
        window.paymentData = {
          tipo: 'card',
          numero: document.getElementById('card-number').value,
          vencimiento: document.getElementById('card-expiry').value,
          cvv: document.getElementById('card-cvv').value,
          titular: document.getElementById('card-name').value
        };
        window.selectedPaymentMethod = 'card';
        
        // Marcar botón como activo
        marcarMetodoPagoActivo('payment-card-btn');
        
        // Cerrar modal
        cerrarModalPago('card');
        
        // Ocultar error general si estaba visible
        document.getElementById('payment-error').style.display = 'none';
      }
    } else if (tipo === 'transfer') {
      valido = validarFormularioTransferencia();
      if (valido) {
        // Guardar datos
        window.paymentData = {
          tipo: 'transfer',
          banco: document.getElementById('bank-name').value,
          cuenta: document.getElementById('account-number').value,
          titular: document.getElementById('account-holder').value
        };
        window.selectedPaymentMethod = 'transfer';
        
        // Marcar botón como activo
        marcarMetodoPagoActivo('payment-transfer-btn');
        
        // Cerrar modal
        cerrarModalPago('transfer');
        
        // Ocultar error general si estaba visible
        document.getElementById('payment-error').style.display = 'none';
      }
    }
  }
  
  // ============================================
  // ENTREGA 5 - Marcar método de pago como activo
  // ============================================
  function marcarMetodoPagoActivo(botonId) {
    // Quitar clase active de todos los botones
    document.querySelectorAll('.payment-btn').forEach(function(btn) {
      btn.classList.remove('active');
      btn.querySelector('.payment-check').style.display = 'none';
    });
    
    // Agregar clase active al botón seleccionado
    let boton = document.getElementById(botonId);
    boton.classList.add('active');
    boton.querySelector('.payment-check').style.display = 'block';
  }
  
  // ============================================
  // ENTREGA 5 - Validar formulario de tarjeta
  // ============================================
  function validarFormularioTarjeta() {
    let valido = true;
    
    // Limpiar errores previos
    limpiarErroresFormulario('card-payment-form');
    
    // Validar número de tarjeta
    let numero = document.getElementById('card-number').value.replace(/\s/g, '');
    if (numero.length < 13 || numero.length > 19) {
      mostrarError('card-number', 'Número de tarjeta inválido');
      valido = false;
    }
    
    // Validar vencimiento
    let vencimiento = document.getElementById('card-expiry').value;
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
      mostrarError('card-expiry', 'Formato: MM/AA');
      valido = false;
    } else {
      // Validar que la fecha no esté vencida
      let [mes, año] = vencimiento.split('/').map(Number);
      let fechaActual = new Date();
      let mesActual = fechaActual.getMonth() + 1;
      let añoActual = fechaActual.getFullYear() % 100;
      
      if (año < añoActual || (año === añoActual && mes < mesActual)) {
        mostrarError('card-expiry', 'Tarjeta vencida');
        valido = false;
      }
    }
    
    // Validar CVV
    let cvv = document.getElementById('card-cvv').value;
    if (cvv.length < 3 || cvv.length > 4) {
      mostrarError('card-cvv', 'CVV inválido');
      valido = false;
    }
    
    // Validar nombre
    let nombre = document.getElementById('card-name').value.trim();
    if (nombre.length < 3) {
      mostrarError('card-name', 'Ingrese el nombre del titular');
      valido = false;
    }
    
    return valido;
  }
  
  // ============================================
  // ENTREGA 5 - Validar formulario de transferencia
  // ============================================
  function validarFormularioTransferencia() {
    let valido = true;
    
    // Limpiar errores previos
    limpiarErroresFormulario('transfer-payment-form');
    
    // Validar banco
    let banco = document.getElementById('bank-name').value;
    if (!banco) {
      mostrarError('bank-name', 'Seleccione un banco');
      valido = false;
    }
    
    // Validar número de cuenta
    let cuenta = document.getElementById('account-number').value.trim();
    if (cuenta.length < 6) {
      mostrarError('account-number', 'Número de cuenta inválido');
      valido = false;
    }
    
    // Validar titular
    let titular = document.getElementById('account-holder').value.trim();
    if (titular.length < 3) {
      mostrarError('account-holder', 'Ingrese el nombre del titular');
      valido = false;
    }
    
    return valido;
  }
  
  // ============================================
  // ENTREGA 5 - Mostrar error en campo específico
  // ============================================
  function mostrarError(campoId, mensaje) {
    let campo = document.getElementById(campoId);
    let errorDiv = document.getElementById(campoId + '-error');
    
    campo.classList.add('error');
    campo.classList.remove('success');
    
    if (errorDiv) {
      errorDiv.textContent = mensaje;
      errorDiv.style.display = 'flex';
    }
  }
  
  // ============================================
  // ENTREGA 5 - Limpiar errores de un formulario
  // ============================================
  function limpiarErroresFormulario(formId) {
    let form = document.getElementById(formId);
    if (!form) return;
    
    // Quitar clases de error de todos los inputs
    form.querySelectorAll('.form-input').forEach(function(input) {
      input.classList.remove('error');
      input.classList.remove('success');
    });
    
    // Ocultar todos los mensajes de error
    form.querySelectorAll('.form-error').forEach(function(errorDiv) {
      errorDiv.style.display = 'none';
    });
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.configurarEventosPago = configurarEventosPago;
  window.abrirModalPago = abrirModalPago;
  window.cerrarModalPago = cerrarModalPago;
  window.guardarDatosPago = guardarDatosPago;
  window.marcarMetodoPagoActivo = marcarMetodoPagoActivo;
  window.validarFormularioTarjeta = validarFormularioTarjeta;
  window.validarFormularioTransferencia = validarFormularioTransferencia;
  window.mostrarError = mostrarError;
  window.limpiarErroresFormulario = limpiarErroresFormulario;
  
  // Log de inicialización
  console.log('✓ Módulo cart-payment.js cargado');
  
})();
