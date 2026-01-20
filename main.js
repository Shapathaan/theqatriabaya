let cart = JSON.parse(localStorage.getItem("cart")) || [];

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* LOAD PRODUCTS */
function loadProducts(){
  db.collection("products").onSnapshot(snapshot=>{
    productList.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();
      productList.innerHTML+=`
        <div class="card"
          onmouseenter="this.querySelector('video')?.play()"
          onmouseleave="this.querySelector('video')?.pause()">
          <div class="media">
            <video src="${p.video}" muted loop></video>
          </div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <button onclick="addToCart('${doc.id}','${p.name}',${p.price})">Add to Cart</button>
          </div>
        </div>`;
    });
  });
}

/* CART */
function addToCart(id,name,price){
  cart.push({id,name,price});
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML="";
  cartCount.innerText=cart.length;
  let total=0;
  cart.forEach((i,idx)=>{
    total+=i.price;
    cartItems.innerHTML+=`
      <div>${i.name} - ₹${i.price}
        <button onclick="removeItem(${idx})">❌</button>
      </div>`;
  });
  cartItems.innerHTML+=`<hr><strong>Total ₹${total}</strong>`;
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

/* CHECKOUT */
async function confirmOrder(){
  if(cart.length===0){alert("Cart empty");return;}

  const order={
    name:cName.value,
    phone:cPhone.value,
    address:cAddress.value,
    items:cart,
    total:cart.reduce((s,i)=>s+i.price,0),
    created:new Date()
  };

  await db.collection("orders").add(order);

  const msg=`New Order – The Qatari Abaya

Name: ${order.name}
Phone: ${order.phone}

Items:
${cart.map(i=>`${i.name} - ₹${i.price}`).join("\n")}

Total: ₹${order.total}`;

  window.open("https://wa.me/917201816783?text="+encodeURIComponent(msg));

  alert("Order placed. We will confirm after payment.");

  cart=[];
  localStorage.removeItem("cart");
  renderCart();
  show("home");
}

/* INIT */
loadProducts();
renderCart();
