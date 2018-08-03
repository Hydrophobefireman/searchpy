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

   function get_data() {
       if (input.value.length == 0) {
           document.getElementById("useless").innerHTML = "Length Can't Be Zero";
           return;
       } else {
           document.getElementById("useless").innerHTML = "Loading";
       }
       var content = document.getElementById("content");
       var val = input.value;
       document.title = val + ' -Image Search';
       document.getElementById("txt-link").href = '/search?q=' + encodeURIComponent(val);

       function createImgs(data_, name) {
           document.getElementById("useless").innerHTML = "Search For Images";
           content.style.display = 'block';
           for (i in data_) {
               data = data_[i];
               img = document.createElement("img");
               if (window.data_saver) {
                   /*if user enables data saver before image generation*/
                   img.src = data.fallback;
               } else {
                   img.src = data.img;
               }
               img.className = 'display-imgs';
               img.setAttribute("data-original", data.img);
               img.setAttribute("data-fallback", data.fallback);
               var link = data.link;
               var title = data.title;
               img.alt = title;
               document.getElementById(name).appendChild(img);
               img.setAttribute("data-link", link);
               img.setAttribute("data-caption", title);
               img.onclick = function () {
                   make_image_viewer(this.getAttribute("data-link"), this.getAttribute("data-caption"),
                       this.src);
               }
               img.onerror = function (e) {
                   console.log("Used Fallback Image For:" + e.target)
                   this.src = this.getAttribute("data-fallback")
               }
           }
           document.getElementById(name).appendChild(document.createElement("hr"));
       }

       req = new Request("/images/get?q=" + encodeURIComponent(val));
       window.history.pushState({}, "Images", "/images/search?q=" + val)
       fetch(req)
           .then(res => res.json())
           .then(ret => {
               bing = ret.bing;
               google = ret.google;
               document.getElementById("google").innerHTML = '';
               document.getElementById("bing").innerHTML = '';
               content.style.display = 'none'
               createImgs(bing, 'bing');
               createImgs(google, 'google');

           }).catch(e => {
               document.getElementById("useless").innerHTML = "An Error Occured";
               console.error(e);
           });
   };
   submit.onclick = function () {
       get_data()
   }
   input.onkeyup = function (e) {
       if (e.keyCode == 13) {
           get_data()
       }
   }