const submit=document.getElementById("btn_s"),input=document.getElementById("search"),search_ghost=document.getElementById("search-ghost");function make_image_viewer(e,t,n){const i=document.createElement("div"),l=document.createElement("a");l.href=e,i.innerHTML=t,l.style.color="#fff",i.style.color="#fff";const c=document.getElementById("img-viewer");c.innerHTML="",c.style.display="block",img=new Image,window.viewer_active=!0,img.src=n,img.style.marginTop="50px",img.style.height="50%",l.appendChild(img),l.appendChild(i),c.appendChild(l);const s=document.createElement("div");s.innerHTML="Close",s.className="closebtn",c.appendChild(s),s.onclick=(()=>{c.style.display="none",c.innerHTML=""})}input.onclick=(({target:e})=>{e.placeholder="",search_ghost.style.visibility="visible"}),document.body.onclick=(({target:e})=>{0==input.value.length&&e!==submit&&e!==input&&(input.placeholder="Search",search_ghost.style.visibility="hidden")});