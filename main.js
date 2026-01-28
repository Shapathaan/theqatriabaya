/* NAV */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
function loginAdmin(e){
  e.preventDefault();
  loginStatus.innerText = "Logging in...";
  firebase.auth()
    .signInWithEmailAndPassword(adminEmail.value, adminPassword.value)
    .then(()=> loginStatus.innerText="✅ Login successful")
    .catch(err=> loginStatus.innerText="❌ "+err.message);
}

/* CART */
function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

/* FIRESTORE */
const db = firebase.firestore();

/* LOAD PRODUCTS */
db.collection("products")
  .orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const grid = document.getElementById("productGrid");
    if(!grid) return;
    grid.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();
      grid.innerHTML += `
        <div class="product-card">
          <video class="product-video"
            src="${p.video}"
            muted
            playsinline
            preload="metadata"></video>
          <div class="product-info">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
          </div>
        </div>`;
    });
    setupVideoHover();
  });

/* VIDEO HOVER / TAP */
function setupVideoHover(){
  document.querySelectorAll(".product-video").forEach(video=>{
    video.addEventListener("mouseenter",()=>{
      video.play().catch(()=>{});
    });
    video.addEventListener("mouseleave",()=>{
      video.pause();
      video.currentTime=0;
    });
    video.addEventListener("click",()=>{
      if(video.paused){
        video.play().catch(()=>{});
      }else{
        video.pause();
        video.currentTime=0;
      }
    });
  });
}
