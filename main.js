/* NAV */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
function loginAdmin(){
  firebase.auth()
    .signInWithEmailAndPassword(adminEmail.value, adminPassword.value)
    .then(()=>{
      adminPanel.style.display="block";
      status.innerText="Logged in";
    })
    .catch(e=>alert(e.message));
}

/* CLOUDINARY */
const CLOUD_NAME="dsdvlwxa4";
const UPLOAD_PRESET="qatari-abaya";

async function uploadToCloudinary(file){
  const fd=new FormData();
  fd.append("file",file);
  fd.append("upload_preset",UPLOAD_PRESET);
  const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {method:"POST",body:fd});
  return (await r.json()).secure_url;
}

/* ADD PRODUCT */
async function addProduct(){
  status.innerText="Uploading...";
  const video=await uploadToCloudinary(pVideo.files[0]);
  await firebase.firestore().collection("products").add({
    name:pName.value,
    price:Number(pPrice.value),
    sizes:pSizes.value.split(","),
    video
  });
  status.innerText="Product added";
}

/* CART */
let cart=JSON.parse(localStorage.getItem("cart"))||[];

function addToCart(name,price){
  cart.push({name,price});
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML="";
  cartCount.innerText=cart.length;
  cart.forEach((i,idx)=>{
    cartItems.innerHTML+=`${i.name} ₹${i.price}
    <button onclick="removeItem(${idx})">❌</button><br>`;
  });
}
function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}
function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

renderCart();
