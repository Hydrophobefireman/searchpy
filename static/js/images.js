   var submit = document.getElementById("btn_s")
   var input = document.getElementById("search");
   var search_ghost = document.getElementById("search-ghost");
   input.onclick = function () {
       this.placeholder = '';
       search_ghost.style.visibility = 'visible';
   }
   document.body.onclick = function (e) {
       if (input.value.length == 0 && e.target !== submit && e.target !== input) {
           input.placeholder = 'Search';
           search_ghost.style.visibility = 'hidden';
       }
   }

   function make_image_viewer(link, caption, src) {
       var text = document.createElement("div"),
           txtlink = document.createElement("a")
       txtlink.href = link;
       text.innerHTML = caption;
       txtlink.style.color = '#fff';
       text.style.color = '#fff';
       var viewer = document.getElementById("img-viewer");
       viewer.innerHTML = '';
       viewer.style.display = 'block';
       img = new Image();
       window.viewer_active = true;
       img.src = src;
       img.style.marginTop = '50px';
       img.style.height = '50%';
       txtlink.appendChild(img);
       txtlink.appendChild(text);
       viewer.appendChild(txtlink);
       var div = document.createElement("div");
       div.innerHTML = 'Close'
       div.className = 'closebtn';
       viewer.appendChild(div);
       div.onclick = function () {
           viewer.style.display = 'none';
           viewer.innerHTML = '';
       }
   }