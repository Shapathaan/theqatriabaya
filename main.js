/* NAVIGATION */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
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

/* CLOUDINARY CONFIG */
const CLOUD_NAME = "dsdvlwxa4";
const UPLOAD_PRESET = "qatari-abaya";

/* CLOUDINARY UPLOAD */
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

/* ADD PRODUCT */
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
    status.innerText = "❌ " + e.message;
  }
}
