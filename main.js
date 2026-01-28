/* NAVIGATION */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
function loginAdmin(e){
  e.preventDefault();
  loginStatus.innerText="Logging in...";
  firebase.auth()
    .signInWithEmailAndPassword(adminEmail.value, adminPassword.value)
    .then(()=>loginStatus.innerText="✅ Login successful")
    .catch(err=>loginStatus.innerText="❌ "+err.message);
}

/* CART */
function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

/* FIRESTORE */
const db = firebase.firestore();

/* LOAD PRODUCTS */
db.collection("products")
.onSnapshot(snapshot=>{
  const grid=document.getElementById("productGrid");
  if(!grid) return;
  grid.innerHTML="";

  snapshot.forEach(doc=>{
    const p=doc.data();

    const poster = p.video
      .replace("/upload/","/upload/so_0/")
      .replace(".mp4",".jpg");

    grid.innerHTML += `
      <div class="product-card">
        <img
          src="${poster}"
          class="product-thumb"
          onclick="openVideo('${p.video}')"
        >
        <div class="product-info">
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
        </div>
      </div>
    `;
  });
});

/* VIDEO MODAL */
function openVideo(src){
  const modal=document.getElementById("videoModal");
  const video=document.getElementById("modalVideo");
  modal.style.display="flex";
  video.src = src;
  video.load(); // user taps play (mobile safe)
}

function closeVideo(){
  const modal=document.getElementById("videoModal");
  const video=document.getElementById("modalVideo");
  video.pause();
  video.src="";
  modal.style.display="none";
}
