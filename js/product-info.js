// ============================================
// 🎬 INICIO: Cuando la página carga
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  
  // ¡DESAFIATE! - Autor: Máximo Gallo - Actualizar badge del carrito al cargar la página
  actualizarBadgeCarrito();

  // ============================================
  // MODAL REUTILIZABLE - Autor: Máximo Gallo
  // Función para mostrar modal de confirmación/información
  // ============================================
  /**
   * Muestra un modal personalizado
   * @param {string} title - Título del modal
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo: 'success', 'warning', 'danger', 'info'
   * @param {function} onConfirm - Función callback al confirmar (opcional)
   * @param {boolean} showCancel - Mostrar botón cancelar (default: true)
   */
  window.mostrarModal = function(title, message, type, onConfirm, showCancel = true) {
    let overlay = document.getElementById('modal-overlay');
    let modalTitle = document.getElementById('modal-title');
    let modalMessage = document.getElementById('modal-message');
    let modalIcon = document.getElementById('modal-icon');
    let confirmBtn = document.getElementById('modal-confirm');
    let cancelBtn = document.getElementById('modal-cancel');

    // Configurar contenido
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    // Configurar icono según tipo
    modalIcon.className = 'modal-icon ' + type;
    let iconClass = {
      'success': 'fa fa-check',
      'warning': 'fa fa-exclamation-triangle',
      'danger': 'fa fa-trash',
      'info': 'fa fa-info-circle'
    };
    modalIcon.innerHTML = '<i class="' + (iconClass[type] || 'fa fa-info') + '"></i>';

    // Configurar botón de confirmar según tipo
    confirmBtn.className = 'modal-btn';
    if (type === 'success' || type === 'info') {
      confirmBtn.classList.add('modal-btn-primary');
      confirmBtn.textContent = 'Aceptar';
    } else if (type === 'danger') {
      confirmBtn.classList.add('modal-btn-confirm');
      confirmBtn.textContent = 'Eliminar';
    } else {
      confirmBtn.classList.add('modal-btn-success');
      confirmBtn.textContent = 'Confirmar';
    }

    // Mostrar/ocultar botón cancelar
    if (showCancel) {
      cancelBtn.style.display = 'block';
    } else {
      cancelBtn.style.display = 'none';
    }

    // Mostrar modal
    overlay.classList.add('active');

    // Evento: Confirmar
    confirmBtn.onclick = function() {
      overlay.classList.remove('active');
      if (onConfirm && typeof onConfirm === 'function') {
        onConfirm();
      }
    };

    // Evento: Cancelar
    cancelBtn.onclick = function() {
      overlay.classList.remove('active');
    };

    // Evento: Click fuera del modal
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    };
  };
  
  // 👻 PASO 1: Referencias al skeleton (placeholders animados)
  let skeleton = document.getElementById('product-skeleton');
  let layout = document.getElementById('product-layout');
  if (typeof showSpinner === 'function') showSpinner();

  // 🔑 PASO 2: Obtener ID del producto desde localStorage
  let prodID = localStorage.getItem("prodID");
  if (!prodID) {
    window.location = "products.html"; // Si no hay ID, volver a productos
    return;
  }

  // 🌐 PASO 3: Construir URLs de la API
  let infoUrl = PRODUCT_INFO_URL + prodID + EXT_TYPE;         // Info del producto
  let commentsUrl = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE; // Comentarios

  // ============================================
  // 📥 PASO 4: Fetch - Traer datos del producto
  // ============================================
  getJSONData(infoUrl).then(function(infoResp) {
    
    // ❌ Si falla, mostrar error
    if (infoResp.status !== "ok") {
      simpleError();
      if (skeleton) skeleton.remove();
      if (typeof hideSpinner === 'function') hideSpinner();
      return;
    }
    
    let prod = infoResp.data; // Datos del producto

    // ============================================
    // 🎨 PASO 5: Renderizar información básica
    // ============================================
    document.getElementById("product-name").textContent = prod.name || "Producto";
    document.getElementById("product-category").textContent = prod.category || "";
    document.getElementById("product-description").textContent = prod.description || "";
    document.getElementById("product-price").textContent = (prod.currency || "") + " " + (prod.cost || "");
    

    // ============================================
    // 🖼️ PASO 6: Renderizar componentes visuales
    // ============================================
    renderImages(prod.images || []);           // Galería de imágenes
    renderVariants(prod.images || []);         // Variantes (máx 2)
    renderRelated(prod.relatedProducts || []); // Productos relacionados
    setupShare(prod);                          // Botones de compartir

    // ============================================
    // 🔢 PASO 7: Sistema de cantidad (+ y -)
    // ============================================
    let qty = 1;       // Cantidad inicial
    let MIN_Q = 1;     // Mínimo
    let MAX_Q = 99;    // Máximo
    
    // Actualiza el número y habilita/deshabilita botones
    function updateQty() {
      document.getElementById("qty-value").textContent = qty; 
      document.getElementById("qty-minus").disabled = qty <= MIN_Q; // Deshabilita "-" si está en 1
      document.getElementById("qty-plus").disabled = qty >= MAX_Q;  // Deshabilita "+" si está en 99
    }
    
    // Botón MENOS: disminuye cantidad
    document.getElementById("qty-minus").onclick = function() {
      if (qty > MIN_Q) {
        qty--;
        updateQty();
      }
    };
    
    // Botón MÁS: aumenta cantidad
    document.getElementById("qty-plus").onclick = function() {
      if (qty < MAX_Q) {
        qty++;
        updateQty();
      }
    };
    
    updateQty(); // Inicializar

    // ============================================
    // ENTREGA 2 - Autor: Máximo Gallo
    // Función para agregar producto al carrito en localStorage
    // ============================================
    function agregarAlCarrito(navigateToCart) {
      // Crear objeto con la información del producto
      let productoCarrito = {
        id: prodID,
        name: prod.name,
        description: prod.description || '',
        cost: prod.cost,
        currency: prod.currency,
        quantity: qty,
        image: prod.images && prod.images.length > 0 ? prod.images[0] : 'img/prod_generic.jpg'
      };
      
      // Obtener carrito actual del localStorage (o array vacío si no existe)
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // ¡DESAFIATE! - Verificar si el producto ya existe en el carrito
      let productoExistente = cart.find(item => item.id === prodID);
      
      let mensaje = '';
      if (productoExistente) {
        // Si existe, solo aumentar la cantidad
        productoExistente.quantity += qty;
        mensaje = 'Se agregaron ' + qty + ' unidades más de "' + prod.name + '" al carrito.\n\nCantidad total: ' + productoExistente.quantity + ' unidades';
      } else {
        // Si no existe, agregar el nuevo producto
        cart.push(productoCarrito);
        mensaje = qty + ' x "' + prod.name + '" se agregó correctamente al carrito.';
      }
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Actualizar badge del carrito
      actualizarBadgeCarrito();
      
      // Si navigateToCart es true, redirigir al carrito inmediatamente
      if (navigateToCart) {
        window.location.href = 'cart.html';
      } else {
        // Mostrar modal de confirmación solo si no se navega al carrito
        mostrarModal(
          '¡Producto agregado!',
          mensaje,
          'success',
          null,
          false // No mostrar botón cancelar
        );
      }
    }

    // 🛒 ENTREGA 2 - Autor: Máximo Gallo - Botón "Agregar al carrito"
    document.getElementById("add-to-cart").onclick = function() {
      agregarAlCarrito(false); // No navegar al carrito
    };

    // 🛒 ENTREGA 2 - Autor: Máximo Gallo - Botón "Comprar"
    // Agrega al carrito y navega a cart.html
    document.getElementById("buy-now").onclick = function() {
      agregarAlCarrito(true); // Navegar al carrito
    };

    // ============================================
    // 💬 PASO 8: Fetch - Traer comentarios
    // ============================================
    getJSONData(commentsUrl).then(function(commentsResp) {
      let apiComments = [];
      if (commentsResp.status === "ok") {
        apiComments = commentsResp.data || []; // Comentarios de la API
      }
      window.productCommentsFromAPI = apiComments; // Guardar globalmente
      renderComments(apiComments);                 // Mostrar comentarios

      // ============================================
      // ✅ PASO 9: Finalizar carga (ocultar skeleton)
      // ============================================
      if (skeleton) skeleton.style.display = 'none'; // Oculta placeholders
      if (layout) layout.hidden = false;             // Muestra contenido real
      if (typeof hideSpinner === 'function') hideSpinner();

      // ============================================
      // 📝 PASO 10: Inicializar formulario de comentarios
      // ============================================
      setupCommentForm(renderComments);
    });
  });

  // ============================================
  // 🖼️ FUNCIÓN: Galería de imágenes con miniaturas
  // ============================================
  function renderImages(images) {
    let thumbs = document.getElementById("thumbs");
    if (!thumbs) return;
    thumbs.innerHTML = ""; // Limpiar
    
    let mainImage = document.getElementById("main-image");
    
    // Si no hay imágenes, mostrar placeholder
    if (!images.length) {
      if (mainImage) mainImage.src = placeholder();
      return;
    }
    
    // Crear una miniatura por cada imagen
    for (let i = 0; i < images.length; i++) {
      let src = images[i];
      let btn = document.createElement("button");
      btn.innerHTML = '<img src="' + src + '" alt="thumb ' + (i+1) + '">';
      
      // Primera imagen es la activa
      if (i === 0) {
        btn.classList.add("active");
        if (mainImage) mainImage.src = src;
      }
      
      // Al hacer click: cambia imagen principal
      btn.onclick = (function(srcCopy) {
        return function() {
          if (mainImage) mainImage.src = srcCopy;         // Cambia imagen grande
          let allButtons = thumbs.querySelectorAll("button");
          for (let j = 0; j < allButtons.length; j++) {
            allButtons[j].classList.remove("active");      // Quita "active" de todas
          }
          this.classList.add("active");                    // Marca esta como activa
        };
      })(src); // Closure para mantener la imagen correcta
      
      thumbs.appendChild(btn);
    }
  }

  // ============================================
  // 🎨 FUNCIÓN: Variantes del producto (máximo 2)
  // ============================================
  function renderVariants(images) {
    let wrap = document.getElementById("variants");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (!images.length) return;
    
    let maxVariants = Math.min(2, images.length); // Solo mostrar 2 variantes
    
    for (let i = 0; i < maxVariants; i++) {
      let src = images[i];
      let div = document.createElement("div");
      div.className = "variant-item";
      if (i === 0) div.className = div.className + " active"; // Primera activa
      div.innerHTML = '<img src="' + src + '" alt="var ' + (i+1) + '">';
      
      // Al hacer click: cambia imagen principal y marca como activa
      div.onclick = (function(srcCopy) {
        return function() {
          let allVariants = wrap.querySelectorAll('.variant-item');
          for (let j = 0; j < allVariants.length; j++) {
            allVariants[j].classList.remove('active');
          }
          this.classList.add('active');
          let mainImage = document.getElementById("main-image");
          if (mainImage) mainImage.src = srcCopy;
        };
      })(src);
      
      wrap.appendChild(div);
    }
  }

  // ============================================
  // 💬 FUNCIÓN: Mostrar comentarios
  // ============================================
  function renderComments(comments) {
    let list = document.getElementById("comments-list");
    if (!list) return;
    list.innerHTML = "";
    
    // Si no hay comentarios, mostrar mensaje
    if (!comments.length) { 
      list.innerHTML = '<div class="comment-item">Aún no hay comentarios.</div>'; 
      return; 
    }
    
    // Crear un div por cada comentario
    for (let i = 0; i < comments.length; i++) {
      let c = comments[i];
      let div = document.createElement("div");
      div.className = "comment-item";
      
      // Construir HTML con funciones auxiliares
      div.innerHTML = '<div class="comment-row"><div class="comment-user-stars"><span class="comment-user">' + 
        esc(c.user) +              // Escapar usuario (seguridad)
        '</span><span class="comment-stars">' + 
        stars(c.score) +           // Convertir número a estrellas ★★★☆☆
        '</span></div><span class="comment-date"><i class="fa fa-clock-o"></i>' + 
        formatDate(c.dateTime) +   // Formatear fecha: 25/02/2019
        '</span></div><div class="comment-text">' + 
        esc(c.description) +       // Escapar texto (previene XSS)
        '</div>';
      
      list.appendChild(div);
    }
  }

  // ============================================
  // 🔗 FUNCIÓN: Mostrar productos relacionados
  // ============================================
  function renderRelated(related) {
    let grid = document.getElementById("related-products"); 
    if (!grid) return;
    grid.innerHTML = "";
    
    // Si no hay productos, mostrar mensaje
    if (!related.length) { 
      grid.innerHTML = '<div class="text-muted">No hay productos relacionados.</div>'; 
      return; 
    }
    
    // Crear un card por cada producto
    for (let i = 0; i < related.length; i++) {
      let r = related[i];
      let card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = '<img src="' + r.image + '" alt="' + esc(r.name) + '"><div class="rel-name">' + esc(r.name) + '</div>';
      
      // Al hacer click: guarda el ID y redirige
      card.onclick = (function(idCopy) {
        return function() {
          try {
            localStorage.setItem("prodID", String(idCopy)); // Guardar nuevo ID
          } catch (e) {}
          window.location = "product-info.html";            // Recargar página con nuevo producto
        };
      })(r.id);
      
      grid.appendChild(card);
    }
  }

  // ============================================
  // 🛠️ FUNCIONES AUXILIARES
  // ============================================
  
  // ⭐ Convierte número a estrellas
  // Ejemplo: stars(3) → "★★★☆☆"
  function stars(n) {
    let s = Math.max(0, Math.min(5, Number(n) || 0)); // Entre 0 y 5
    let estrellas = "";
    
    // Agregar estrellas llenas
    for (let i = 0; i < s; i++) {
      estrellas = estrellas + "★";
    }
    // Agregar estrellas vacías
    for (let i = s; i < 5; i++) {
      estrellas = estrellas + "☆";
    }
    return estrellas;
  }

  // 📅 Formatea fecha de "2019-02-25 18:03:52" a "25/02/2019"
  function formatDate(dt) {
    if (!dt) return "";
    let parts = dt.split(" ")[0].split("-"); // ["2019", "02", "25"]
    if (parts.length === 3) {
      return parts[2] + "/" + parts[1] + "/" + parts[0]; // Día/Mes/Año
    }
    return dt;
  }

  // 🛡️ Escapa caracteres HTML para prevenir ataques XSS
  // Ejemplo: esc("<script>") → "&lt;script&gt;"
  function esc(str) {
    let texto = String(str || "");
    texto = texto.replace(/&/g, "&amp;");   // & → &amp;
    texto = texto.replace(/</g, "&lt;");    // < → &lt;
    texto = texto.replace(/>/g, "&gt;");    // > → &gt;
    texto = texto.replace(/"/g, "&quot;");  // " → &quot;
    texto = texto.replace(/'/g, "&#39;");   // ' → &#39;
    return texto;
  }

  // 🖼️ Imagen placeholder cuando no hay imagen
  function placeholder() {
    return "data:image/svg+xml;charset=utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-size="32" fill="#999" text-anchor="middle" dy=".3em">Sin imagen</text></svg>');
  }

  // ❌ Muestra mensaje de error si falla la carga
  function simpleError() {
    document.querySelector("main").innerHTML = '<div class="alert alert-danger">No se pudo cargar el producto.</div>';
  }

  // ============================================
  // 📤 FUNCIÓN: Configurar botones de compartir
  // ============================================
  function setupShare(prod) {
    let container = document.getElementById('share-icons-inline');
    if (!container) return;
    
    let pageUrl = location.href.split('#')[0];        // URL de la página
    let text = encodeURIComponent(prod.name || 'Producto'); // Texto a compartir
    
    // Configurar redes sociales
    let shareLinks = [
      { name: 'WhatsApp', icon: 'fa-whatsapp', url: 'https://api.whatsapp.com/send?text=' + text + '%20' + encodeURIComponent(pageUrl) },
      { name: 'Facebook', icon: 'fa-facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) },
      { name: 'Pinterest', icon: 'fa-pinterest', url: 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(pageUrl) + '&description=' + text },
      { name: 'X', icon: 'fa-twitter', url: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + text }
    ];
    
    // Crear botones
    container.innerHTML = '';
    for (let i = 0; i < shareLinks.length; i++) {
      let s = shareLinks[i];
      let a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';  // Abrir en nueva pestaña
      a.rel = 'noopener';
      a.className = 'share-ico';
      a.title = s.name;
      a.innerHTML = '<i class="fab ' + s.icon + '"></i>';
      container.appendChild(a);
    }
  }
});

// ============================================
// ============================================

// ============================================
// 📝 SISTEMA DE COMENTARIOS CON LOCALSTORAGE
// ============================================
// Esta función permite agregar, mostrar y eliminar comentarios
// Los comentarios se guardan en localStorage por producto

function setupCommentForm(renderComments) {
  
  // 👤 Verificar si el usuario está logueado
  let userData = JSON.parse(localStorage.getItem("userData")); // Corregido: usa "userData"
  let form = document.getElementById("formComentario");
  let textArea = document.getElementById("texto");
  let commentsList = document.getElementById("comments-list");

  // 🚫 Si NO está logueado, mostrar mensaje
  if (!userData) {
    let wrapper = document.querySelector(".add-comment-section");
    if (wrapper) {
      wrapper.innerHTML = '<div class="comment-login-required"><i class="fa fa-info-circle me-2"></i>Debes <a href="login.html">iniciar sesión</a> para poder comentar.</div>';
    }
    return;
  }

  // ✅ Usuario logueado: cargar comentarios guardados
  cargarYMostrarComentarios();

  // ============================================
  // 📤 Evento: Cuando se envía el formulario
  // ============================================
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault(); // Evita que recargue la página
      
      let texto = textArea.value.trim();
      let ratingInput = document.querySelector('input[name="rating"]:checked');

      // Validar que haya texto
      if (!texto) {
        alert("Por favor escribe un comentario.");
        textArea.focus();
        return;
      }
      
      // Validar que haya calificación
      if (!ratingInput) {
        alert("Por favor selecciona una calificación con estrellas.");
        return;
      }

      // ✨ Crear el nuevo comentario
      let nuevoComentario = {
        user: userData.email,                                           // Email del usuario
        description: texto,                                             // Texto del comentario
        dateTime: new Date().toISOString().slice(0, 19).replace('T', ' '), // Fecha actual
        score: parseInt(ratingInput.value)                              // Estrellas (1-5)
      };

      // 💾 Guardar en localStorage
      let prodID = localStorage.getItem("prodID");
      let storageKey = "comments-" + prodID;                            // Clave: "comments-50921"
      let comentariosLocales = JSON.parse(localStorage.getItem(storageKey)) || [];
      comentariosLocales.push(nuevoComentario);                         // Agregar nuevo comentario
      localStorage.setItem(storageKey, JSON.stringify(comentariosLocales));

      // 🧹 Limpiar el formulario
      form.reset();
      let ratings = document.querySelectorAll('input[name="rating"]');
      for (let i = 0; i < ratings.length; i++) {
        ratings[i].checked = false;
      }
      
      // ✨ Animación de envío
      textArea.classList.add('comment-sent-animation');
      setTimeout(function() {
        textArea.classList.remove('comment-sent-animation');
      }, 600);

      // 🔄 Actualizar lista de comentarios
      cargarYMostrarComentarios();

      // 🎯 Resaltar el nuevo comentario con animación
      setTimeout(function() {
        let lastComment = commentsList.lastElementChild;
        if (lastComment) {
          lastComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          lastComment.style.background = '#e8f4fd';  // Color azul claro
          setTimeout(function() {
            lastComment.style.background = '';       // Volver a normal
          }, 2000);
        }
      }, 100);
    };
  }

  // ============================================
  // 📋 FUNCIÓN: Mostrar todos los comentarios (API + localStorage)
  // ============================================
  function cargarYMostrarComentarios() {
    if (!commentsList) return;
    
    // 📥 Obtener comentarios de dos fuentes:
    let apiComments = window.productCommentsFromAPI || [];           // 1. De la API
    let prodID = localStorage.getItem("prodID");
    let storageKey = "comments-" + prodID;
    let localComments = JSON.parse(localStorage.getItem(storageKey)) || []; // 2. Del navegador
    
    // 🧹 Limpiar lista
    commentsList.innerHTML = "";
    
    // Si no hay comentarios, mostrar mensaje
    if (apiComments.length === 0 && localComments.length === 0) {
      let emptyDiv = document.createElement("div");
      emptyDiv.className = "comment-item";
      emptyDiv.textContent = "Aún no hay comentarios.";
      commentsList.appendChild(emptyDiv);
      return;
    }
    
    // 📝 Mostrar comentarios de la API (no se pueden eliminar)
    for (let i = 0; i < apiComments.length; i++) {
      let comentario = crearComentario(apiComments[i], false, -1);
      commentsList.appendChild(comentario);
    }
    
    // 📝 Mostrar comentarios locales (se pueden eliminar)
    for (let i = 0; i < localComments.length; i++) {
      let comentario = crearComentario(localComments[i], true, i);
      commentsList.appendChild(comentario);
    }
  }
  
  // ============================================
  // 🎨 FUNCIÓN: Crear un comentario en HTML
  // ============================================
  function crearComentario(c, puedeEliminar, index) {
    let div = document.createElement("div");
    div.className = "comment-item";
    
    // Fila superior: usuario, estrellas, fecha
    let row = document.createElement("div");
    row.className = "comment-row";
    
    let userStars = document.createElement("div");
    userStars.className = "comment-user-stars";
    
    // 👤 Nombre de usuario
    let user = document.createElement("span");
    user.className = "comment-user";
    user.textContent = c.user || "";
    
    // ⭐ Estrellas
    let starsSpan = document.createElement("span");
    starsSpan.className = "comment-stars";
    let score = Math.max(0, Math.min(5, Number(c.score) || 0));
    let estrellas = "";
    for (let i = 0; i < score; i++) {
      estrellas = estrellas + "★";
    }
    for (let i = score; i < 5; i++) {
      estrellas = estrellas + "☆";
    }
    starsSpan.textContent = estrellas;
    
    userStars.appendChild(user);
    userStars.appendChild(starsSpan);
    
    // 📅 Fecha
    let dateSpan = document.createElement("span");
    dateSpan.className = "comment-date";
    let icon = document.createElement("i");
    icon.className = "fa fa-clock-o";
    dateSpan.appendChild(icon);
    
    let dateText = "";
    if (c.dateTime) {
      let parts = c.dateTime.split(" ")[0].split("-");
      if (parts.length === 3) {
        dateText = parts[2] + "/" + parts[1] + "/" + parts[0]; // Formato: DD/MM/YYYY
      } else {
        dateText = c.dateTime;
      }
    }
    dateSpan.appendChild(document.createTextNode(dateText));
    
    row.appendChild(userStars);
    row.appendChild(dateSpan);
    
    // 🗑️ Botón eliminar (solo si es del usuario actual)
    if (puedeEliminar && userData && c.user === userData.email) {
      let deleteBtn = document.createElement("button");
      deleteBtn.className = "comment-delete-btn";
      deleteBtn.textContent = "×";
      deleteBtn.title = "Eliminar comentario";
      
      deleteBtn.onclick = function() {
        if (confirm("¿Estás seguro de eliminar este comentario?")) {
          eliminarComentario(index);
        }
      };
      
      row.appendChild(deleteBtn);
    }
    
    // 💬 Texto del comentario
    let text = document.createElement("div");
    text.className = "comment-text";
    text.textContent = c.description || "";
    
    div.appendChild(row);
    div.appendChild(text);
    
    return div;
  }
  
  // ============================================
  // 🗑️ FUNCIÓN: Eliminar un comentario
  // ============================================
  function eliminarComentario(index) {
    let prodID = localStorage.getItem("prodID");
    let storageKey = "comments-" + prodID;
    let comentariosLocales = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // ✂️ Quitar el comentario del array
    comentariosLocales.splice(index, 1);
    
    // 💾 Guardar en localStorage
    localStorage.setItem(storageKey, JSON.stringify(comentariosLocales));
    
    // 🔄 Actualizar la vista
    cargarYMostrarComentarios();
  }
}

// ============================================
// ¡DESAFIATE! - Autor: Máximo Gallo
// Función que actualiza el badge del carrito en el navbar
// Muestra la cantidad total de productos
// ============================================
function actualizarBadgeCarrito() {
  // Obtener productos del carrito
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Calcular cantidad total de productos
  let totalProductos = 0;
  cartItems.forEach(function(producto) {
    totalProductos += producto.quantity;
  });
  
  // Obtener el elemento del badge
  let badge = document.getElementById('cart-badge');
  
  if (badge) {
    if (totalProductos > 0) {
      // Si hay productos, mostrar el badge con la cantidad
      badge.textContent = totalProductos;
      badge.style.display = 'inline-block';
    } else {
      // Si no hay productos, ocultar el badge
      badge.style.display = 'none';
    }
  }
}

// ============================================
// FIN DEL CÓDIGO
// ============================================
   