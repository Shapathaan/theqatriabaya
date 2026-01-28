/* NAV */
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
  .orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const grid=document.getElementById("productGrid");
    if(!grid) return;
    grid.innerHTML="";

    snapshot.forEach(doc=>{
      const p=doc.data();
      const poster=p.video.replace("/upload/","/upload/so_0/").replace(".mp4",".jpg");

      grid.innerHTML+=`
        <div class="product-card"
          onmouseenter="playVideo(this,'${p.video}')"
          onmouseleave="stopVideo(this)">
          
          <img src="${poster}" class="poster">
          
          <div class="product-info">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
          </div>
        </div>
      `;
    });
  });

/* VIDEO HANDLERS */
function playVideo(card,src){
  if(card.querySelector("video")) return;

  const video=document.createElement("video");
  video.src=src;
  video.muted=true;
  video.playsInline=true;
  video.autoplay=true;
  video.loop=true;
  video.style.width="100%";
  video.style.height="320px";
  video.style.objectFit="cover";

  card.querySelector("img").style.display="none";
  card.prepend(video);
}

function stopVideo(card){
  const video=card.querySelector("video");
  if(video){
    video.pause();
    video.remove();
    card.querySelector("img").style.display="block";
  }
}
