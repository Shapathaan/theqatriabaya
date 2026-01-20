let cart = JSON.parse(localStorage.getItem("cart")) || [];
let slideIndex = 0;

function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* LOAD PRODUCTS */
function loadProducts(){
  db.collection("products").onSnapshot(snapshot=>{
    productList.innerHTML="";
    carouselTrack.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();
      const id = doc.id;

      carouselTrack.innerHTML += `
        <div class="carousel-card" onclick="navigate('products')">
          <video src="${p.video}" muted autoplay loop></video>
          <div>${p.name}</div>
        </div>`;

      productList.innerHTML += `
        <div class="card">
          <div class="media"><video src="${p.video}" muted loop></video></div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <select id="size-${id}">
              ${(p.sizes||["M"]).map(s=>`<option>${s}</option>`).join("")}
            </select>
            <button onclick="addToCart('${id}','${p.name}',${p.price})">Add to Cart</button>
          </div>
        </div>`;
    });
    startCarousel();
  });
}

/* CAROUSEL */
function startCarousel(){
  setInterval(()=>{
    slideIndex=(slideIndex+1)%carouselTrack.children.length;
    carouselTrack.style.transform=`translateX(-${slideIndex*280}px)`;
  },3000);
}

/* CART */
function addToCart(id,name,price){
  const size=document.getElementById(`size-${id}`).value;
  cart.push({name,price,size});
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}
function renderCart(){
  cartItems.innerHTML="";
  cartCount.innerText=cart.length;
  cart.forEach((i,idx)=>{
    cartItems.innerHTML+=`${i.name} (${i.size}) ₹${i.price}
      <button onclick="removeItem(${idx})">❌</button><br>`;
  });
}
function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}
function toggleCart(){
  cart.classList.toggle("open");
}

loadProducts();
renderCart();
