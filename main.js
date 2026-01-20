/* ===============================
   CLOUDINARY CONFIG (FINAL)
=============================== */
const CLOUD_NAME = "dsdvlwxa4";
const UPLOAD_PRESET = "qatari-abaya";

/* ===============================
   NAVIGATION
=============================== */
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===============================
   LOAD PRODUCTS
=============================== */
function loadProducts(){
  db.collection("products").onSnapshot(snapshot=>{
    productList.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();
      productList.innerHTML += `
        <div class="card">
          <img src="${p.image}">
          ${p.video ? `<video src="${p.video}" controls></video>` : ""}
          <div>
            <strong>${p.name}</strong><br>
            ₹${p.price}<br>
            <small>${p.badge || ""}</small>
          </div>
        </div>
      `;
    });
  });
}

/* ===============================
   CLOUDINARY UPLOAD
=============================== */
async function uploadToCloudinary(file){
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method:"POST", body:form }
  );

  const data = await res.json();
  return data.secure_url;
}

/* ===============================
   ADMIN UPLOAD PRODUCT
=============================== */
async function uploadProduct(){
  status.innerText = "Uploading...";

  const imgFile = pImage.files[0];
  const vidFile = pVideo.files[0];

  if(!imgFile){
    alert("Image required");
    status.innerText = "";
    return;
  }

  const imgURL = await uploadToCloudinary(imgFile);
  const vidURL = vidFile ? await uploadToCloudinary(vidFile) : "";

  await db.collection("products").add({
    name: pName.value,
    price: Number(pPrice.value),
    badge: pBadge.value,
    sizes: pSizes.value.split(","),
    image: imgURL,
    video: vidURL,
    createdAt: new Date()
  });

  status.innerText = "Product uploaded successfully";

  pName.value="";
  pPrice.value="";
  pBadge.value="";
  pSizes.value="";
  pImage.value="";
  pVideo.value="";
}

/* ===============================
   INIT
=============================== */
loadProducts();
