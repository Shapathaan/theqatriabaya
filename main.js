/* NAVIGATION */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* LOAD PRODUCTS */
function loadProducts(){
  db.collection("products").onSnapshot(snapshot=>{
    const list = document.getElementById("productList");
    list.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();
      list.innerHTML += `
        <div class="card"
          onmouseenter="this.querySelector('video')?.play()"
          onmouseleave="this.querySelector('video')?.pause()">
          <div class="media">
            <video src="${p.video}" muted loop></video>
          </div>
          <div class="card-content">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
          </div>
        </div>
      `;
    });
  });
}

loadProducts();
