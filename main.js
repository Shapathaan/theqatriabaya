let cart = JSON.parse(localStorage.getItem("cart")) || [];

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderHomeSlider(){
  homeSlider.innerHTML="";
  PRODUCTS.slice(0,6).forEach(p=>{
    homeSlider.innerHTML+=`<div class="slide"><img src="${p.image}"></div>`;
  });
}

function renderProducts(){
  productList.innerHTML="";
  PRODUCTS.forEach(p=>{
    productList.innerHTML+=`
      <div class="product-card">
        <div class="media" style="position:relative">
          <img src="${p.image}">
          ${p.video ? `<video src="${p.video}" muted loop></video>` : ""}
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        </div>
        <div style="padding:14px">
          <h4>${p.name}</h4>
          <p><strong>₹${p.price}</strong></p>

          <select id="size-${p.id}">
            ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
          </select>

          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>`;
  });
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const size = document.getElementById(`size-${id}`).value;

  const found = cart.find(i=>i.id===id && i.size===size);
  if(found){found.qty++}
  else{
    cart.push({id:p.id,name:p.name,price:p.price,size,qty:1,image:p.image});
  }
  saveCart();
}

function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML="";
  cartCount.innerText = cart.length;

  let total = 0;
  cart.forEach((i,idx)=>{
    total += i.price*i.qty;
    cartItems.innerHTML+=`
      <div style="margin-bottom:10px">
        <strong>${i.name}</strong><br>
        Size: ${i.size} | ₹${i.price}<br>
        Qty:
        <button onclick="i.qty>1?(i.qty--):cart.splice(${idx},1);saveCart()">−</button>
        ${i.qty}
        <button onclick="i.qty++;saveCart()">+</button>
      </div>`;
  });

  cartItems.innerHTML+=`<hr><strong>Total: ₹${total}</strong>
  <button onclick="show('checkout');toggleCart()">Checkout</button>`;
}

function toggleCart(){
  cart.classList.toggle("open");
}

function confirmOrder(){
  if(cart.length===0){alert("Cart empty");return}

  const msg = `
New Order – The Qatari Abaya

${cart.map(i=>`${i.name} (${i.size}) x${i.qty}`).join("\n")}

Total: ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}
  `;
  window.open("https://wa.me/918759134555?text="+encodeURIComponent(msg));
  alert("Order sent on WhatsApp");
  cart=[];saveCart();
}

function renderOffers(){
  const today=new Date();
  offerList.innerHTML="";
  OFFERS.filter(o=>new Date(o.expiry)>=today).forEach(o=>{
    offerList.innerHTML+=`
      <div style="background:#fff;border-radius:12px;margin-bottom:15px">
        <img src="${o.banner}" style="width:100%;height:200px;object-fit:cover">
        <div style="padding:12px">
          <h4>${o.title}</h4>
          <p>${o.discount}</p>
        </div>
      </div>`;
  });
}

renderHomeSlider();
renderProducts();
renderOffers();
renderCart();
