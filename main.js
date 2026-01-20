const CLOUD_NAME="dsdvlwxa4";
const UPLOAD_PRESET="qatari-abaya";

let cart=JSON.parse(localStorage.getItem("cart"))||[];
let slideIndex=0;

/* NAV */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
function loginAdmin(){
  auth.signInWithEmailAndPassword(adminEmail.value,adminPass.value)
  .then(()=>{
    adminPanel.style.display="block";
  }).catch(e=>alert(e.message));
}

/* CLOUDINARY */
async function uploadToCloudinary(file){
  const fd=new FormData();
  fd.append("file",file);
  fd.append("upload_preset",UPLOAD_PRESET);
  const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {method:"POST",body:fd});
  return (await r.json()).secure_url;
}

/* UPLOAD PRODUCT */
async function uploadProduct(){
  status.innerText="Uploading...";
  const videoURL=await uploadToCloudinary(pVideo.files[0]);
  await db.collection("products").add({
    name:pName.value,
    price:Number(pPrice.value),
    sizes:pSizes.value.split(","),
    video:videoURL
  });
  status.innerText="Product added";
}

/* LOAD PRODUCTS */
function loadProducts(){
  db.collection("products").onSnapshot(snap=>{
    productList.innerHTML="";
    carouselTrack.innerHTML="";
    snap.forEach(d=>{
      const p=d.data(),id=d.id;

      carouselTrack.innerHTML+=`
        <div class="carousel-card" onclick="navigate('products')">
          <video src="${p.video}" muted autoplay loop></video>
          <div>${p.name}</div>
        </div>`;

      productList.innerHTML+=`
        <div class="card">
          <div class="media"><video src="${p.video}" muted loop></video></div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <select id="size-${id}">
              ${(p.sizes||["M"]).map(s=>`<option>${s}</option>`).join("")}
            </select>
            <button onclick="addToCart('${id}','${p.name}',${p.price})">Add</button>
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
