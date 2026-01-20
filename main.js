/* =========================
   STATE
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   NAV
========================= */
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* =========================
   HOME SLIDER
========================= */
function renderHomeSlider(){
  homeSlider.innerHTML="";
  PRODUCTS.slice(0,6).forEach(p=>{
    homeSlider.innerHTML+=`
      <div class="slide">
        <img src="${p.image}">
      </div>`;
  });
}

/* =========================
   PRODUCTS
========================= */
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

          <select id="size-${p.id}">
            ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
          </select>

          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>`;
  });
}

/* =========================
   CART LOGIC
========================= */
function addToCart(id){
  const product = PRODUCTS.find(p=>p.id===id);
  const size = document.getElementById(`size-${id}`).value;

  const existing = cart.find(
    item => item.id===id && item.size===size
  );

  if(existing){
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      qty: 1,
      image: product.image
    });
  }

  saveCart();
  renderCart();
}

function increaseQty(index){
  cart[index].qty++;
  saveCart();
  renderCart();
}

function decreaseQty(index){
  if(cart[index].qty > 1){
    cart[index].qty--;
  } else {
    cart.splice(index,1);
  }
  saveCart();
  renderCart();
}

function removeItem(index){
  cart.splice(index,1);
  saveCart();
  renderCart();
}

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function cartTotal(){
  return cart.reduce((sum,i)=>sum + i.price*i.qty, 0);
}

/* =========================
   CART UI
========================= */
function renderCart(){
  const cartDrawer = document.getElementById("cart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML="";
  cartCount.innerText = cart.length;

  cart.forEach((item,index)=>{
    cartItems.innerHTML += `
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <strong>${item.name}</strong>
          <div>Size: ${item.size}</div>
          <div>₹${item.price}</div>

          <div style="display:flex;gap:6px;margin-top:6px">
            <button onclick="decreaseQty(${index})">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${index})">+</button>
            <button onclick="removeItem(${index})">❌</button>
          </div>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML += `
    <hr>
    <strong>Total: ₹${cartTotal()}</strong>
    <button style="margin-top:10px" onclick="goToCheckout()">Checkout</button>
  `;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

function goToCheckout(){
  show("checkout");
  toggleCart();
  renderCheckout();
}

/* =========================
   CHECKOUT
========================= */
function renderCheckout(){
  const checkoutBox = document.getElementById("checkoutItems");
  checkoutBox.innerHTML="";

  cart.forEach(i=>{
    checkoutBox.innerHTML += `
      <div>${i.name} (${i.size}) × ${i.qty} — ₹${i.price*i.qty}</div>
    `;
  });

  checkoutBox.innerHTML += `<strong>Total: ₹${cartTotal()}</strong>`;
}

/* =========================
   OFFERS
========================= */
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
      </div>
    `;
  });
}

/* =========================
   INIT
========================= */
renderHomeSlider();
renderProducts();
renderOffers();
renderCart();
