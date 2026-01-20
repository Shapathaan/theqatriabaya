const CLOUD_NAME = "PASTE_YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "PASTE_UPLOAD_PRESET";

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function loadProducts(){
  db.collection("products").onSnapshot(snap=>{
    productList.innerHTML="";
    snap.forEach(doc=>{
      const p = doc.data();
      productList.innerHTML += `
        <div class="card">
          <img src="${p.image}">
          ${p.video ? `<video src="${p.video}" controls></video>` : ""}
          <div>
            <b>${p.name}</b><br>
            ₹${p.price}
          </div>
        </div>`;
    });
  });
}

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

async function uploadProduct(){
  const imgFile = pImage.files[0];
  const vidFile = pVideo.files[0];

  if(!imgFile){alert("Image required");return;}

  const imgURL = await uploadToCloudinary(imgFile);
  const vidURL = vidFile ? await uploadToCloudinary(vidFile) : "";

  await db.collection("products").add({
    name: pName.value,
    price: Number(pPrice.value),
    image: imgURL,
    video: vidURL
  });

  alert("Product uploaded");
}

loadProducts();
