/* NAVIGATION */
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
    .then(()=>{
      loginStatus.innerText = "✅ Login successful";
    })
    .catch(err=>{
      console.error(err);
      loginStatus.innerText = "❌ " + err.message;
    });
}

/* FIRESTORE */
const db = firebase.firestore();

/* LOAD PRODUCTS */
db.collection("products")
  .orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const grid = document.getElementById("productGrid");
    if(!grid) return;

    grid.innerHTML = "";

    snapshot.forEach(doc=>{
      const p = doc.data();

      grid.innerHTML += `
        <div class="product-card">
          <video src="${p.video}" muted autoplay loop playsinline></video>
          <div class="product-info">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
          </div>
        </div>
      `;
    });
  });

/* CART */
function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}
