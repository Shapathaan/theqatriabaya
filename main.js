/***********************
 CONFIG
************************/
const CLOUD_NAME = "dsdvlwxa4";
const UPLOAD_PRESET = "qatari-abaya";

/***********************
 NAVIGATION (already used)
************************/
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/***********************
 ADMIN LOGIN
************************/
function loginAdmin(){
  const email = adminEmail.value;
  const pass  = adminPassword.value;

  firebase.auth()
    .signInWithEmailAndPassword(email, pass)
    .then(()=>{
      adminPanel.style.display = "block";
      status.innerText = "Logged in successfully";
    })
    .catch(err=>{
      alert(err.message);
    });
}

/***********************
 CLOUDINARY UPLOAD
************************/
async function uploadToCloudinary(file){
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method:"POST", body:fd }
  );

  const data = await res.json();
  return data.secure_url;
}

/***********************
 ADD PRODUCT
************************/
async function addProduct(){
  status.innerText = "Uploading...";

  try{
    const videoURL = await uploadToCloudinary(pVideo.files[0]);
    let imageURL = "";

    if(pImage.files[0]){
      imageURL = await uploadToCloudinary(pImage.files[0]);
    }

    await firebase.firestore().collection("products").add({
      name: pName.value,
      price: Number(pPrice.value),
      sizes: pSizes.value.split(","),
      video: videoURL,
      image: imageURL,
      createdAt: new Date()
    });

    status.innerText = "✅ Product added successfully";
    pName.value = pPrice.value = pSizes.value = "";
    pVideo.value = pImage.value = "";

  }catch(e){
    status.innerText = "❌ Error: " + e.message;
  }
}

/***********************
 LOAD PRODUCTS (UI SAFE)
************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let slideIndex = 0;

function loadProducts(){
  firebase.firestore().collection("products")
  .orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    productList.innerHTML = "";
    carouselTrack.innerHTML = "";

    snapshot.forEach(doc=>{
      const p = doc.data();
      const id = doc.id;

      /* HOME CAROUSEL */
      carouselTrack.innerHTML += `
        <div class="carousel-card" onclick="navigate('products')">
          <video src="${p.video}" muted autoplay loop></video>
          <div>${p.name}</div>
        </div>
      `;

      /* PRODUCTS PAGE */
      productList.innerHTML += `
        <div class="card">
          <div class="media">
            <video src="${p.video}" muted loop></video>
          </div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>

            <select id="size-${id}">
              ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
            </select>

            <button onclick="addToCart('${id}','${p.name}',${p.price})">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    });

    startCarousel();
  });
}

/***********************
 CAROUSEL AUTO
************************/
function startCarousel(){
  if(carouselTrack.children.length === 0) return;

  setInterval(()=>{
    slideIndex = (slideIndex + 1) % carouselTrack.children.length;
    carouselTrack.style.transform =
      `translateX(-${slideIndex * 280}px)`;
  }, 3000);
}

/***********************
 CART LOGIC
************************/
function addToCart(id,name,price){
  const size = document.getElementById(`size-${id}`).value;
  cart.push({name,price,size});
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML = "";
  cartCount.innerText = cart.length;

  cart.forEach((i,idx)=>{
    cartItems.innerHTML += `
      ${i.name} (${i.size}) ₹${i.price}
      <button onclick="removeItem(${idx})">❌</button><br>
    `;
  });
}

function removeItem(i){
  cart.splice(i,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

/***********************
 INIT
************************/
loadProducts();
renderCart();
