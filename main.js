/* NAV */
function navigate(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ADMIN LOGIN */
function loginAdmin(e){
  e.preventDefault();

  const email = adminEmail.value.trim();
  const pass  = adminPassword.value.trim();

  loginStatus.innerText = "Logging in...";

  firebase.auth()
    .signInWithEmailAndPassword(email, pass)
    .then(()=>{
      loginStatus.innerText = "✅ Login successful";
      adminPanel.style.display = "block";
    })
    .catch(err=>{
      console.error(err);
      loginStatus.innerText = "❌ " + err.message;
    });
}

/* CART */
let cart = [];

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}
