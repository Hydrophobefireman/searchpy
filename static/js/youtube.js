        var custom_dl = document.getElementById("ytdl")
        custom_dl.onclick = function () {
            el_array = document.getElementsByClassName("youtube-links");
            if (window.use_custom_dl) {
                custom_dl.innerHTML = 'Currently Using Default Youtube';
                window.use_custom_dl = false;
                change_href(el_array, false);
            } else {
                window.use_custom_dl = true;
                change_href(el_array, true);
                custom_dl.innerHTML = 'Currently Using Custom Downloader';
            }
        }

        function change_href(el_array, val) {
            for (var i = 0; i < el_array.length; i++) {
                el = el_array[i];
                if (val) {
                    el.href = '//dl-js.herokuapp.com/video?url=' + encodeURIComponent(el.getAttribute("data-url"));
                } else {
                    el.href = el.getAttribute("data-url");
                }
            }
        }

        function decodehtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }

        function search() {
            var q = document.getElementById("search").value;
            var url = "/youtube/search?q=" + q;
            window.location = url;
        }
        document.getElementById("search").onkeyup = function (e) {
            if (e.keyCode == 13) {
                search()
            }
        }
        var b = document.getElementById("s-button");
        b.onmouseover = function () {
            b.style.boxShadow = "3px 3px #d9dce0";
        }
        b.onmouseout = function () {
            b.style.boxShadow = "0px 0px #d9dce0";

        }
        b.ontouchstart = function () {
            b.style.boxShadow = "3px 3px #d9dce0";
        }
        b.ontouchend = function () {
            b.style.boxShadow = "0px 0px #d9dce0";

        }
        var req = new Request("/youtube/trending/");
        fetch(req)
            .then(response => response.text()).then(response => {
                gen_results(response);
            }).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                var div = document.createElement("div");
                div.style.color = 'red';
                div.innerText = error;
                document.getElementById('youtubeprev').appendChild(div);
            });

        function gen_results(json_data) {
            document.getElementById("skelly").style.display = "none";
            document.getElementById("content").style.display = "block";
            var json_data = JSON.parse(json_data);
            for (var i = 0; i < json_data['data'].length; i++) {
                var a = document.createElement("a");
                var img = document.createElement("img");
                img.setAttribute("class", "rounded-image");
                img.src = json_data['data'][i]['thumb'];
                var title = json_data['data'][i]['title'];
                var link = json_data['data'][i]['url'];
                var channel = json_data['data'][i]['channel'];
                var channel_url = json_data['data'][i]['channel_url'];
                img.setAttribute("data-motion", json_data['data'][i]['preview']);
                img.setAttribute("data-img", json_data['data'][i]['thumb']);
                img.setAttribute("alt", "No Preview available or your browser does not support webp images");
                img.style.display = 'inline-block';
                a.href = link;
                a.setAttribute("data-url", link);
                a.className = 'youtube-links';
                a.appendChild(img);
                a.appendChild(document.createElement("br"));
                var bold = document.createElement("b");
                bold.innerHTML = title;
                a.appendChild(bold);
                var ch_url = document.createElement("a");
                ch_url.href = channel_url;
                ch_url.innerHTML = "video By:" + channel;
                img.onmouseover = function () {
                    this.src = this.getAttribute("data-motion");
                }
                img.onmouseout = function () {
                    this.src = this.getAttribute("data-img");

                }
                img.ontouchstart = function () {
                    this.src = this.getAttribute("data-motion");
                }
                img.ontouchend = function () {
                    this.src = this.getAttribute("data-img");
                }
                var sp = document.createElement("div");
                sp.appendChild(ch_url);
                var div = document.createElement("div"),
                    div2 = document.createElement("div"),
                    div3 = document.createElement("div")
                div.innerHTML = 'Published:' + json_data['data'][i]['publish_time'];
                div2.innerHTML = 'Video Length:' + json_data['data'][i]['video_length'];
                div3.innerHTML = 'Views:' + json_data['data'][i]['view_count'];
                sp.appendChild(div);
                sp.appendChild(div2);
                sp.appendChild(div3);
                sp.appendChild(document.createElement("br"));
                sp.appendChild(document.createElement("br"));
                document.getElementById("content").appendChild(a);
                document.getElementById("content").appendChild(sp);

            }
            return "Created Results"
        }