!function(){function t(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function e(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?t(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,a=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(r=(i=l.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(t){a=!0,o=t}finally{try{r||null==l.return||l.return()}finally{if(a)throw o}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}!function(){if(void 0===t)var t=window;var n=t.uiLib,o=n.h,i=n.render,l=n.useState,c=n.useCallback,s=n.useEffect,u=(n.useRef,localStorage.getItem("data-config")),f=u?JSON.parse(u):{saveData:!1,slideShow:!1},g=document.getElementById("root"),d=t._initialData,b=d.bing,v=d.google,p=d.query;new WeakMap;function y(t,e){f[t]=e,localStorage.setItem("data-config",JSON.stringify(f))}function h(t){var e=t.slideShow,n=t.saveData,r=a(l(0),2),i=r[0],s=r[1],u=c((function(n){var r=1==+n.target.dataset.group?b.length:0,a=+n.target.dataset.idx+r;s(a),t.setSlideShow(!e)}));if(e){var f=b.concat(v);return o(O,{saveData:n,images:f,index:i,closeSlideShow:function(){s(0),t.setSlideShow(!1)}})}var g={bing:b,google:v};return o("div",{class:"image-view"},["bing","google"].map((function(t,e){return o("div",null,o("div",{style:{"font-weight":"bold"}},"".concat(t," Images")),o("div",{class:"image-store"},o(m,{imgs:g[t],saveData:n,startSlideShow:u,group:e})))})))}function m(t){var n=t.saveData,r=t.imgs,a=t.startSlideShow,i=t.group,l=a;return r.map((function(t,r){return o(S,e({saveData:n,onClick:l,"data-idx":r,"data-group":i},t))}))}function S(t){var n=t.img,i=(t.link,t.fallback),u=t.saveData,f=r(t,["img","link","fallback","saveData"]),g=function(){return u?i:n},d=a(l(g),2),b=d[0],v=d[1];s((function(){return v(g)}),[u,n,i]);var p=c((function(){b===n&&v(i)}),[b]);return o("img",e({loading:"lazy",class:"grid-image hoverable",src:b,onError:p},f))}function O(t){var n=t.images,r=t.index,i=t.closeSlideShow,c=a(l(r),2),u=c[0],f=c[1],g=a(l(!0),2),d=g[0],b=g[1],v=n.length;s((function(){return u!=r&&f(r)}),[r]);var p=n[u];return o("div",{class:"img-slideshow-box"},o("div",{class:"title-link-ss"},o("a",{target:"_blank",href:p.link,class:"link-title-top".concat(d?"":" hide")},p.title),o("div",{class:"action-button back-button".concat(d?"":" rotate"),onClick:function(){return b(!d)}})),o("div",{class:"title-link-ss",style:{left:"unset",right:0,padding:0}},o("div",{class:"action-button close-button",style:{margin:0},onClick:i})),o(S,e(e({},p),{},{class:"slideshow-image",saveData:t.saveData,onClick:function(t){var e,n=t.target;n.offsetWidth/2>t.clientX-n.getBoundingClientRect().left?(e=u-1)<0&&(e=0):(e=u+1)>=v&&(e=0),f(e)}})))}i(o((function(){var t=a(l(f.slideShow),2),e=t[0],n=t[1],r=a(l(f.saveData),2),i=r[0],c=r[1];return o("div",{class:"image-root"},o("form",{action:"/images/search/"},o("input",{class:"paper-input",placeholder:"Search",name:"q",value:p||null}),o("button",{class:"sbm-btn"},"Search")),o("div",{style:"display:flex"},o("button",{class:"pref-button",onClick:function(){y("saveData",!i),c(!i)}},"Data Saver is ",i?"On":"Off"),o("button",{class:"pref-button",onClick:function(){y("slideShow",!e),n(!e)}},"Slide show is ",e?"On":"Off")),p?[o("div",null,"Search Results For: ",p),o(h,{bingData:b,googleData:v,saveData:i,slideShow:e,setSlideShow:function(t){y("slideShow",t),n(t)}})]:o("div",null,"Enter your search above"))})),g)}();}()