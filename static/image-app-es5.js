!function(){function t(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function e(e){for(var a=1;a<arguments.length;a++){var i=null!=arguments[a]?arguments[a]:{};a%2?t(Object(i),!0).forEach((function(t){n(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}!function(){if(void 0===t)var t=window;var n=t.uiLib,a=n.h,i=n.render,r=n.useState,o=n.useCallback,l=n.useEffect,s=localStorage.getItem("data-config"),c=s?JSON.parse(s):{saveData:!1,slideShow:!1},u=document.getElementById("root"),f=t._initialData,g=f.bing,d=f.google,v=f.query;function b(t,e){c[t]=e,localStorage.setItem("data-config",JSON.stringify(c))}function h(t){var e=t.slideShow,n=t.saveData,i=r(0),l=i[0],s=i[1],c=o((function(n){var a=1==+n.target.dataset.group?g.length:0,i=+n.target.dataset.idx+a;s(i),t.setSlideShow(!e)}));if(e){var u=g.concat(d);return a(m,{images:u,index:l,closeSlideShow:function(){s(0),t.setSlideShow(!1)}})}var f={bing:g,google:d};return a("div",{class:"image-view"},["bing","google"].map((function(t,e){return a("div",null,a("div",{style:{"font-weight":"bold"}},t+" Images"),a("div",{class:"image-store"},a(p,{imgs:f[t],saveData:n,startSlideShow:c,group:e})))})))}function p(t){var n=t.saveData,i=t.imgs,r=t.startSlideShow,o=t.group,l=r;return i.map((function(t,i){return a(S,e({saveData:n,onClick:l,"data-idx":i,"data-group":o},t))}))}function S(t){var n=t.img,i=(t.link,t.fallback),s=t.saveData,c=function(t,e){if(null==t)return{};var n,a,i={},r=Object.keys(t);for(a=0;a<r.length;a++)n=r[a],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,["img","link","fallback","saveData"]),u=function(){return s?i:n},f=r(u),g=f[0],d=f[1];l((function(){return d(u)}),[s,n,i]);var v=o((function(){g===n&&d(i)}),[g]);return a("img",e({class:"grid-image hoverable",src:g,onError:v},c))}function m(t){var n=t.images,i=t.index,o=t.closeSlideShow,s=r(i),c=s[0],u=s[1],f=r(!0),g=f[0],d=f[1],v=n.length;l((function(){return c!=i&&u(i)}),[i]);var b=n[c];return a("div",{class:"img-slideshow-box"},a("div",{class:"title-link-ss"},a("a",{target:"_blank",href:b.link,class:"link-title-top"+(g?"":" hide")},b.title),a("div",{class:"action-button back-button"+(g?"":" rotate"),onClick:function(){return d(!g)}})),a("div",{class:"title-link-ss",style:{left:"unset",right:0,padding:0}},a("div",{class:"action-button close-button",style:{margin:0},onClick:o})),a(S,e(e({},b),{},{class:"slideshow-image",onClick:function(t){var e,n=t.target;n.offsetWidth/2>t.clientX-n.getBoundingClientRect().left?(e=c-1)<0&&(e=0):(e=c+1)>=v&&(e=0),u(e)}})))}i(a((function(){var t=r(c.slideShow),e=t[0],n=t[1],i=r(c.saveData),o=i[0],l=i[1];return a("div",{class:"image-root"},a("form",{action:"/images/search/"},a("input",{class:"paper-input",placeholder:"Search",name:"q",value:v||null}),a("button",{class:"sbm-btn"},"Search")),a("div",{style:"display:flex"},a("button",{class:"pref-button",onClick:function(){b("saveData",!o),l(!o)}},"Data Saver is ",o?"On":"Off"),a("button",{class:"pref-button",onClick:function(){b("slideShow",!e),n(!e)}},"Slide show is ",e?"On":"Off")),v?[a("div",null,"Search Results For: ",v),a(h,{bingData:g,googleData:d,saveData:o,slideShow:e,setSlideShow:n})]:a("div",null,"Enter your search above"))})),u)}()}();