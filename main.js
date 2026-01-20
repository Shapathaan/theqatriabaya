const CLOUD_NAME = "dsdvlwxa4";
const UPLOAD_PRESET = "qatari-abaya";

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function loadProducts(){
  db.collection("products").onSnapshot(snapshot=>{
    productList.innerHTML="";
    snapshot.forEach(doc=>{
      const p = doc.data();

      productList.innerHTML += `
        <div class="card"
          onmouseenter="this.querySelector('video')?.play()"
          onmouseleave="this.querySelector('video')?.pause()">
          
          <div class="media">
