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
      const pid = doc.id;

      /* HOME CAROUSEL */
      carouselTrack.innerHTML += `
        <div class="carousel-card" onclick="navigate('products')">
          <video src="${p.video}" muted autoplay loop></video>
          <div>${p.name}</div>
        </div>`;

      /* PRODUCTS PAGE */
      productList.innerHTML += `
        <div class="card"
          onmouseenter="this.querySelector('video').play()"
          onmouseleave="this.querySelector('video').pause()">
          <div class="media">
            <video src="${p.video}" muted loop></video>
          </div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>

            <select id="size-${pid}">
              ${(p.sizes||["S","M","L","XL"]).map(s=>`<option>${s}</option>`).join("")}
            </select>

            <button onclick="addToCart('${pid}','${p.name}',${p.price})">
              Add to Cart
            </button>
          </div>
        </div>`;
    });

    startCarousel();
  });
}

/* AUTO CAROUSEL */
function startCarousel(){
  const track = document.getElementById("carouselTrack");
  const cards = track.children.length;
  setInterval(()=>{
    slideIndex = (slideIndex + 1) % cards;
    track.style.transform = `translateX(-${slideIndex * 302}px)`;
  }, 3000);
}

/* CART */
function addToCart(id,name,price){
  const size = document.getElementById(`size-${id}`).value;
  cart.push({id,name,price,size});
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML="";
  cartCount.innerText = cart.length;
  let total=0;

  cart.forEach((i,idx)=>{
    total+=i.price;
    cartItems.innerHTML += `
      <div>${i.name} (${i.size}) - ₹${i.price}
        <button onclick="removeItem(${idx})">❌</button>
      </div>`;
  });

  cartItems.innerHTML += `<hr><b>Total ₹${total}</b>`;
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

loadProducts();
renderCart();
