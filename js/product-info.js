document.addEventListener("DOMContentLoaded", async () => {
  // Mostrar spinner + skeleton mientras cargamos
  const skeleton = document.getElementById('product-skeleton');
  const layout = document.getElementById('product-layout');
  if (typeof showSpinner === 'function') showSpinner();

  const prodID = localStorage.getItem("prodID");
  if (!prodID) { window.location = "products.html"; return; }

  const $ = (id) => document.getElementById(id);
  const infoUrl = `${PRODUCT_INFO_URL}${prodID}${EXT_TYPE}`;
  const commentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${prodID}${EXT_TYPE}`;

  let prod;
  try {
    const infoResp = await getJSONData(infoUrl);
    if (infoResp.status !== "ok") { throw new Error('No se pudo obtener el producto'); }
    prod = infoResp.data;
  } catch (e) {
    simpleError();
    if (skeleton) skeleton.remove();
    if (typeof hideSpinner === 'function') hideSpinner();
    return;
  }

  // Básicos
  $("product-name").textContent = prod.name || "Producto";
  $("product-category").textContent = prod.category || "";
  $("product-description").textContent = prod.description || "";
  $("product-price").textContent = `${prod.currency || ""} ${prod.cost || ""}`;
  $("installments-text").textContent = `Hasta 12 x ${(prod.cost ? Math.round(prod.cost/12) : "-")}`;

  renderImages(prod.images || []);
  renderVariants(prod.images || []); 
  renderRelated(prod.relatedProducts || []);
  setupShare(prod);

  // Cantidad
  let qty = 1; const MIN_Q=1, MAX_Q=99;
  const updateQty = () => { $("qty-value").textContent = qty; $("qty-minus").disabled = qty<=MIN_Q; $("qty-plus").disabled = qty>=MAX_Q; };
  $("qty-minus").onclick = () => { if (qty>MIN_Q) { qty--; updateQty(); } };
  $("qty-plus").onclick = () => { if (qty<MAX_Q) { qty++; updateQty(); } };
  updateQty();

  $("add-to-cart").addEventListener("click", () => {
    alert(`Agregado ${qty} x ${prod.name}`);
  });

  // Comentarios
  const commentsResp = await getJSONData(commentsUrl);
  if (commentsResp.status === "ok") renderComments(commentsResp.data || []); else renderComments([]);

  // Ocultamos skeleton y mostramos layout real
  if (skeleton) skeleton.style.display = 'none';
  if (layout) layout.hidden = false;
  if (typeof hideSpinner === 'function') hideSpinner();

  function renderImages(images) {
    const thumbs = $("thumbs");
    thumbs.innerHTML="";
    if(!images.length){
      $("main-image").src = placeholder();
      return;
    }
    images.forEach((src,i)=>{
      const btn = document.createElement("button");
      btn.innerHTML = `<img src="${src}" alt="thumb ${i+1}">`;
      if(i===0){ btn.classList.add("active"); $("main-image").src = src; }
      btn.addEventListener("click",()=>{
        $("main-image").src = src;
        thumbs.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
      });
      thumbs.appendChild(btn);
    });
  }

  function renderVariants(images){
    const wrap = $("variants");
    wrap.innerHTML="";
    if(!images.length) return;
    images.slice(0,2).forEach((src,i)=>{
      const div = document.createElement("div");
      div.className = "variant-item" + (i===0?" active":"");
      div.innerHTML = `<img src="${src}" alt="var ${i+1}">`;
      div.onclick = ()=>{
        wrap.querySelectorAll('.variant-item').forEach(v=>v.classList.remove('active'));
        div.classList.add('active');
        $("main-image").src = src;
      };
      wrap.appendChild(div);
    });
  }

  function renderComments(comments){
    const list = $("comments-list");
    list.innerHTML="";
    if(!comments.length){ list.innerHTML = `<div class="comment-item">Aún no hay comentarios.</div>`; return; }
    comments.forEach(c=>{
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `
        <div class="comment-row">
          <div class="comment-user-stars">
            <span class="comment-user">${esc(c.user)}</span>
            <span class="comment-stars">${stars(c.score)}</span>
          </div>
          <span class="comment-date"><i class="fa fa-clock-o"></i>${formatDate(c.dateTime)}</span>
        </div>
        <div class="comment-text">${esc(c.description)}</div>`;
      list.appendChild(div);
    });
  }

  function renderRelated(related){
    const grid = $("related-products"); grid.innerHTML="";
    if(!related.length){ grid.innerHTML = `<div class="text-muted">No hay productos relacionados.</div>`; return; }
    related.forEach(r=>{
      const card = document.createElement("div");
      card.className = "related-card";
      card.innerHTML = `<img src="${r.image}" alt="${esc(r.name)}"><div class="rel-name">${esc(r.name)}</div>`;
      card.onclick = ()=>{ try{ localStorage.setItem("prodID", String(r.id)); }catch{} window.location = "product-info.html"; };
      grid.appendChild(card);
    });
  }

  function stars(n){ const s = Math.max(0,Math.min(5,Number(n)||0)); return "★".repeat(s)+"☆".repeat(5-s); }
  function formatDate(dt){
    if(!dt) return "";
    // dt viene con formato yyyy-mm-dd hh:mm:ss; tomamos solo fecha
    const parts = dt.split(" ")[0].split("-");
    if(parts.length===3){ return `${parts[2]}/${parts[1]}/${parts[0]}`; }
    return dt;
  }
  function esc(str){ return String(str??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
  function placeholder(){ return "data:image/svg+xml;charset=utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" font-size="32" fill="#999" text-anchor="middle" dy=".3em">Sin imagen</text></svg>'); }
  function simpleError(){ document.querySelector("main").innerHTML = '<div class="alert alert-danger">No se pudo cargar el producto.</div>'; }
  function setupShare(prod){
    const container = document.getElementById('share-icons-inline');
    if(!container) return;
    const pageUrl = location.href.split('#')[0];
    const text = encodeURIComponent(prod.name || 'Producto');
    const shareLinks = [
      { name:'WhatsApp', icon:'fa-whatsapp', url:`https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(pageUrl)}` },
      { name:'Facebook', icon:'fa-facebook', url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
      { name:'Pinterest', icon:'fa-pinterest', url:`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${text}` },
      { name:'X', icon:'fa-twitter', url:`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${text}` }
    ];
    container.innerHTML = '';
    shareLinks.forEach(s => {
      const a = document.createElement('a');
      a.href = s.url; a.target='_blank'; a.rel='noopener'; a.className='share-ico'; a.title = s.name; a.setAttribute('aria-label', s.name);
      // Usar la clase de marcas (fab) para Font Awesome 5 brands
      a.innerHTML = `<i class="fab ${s.icon}"></i>`;
      container.appendChild(a);
    });
  }
});

// ENTREGA 4 - ericahernandez

// Traemos el usuario guardado en el login
    const userData = JSON.parse(localStorage.getItem("Datos de usuario"));

    if (!userData) {
      document.getElementById("formComentario").innerHTML = "<p><em>Debes iniciar sesión para comentar.</em></p>";
    }

    document.addEventListener("DOMContentLoaded", mostrarComentarios);

    const form = document.getElementById("formComentario");

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const texto = document.getElementById("texto").value.trim();
      const rating = document.querySelector('input[name="rating"]:checked');

      if (userData && texto && rating) {
        const nuevoComentario = {
  usuario: userData.email, // ahora muestra el email del login
  texto: texto,
  fecha: new Date().toLocaleString(),
  estrellas: rating.value
};

        let comentarios = JSON.parse(localStorage.getItem("comments-list")) || [];
        comentarios.push(nuevoComentario);

        localStorage.setItem("comments-list", JSON.stringify(comentarios));

        form.reset();
        // Desmarcar estrellas
        document.querySelectorAll('input[name="rating"]').forEach(el => el.checked = false);

        mostrarComentarios();
      } else {
        alert("Debes escribir un comentario y elegir una calificación.");
      }
    });

    function mostrarComentarios() {
      const contenedor = document.getElementById("comments-list");
      contenedor.innerHTML = "";

      let comentarios = JSON.parse(localStorage.getItem("comments-list")) || [];

      comentarios.forEach(com => {
        const div = document.createElement("div");
        div.classList.add("comentario");

        // Generamos las estrellas para mostrar
        let estrellasHTML = "";
        for (let i = 1; i <= 5; i++) {
          estrellasHTML += i <= com.estrellas ? "★" : "☆";
        }

        div.innerHTML = `
          <strong>${com.usuario}</strong>
          <em>${com.fecha}</em>
          <p>${com.texto}</p>
          <p>Calificación: ${estrellasHTML}</p>
        `;
        contenedor.appendChild(div);
      });
    }
   