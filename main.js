function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderHomeSlider(){
  homeSlider.innerHTML="";
  PRODUCTS.slice(0,6).forEach(p=>{
    homeSlider.innerHTML+=`
      <div class="slide">
        <img src="${p.image}">
      </div>`;
  });
}

function renderProducts(){
  productList.innerHTML="";
  PRODUCTS.forEach(p=>{
    productList.innerHTML+=`
      <div class="product-card">
        <div class="media">
          <img src="${p.image}">
          ${p.video ? `<video src="${p.video}" muted loop></video>` : ""}
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        </div>
        <div style="padding:12px">
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
          <select>
            ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
          </select>
          <button>Add to Cart</button>
        </div>
      </div>`;
  });
}

function renderOffers(){
  const today = new Date();
  offerList.innerHTML="";
  OFFERS.filter(o=>new Date(o.expiry)>=today).forEach(o=>{
    offerList.innerHTML+=`
      <div class="offer-card">
        <img src="${o.banner}">
        <div style="padding:12px">
          <h4>${o.title}</h4>
          <p>${o.discount}</p>
          <small>Valid till ${o.expiry}</small>
        </div>
      </div>`;
  });
}

renderHomeSlider();
renderProducts();
renderOffers();
