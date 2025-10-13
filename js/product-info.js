// Cargar información del producto
document.addEventListener("DOMContentLoaded", function() {
  let skeleton = document.getElementById('product-skeleton');
  let layout = document.getElementById('product-layout');
  if (typeof showSpinner === 'function') showSpinner();

  let prodID = localStorage.getItem("prodID");
  if (!prodID) {
    window.location = "products.html";
    return;
  }

  let infoUrl = PRODUCT_INFO_URL + prodID + EXT_TYPE;
  let commentsUrl = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;

  // Obtener datos del producto
  getJSONData(infoUrl).then(function(infoResp) {
    if (infoResp.status !== "ok") {
      simpleError();
      if (skeleton) skeleton.remove();
      if (typeof hideSpinner === 'function') hideSpinner();
      return;
    }
    
    let prod = infoResp.data;

    // Mostrar información básica
    document.getElementById("product-name").textContent = prod.name || "Producto";
    document.getElementById("product-category").textContent = prod.category || "";
    document.getElementById("product-description").textContent = prod.description || "";
    document.getElementById("product-price").textContent = (prod.currency || "") + " " + (prod.cost || "");
    
    let cuotaTexto = "Hasta 12 x ";
    if (prod.cost) {
      cuotaTexto = cuotaTexto + Math.round(prod.cost/12);
    } else {
      cuotaTexto = cuotaTexto + "-";
    }
    document.getElementById("installments-text").textContent = cuotaTexto;

    renderImages(prod.images || []);
    renderVariants(prod.images || []); 
    renderRelated(prod.relatedProducts || []);
    setupShare(prod);

    // Control de cantidad
    let qty = 1;
    let MIN_Q = 1;
    let MAX_Q = 99;
    
    function updateQty() {
      document.getElementById("qty-value").textContent = qty; 
      document.getElementById("qty-minus").disabled = qty <= MIN_Q; 
      document.getElementById("qty-plus").disabled = qty >= MAX_Q; 
    }
    
    document.getElementById("qty-minus").onclick = function() {
      if (qty > MIN_Q) {
        qty--;
        updateQty();
      }
    };
    
    document.getElementById("qty-plus").onclick = function() {
      if (qty < MAX_Q) {
        qty++;
        updateQty();
      }
    };
    
    updateQty();

    document.getElementById("add-to-cart").onclick = function() {
      alert("Agregado " + qty + " x " + prod.name);
    };

    // Cargar comentarios de la API
    getJSONData(commentsUrl).then(function(commentsResp) {
      let apiComments = [];
      if (commentsResp.status === "ok") {
        apiComments = commentsResp.data || [];
      }
      window.productCommentsFromAPI = apiComments;
      renderComments(apiComments);

      // Finalizar carga
      if (skeleton) skeleton.style.display = 'none';
      if (layout) layout.hidden = false;
      if (typeof hideSpinner === 'function') hideSpinner();

      // Inicializar formulario de comentarios
      setupCommentForm(renderComments);
    });
  });

  // Mostrar galería de imágenes
  function renderImages(images) {
    let thumbs = document.getElementById("thumbs");
    if (!thumbs) return;
    thumbs.innerHTML = "";
    
    let mainImage = document.getElementById("main-image");
    if (!images.length) {
      if (mainImage) mainImage.src = placeholder();
      return;
    }
    for (let i = 0; i < images.length; i++) {
      let src = images[i];
      let btn = document.createElement("button");
      btn.innerHTML = '<img src="' + src + '" alt="thumb ' + (i+1) + '">';
      if (i === 0) {
        btn.classList.add("active");
        if (mainImage) mainImage.src = src;
      }
      btn.onclick = (function(srcCopy) {
        return function() {
          if (mainImage) mainImage.src = srcCopy;
          let allButtons = thumbs.querySelectorAll("button");
          for (let j = 0; j < allButtons.length; j++) {
            allButtons[j].classList.remove("active");
          }
          this.classList.add("active");
        };
      })(src);
      thumbs.appendChild(btn);
    }
  }

  // Mostrar variantes del producto
  function renderVariants(images) {
    let wrap = document.getElementById("variants");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (!images.length) return;
    let maxVariants = Math.min(2, images.length);
    for (let i = 0; i < maxVariants; i++) {
      let src = images[i];
      let div = document.createElement("div");
      div.className = "variant-item";
      if (i === 0) div.className = div.className + " active";
      div.innerHTML = '<img src="' + src + '" alt="var ' + (i+1) + '">';
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

  // Mostrar comentarios
  function renderComments(comments) {
    let list = document.getElementById("comments-list");
    if (!list) return;
    list.innerHTML = "";
    if (!comments.length) { 
      list.innerHTML = '<div class="comment-item">Aún no hay comentarios.</div>'; 
      return; 
    }
    for (let i = 0; i < comments.length; i++) {
      let c = comments[i];
      let div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = '<div class="comment-row"><div class="comment-user-stars"><span class="comment-user">' + 
        esc(c.user) + '</span><span class="comment-stars">' + 
        stars(c.score) + '</span></div><span class="comment-date"><i class="fa fa-clock-o"></i>' + 
        formatDate(c.dateTime) + '</span></div><div class="comment-text">' + 
        esc(c.description) + '</div>';
      list.appendChild(div);
    }
  }

  // Mostrar productos relacionados
  function renderRelated(related) {
    let grid = document.getElementById("related-products"); 
    if (!grid) return;
    grid.innerHTML = "";
    if (!related.length) { 
      grid.innerHTML = '<div class="text-muted">No hay productos relacionados.</div>'; 
      return; 
    }
    for (let i = 0; i < related.length; i++) {
      let r = related[i];
      let card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = '<img src="' + r.image + '" alt="' + esc(r.name) + '"><div class="rel-name">' + esc(r.name) + '</div>';
      card.onclick = (function(idCopy) {
        return function() {
          try {
            localStorage.setItem("prodID", String(idCopy));
          } catch (e) {}
          window.location = "product-info.html";
        };
      })(r.id);
      grid.appendChild(card);
    }
  }

  // Funciones auxiliares
  function stars(n) {
    let s = Math.max(0, Math.min(5, Number(n) || 0));
    let estrellas = "";
    for (let i = 0; i < s; i++) {
      estrellas = estrellas + "★";
    }
    for (let i = s; i < 5; i++) {
      estrellas = estrellas + "☆";
    }
    return estrellas;
  }

  function formatDate(dt) {
    if (!dt) return "";
    let parts = dt.split(" ")[0].split("-");
    if (parts.length === 3) {
      return parts[2] + "/" + parts[1] + "/" + parts[0];
    }
    return dt;
  }

  function esc(str) {
    let texto = String(str || "");
    texto = texto.replace(/&/g, "&amp;");
    texto = texto.replace(/</g, "&lt;");
    texto = texto.replace(/>/g, "&gt;");
    texto = texto.replace(/"/g, "&quot;");
    texto = texto.replace(/'/g, "&#39;");
    return texto;
  }

  function placeholder() {
    return "data:image/svg+xml;charset=utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-size="32" fill="#999" text-anchor="middle" dy=".3em">Sin imagen</text></svg>');
  }

  function simpleError() {
    document.querySelector("main").innerHTML = '<div class="alert alert-danger">No se pudo cargar el producto.</div>';
  }

  // Configurar botones de compartir
  function setupShare(prod) {
    let container = document.getElementById('share-icons-inline');
    if (!container) return;
    let pageUrl = location.href.split('#')[0];
    let text = encodeURIComponent(prod.name || 'Producto');
    
    let shareLinks = [
      { name: 'WhatsApp', icon: 'fa-whatsapp', url: 'https://api.whatsapp.com/send?text=' + text + '%20' + encodeURIComponent(pageUrl) },
      { name: 'Facebook', icon: 'fa-facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) },
      { name: 'Pinterest', icon: 'fa-pinterest', url: 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(pageUrl) + '&description=' + text },
      { name: 'X', icon: 'fa-twitter', url: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + text }
    ];
    
    container.innerHTML = '';
    for (let i = 0; i < shareLinks.length; i++) {
      let s = shareLinks[i];
      let a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'share-ico';
      a.title = s.name;
      a.innerHTML = '<i class="fab ' + s.icon + '"></i>';
      container.appendChild(a);
    }
  }
});

// Sistema de comentarios con localStorage
function setupCommentForm(renderComments) {
  let userData = JSON.parse(localStorage.getItem("Datos de usuario"));
  let form = document.getElementById("formComentario");
  let textArea = document.getElementById("texto");
  let commentsList = document.getElementById("comments-list");

  // Si el usuario no está logueado, mostrar mensaje
  if (!userData) {
    let wrapper = document.querySelector(".add-comment-section");
    if (wrapper) {
      wrapper.innerHTML = '<div class="comment-login-required"><i class="fa fa-info-circle me-2"></i>Debes <a href="login.html">iniciar sesión</a> para poder comentar.</div>';
    }
    return;
  }

  cargarYMostrarComentarios();

  // Cuando se envía el formulario
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      let texto = textArea.value.trim();
      let ratingInput = document.querySelector('input[name="rating"]:checked');

      if (!texto) {
        alert("Por favor escribe un comentario.");
        textArea.focus();
        return;
      }
      if (!ratingInput) {
        alert("Por favor selecciona una calificación con estrellas.");
        return;
      }

      // Crear el nuevo comentario
      let nuevoComentario = {
        user: userData.email,
        description: texto,
        dateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        score: parseInt(ratingInput.value)
      };

      let prodID = localStorage.getItem("prodID");
      let storageKey = "comments-" + prodID;
      let comentariosLocales = JSON.parse(localStorage.getItem(storageKey)) || [];
      comentariosLocales.push(nuevoComentario);
      localStorage.setItem(storageKey, JSON.stringify(comentariosLocales));

      // Limpiar el formulario
      form.reset();
      let ratings = document.querySelectorAll('input[name="rating"]');
      for (let i = 0; i < ratings.length; i++) {
        ratings[i].checked = false;
      }
      textArea.classList.add('comment-sent-animation');
      setTimeout(function() {
        textArea.classList.remove('comment-sent-animation');
      }, 600);

      cargarYMostrarComentarios();

      // Resaltar el nuevo comentario
      setTimeout(function() {
        let lastComment = commentsList.lastElementChild;
        if (lastComment) {
          lastComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          lastComment.style.background = '#e8f4fd';
          setTimeout(function() {
            lastComment.style.background = '';
          }, 2000);
        }
      }, 100);
    };
  }

  // Mostrar todos los comentarios (API + localStorage)
  function cargarYMostrarComentarios() {
    if (!commentsList) return;
    
    // Obtener comentarios
    let apiComments = window.productCommentsFromAPI || [];
    let prodID = localStorage.getItem("prodID");
    let storageKey = "comments-" + prodID;
    let localComments = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Limpiar lista
    commentsList.innerHTML = "";
    
    // Si no hay comentarios
    if (apiComments.length === 0 && localComments.length === 0) {
      let emptyDiv = document.createElement("div");
      emptyDiv.className = "comment-item";
      emptyDiv.textContent = "Aún no hay comentarios.";
      commentsList.appendChild(emptyDiv);
      return;
    }
    
    // Mostrar comentarios de la API
    for (let i = 0; i < apiComments.length; i++) {
      let comentario = crearComentario(apiComments[i], false, -1);
      commentsList.appendChild(comentario);
    }
    
    // Mostrar comentarios guardados localmente
    for (let i = 0; i < localComments.length; i++) {
      let comentario = crearComentario(localComments[i], true, i);
      commentsList.appendChild(comentario);
    }
  }
  
  // Crear un comentario en HTML
  function crearComentario(c, puedeEliminar, index) {
    let div = document.createElement("div");
    div.className = "comment-item";
    
    let row = document.createElement("div");
    row.className = "comment-row";
    
    let userStars = document.createElement("div");
    userStars.className = "comment-user-stars";
    
    let user = document.createElement("span");
    user.className = "comment-user";
    user.textContent = c.user || "";
    
    let starsSpan = document.createElement("span");
    starsSpan.className = "comment-stars";
    let score = Math.max(0, Math.min(5, Number(c.score) || 0));
    // Crear estrellas
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
    
    let dateSpan = document.createElement("span");
    dateSpan.className = "comment-date";
    let icon = document.createElement("i");
    icon.className = "fa fa-clock-o";
    dateSpan.appendChild(icon);
    
    let dateText = "";
    if (c.dateTime) {
      let parts = c.dateTime.split(" ")[0].split("-");
      if (parts.length === 3) {
        dateText = parts[2] + "/" + parts[1] + "/" + parts[0];
      } else {
        dateText = c.dateTime;
      }
    }
    dateSpan.appendChild(document.createTextNode(dateText));
    
    row.appendChild(userStars);
    row.appendChild(dateSpan);
    
    // Botón eliminar (solo si es del usuario actual)
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
    
    let text = document.createElement("div");
    text.className = "comment-text";
    text.textContent = c.description || "";
    
    div.appendChild(row);
    div.appendChild(text);
    
    return div;
  }
  
  // Eliminar un comentario
  function eliminarComentario(index) {
    let prodID = localStorage.getItem("prodID");
    let storageKey = "comments-" + prodID;
    let comentariosLocales = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Quitar el comentario
    comentariosLocales.splice(index, 1);
    
    // Guardar
    localStorage.setItem(storageKey, JSON.stringify(comentariosLocales));
    
    // Actualizar
    cargarYMostrarComentarios();
  }
}
   