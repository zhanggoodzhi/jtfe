webpackJsonp([19],{

/***/ 1142:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(556);


/***/ }),

/***/ 286:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 296:
/***/ (function(module, exports) {

module.exports = "/*!\n * Cropper v3.1.1\n * https://github.com/fengyuanchen/cropper\n *\n * Copyright (c) 2014-2017 Chen Fengyuan\n * Released under the MIT license\n *\n * Date: 2017-10-11T13:34:24.201Z\n */\n!function(t,i){\"object\"==typeof exports&&\"undefined\"!=typeof module?i(require(\"jquery\")):\"function\"==typeof define&&define.amd?define([\"jquery\"],i):i(t.jQuery)}(this,function(t){\"use strict\";function i(t){return\"string\"==typeof t}function e(t){return\"number\"==typeof t&&!Y(t)}function a(t){return void 0===t}function o(t,i){for(var e=arguments.length,a=Array(e>2?e-2:0),o=2;o<e;o++)a[o-2]=arguments[o];return function(){for(var e=arguments.length,o=Array(e),n=0;n<e;n++)o[n]=arguments[n];return t.apply(i,a.concat(o))}}function n(t){var i=t.match(z);return i&&(i[1]!==O.protocol||i[2]!==O.hostname||i[3]!==O.port)}function h(t){var i=\"timestamp=\"+(new Date).getTime();return t+(-1===t.indexOf(\"?\")?\"?\":\"&\")+i}function s(t){var i=t.rotate,a=t.scaleX,o=t.scaleY,n=t.translateX,h=t.translateY,s=[];return e(n)&&0!==n&&s.push(\"translateX(\"+n+\"px)\"),e(h)&&0!==h&&s.push(\"translateY(\"+h+\"px)\"),e(i)&&0!==i&&s.push(\"rotate(\"+i+\"deg)\"),e(a)&&1!==a&&s.push(\"scaleX(\"+a+\")\"),e(o)&&1!==o&&s.push(\"scaleY(\"+o+\")\"),s.length?s.join(\" \"):\"none\"}function r(t,i){if(!t.naturalWidth||N){var e=document.createElement(\"img\");e.onload=function(){i(e.width,e.height)},e.src=t.src}else i(t.naturalWidth,t.naturalHeight)}function c(i){var e=t.extend({},i),a=[];return t.each(i,function(i,o){delete e[i],t.each(e,function(t,i){var e=Math.abs(o.startX-i.startX),n=Math.abs(o.startY-i.startY),h=Math.abs(o.endX-i.endX),s=Math.abs(o.endY-i.endY),r=Math.sqrt(e*e+n*n),c=(Math.sqrt(h*h+s*s)-r)/r;a.push(c)})}),a.sort(function(t,i){return Math.abs(t)<Math.abs(i)}),a[0]}function d(i,e){var a=i.pageX,o=i.pageY,n={endX:a,endY:o};return e?n:t.extend({startX:a,startY:o},n)}function l(i){var e=0,a=0,o=0;return t.each(i,function(t,i){var n=i.startX,h=i.startY;e+=n,a+=h,o+=1}),e/=o,a/=o,{pageX:e,pageY:a}}function p(t){var i=t.aspectRatio,e=t.height,a=t.width,o=function(t){return R(t)&&t>0};return o(a)&&o(e)?e*i>a?e=a/i:a=e*i:o(a)?e=a/i:o(e)&&(a=e*i),{width:a,height:e}}function m(t){var i=t.width,e=t.height,a=t.degree;if((a=Math.abs(a))%180==90)return{width:e,height:i};var o=a%90*Math.PI/180,n=Math.sin(o),h=Math.cos(o);return{width:i*h+e*n,height:i*n+e*h}}function g(t,i,e,a){var o=i.naturalWidth,n=i.naturalHeight,h=i.rotate,s=i.scaleX,r=i.scaleY,c=e.aspectRatio,d=e.naturalWidth,l=e.naturalHeight,m=a.fillColor,g=void 0===m?\"transparent\":m,u=a.imageSmoothingEnabled,f=void 0===u||u,v=a.imageSmoothingQuality,w=void 0===v?\"low\":v,x=a.maxWidth,b=void 0===x?1/0:x,y=a.maxHeight,M=void 0===y?1/0:y,C=a.minWidth,$=void 0===C?0:C,B=a.minHeight,k=void 0===B?0:B,W=p({aspectRatio:c,width:b,height:M}),T=p({aspectRatio:c,width:$,height:k}),D=Math.min(W.width,Math.max(T.width,d)),H=Math.min(W.height,Math.max(T.height,l)),Y=document.createElement(\"canvas\"),X=Y.getContext(\"2d\");return Y.width=D,Y.height=H,X.fillStyle=g,X.fillRect(0,0,D,H),X.save(),X.translate(D/2,H/2),X.rotate(h*Math.PI/180),X.scale(s,r),X.imageSmoothingEnabled=!!f,X.imageSmoothingQuality=w,X.drawImage(t,Math.floor(-o/2),Math.floor(-n/2),Math.floor(o),Math.floor(n)),X.restore(),Y}function u(t,i,e){var a=\"\",o=void 0;for(e+=i,o=i;o<e;o+=1)a+=L(t.getUint8(o));return a}function f(i){var e=i.replace(P,\"\"),a=atob(e),o=new ArrayBuffer(a.length),n=new Uint8Array(o);return t.each(n,function(t){n[t]=a.charCodeAt(t)}),o}function v(i,e){var a=new Uint8Array(i),o=\"\";return t.each(a,function(t,i){o+=L(i)}),\"data:\"+e+\";base64,\"+btoa(o)}function w(t){var i=new DataView(t),e=void 0,a=void 0,o=void 0,n=void 0;if(255===i.getUint8(0)&&216===i.getUint8(1))for(var h=i.byteLength,s=2;s<h;){if(255===i.getUint8(s)&&225===i.getUint8(s+1)){o=s;break}s+=1}if(o){var r=o+10;if(\"Exif\"===u(i,o+4,4)){var c=i.getUint16(r);if(((a=18761===c)||19789===c)&&42===i.getUint16(r+2,a)){var d=i.getUint32(r+4,a);d>=8&&(n=r+d)}}}if(n){var l=i.getUint16(n,a),p=void 0,m=void 0;for(m=0;m<l;m+=1)if(p=n+12*m+2,274===i.getUint16(p,a)){p+=8,e=i.getUint16(p,a),i.setUint16(p,1,a);break}}return e}function x(t){var i=0,e=1,a=1;switch(t){case 2:e=-1;break;case 3:i=-180;break;case 4:a=-1;break;case 5:i=90,a=-1;break;case 6:i=90;break;case 7:i=90,e=-1;break;case 8:i=-90}return{rotate:i,scaleX:e,scaleY:a}}function b(t,i){if(!(t instanceof i))throw new TypeError(\"Cannot call a class as a function\")}t=t&&t.hasOwnProperty(\"default\")?t.default:t;var y=\"undefined\"!=typeof window?window:{},M=\"cropper-hidden\",C=y.PointerEvent?\"pointerdown\":\"touchstart mousedown\",$=y.PointerEvent?\"pointermove\":\"touchmove mousemove\",B=y.PointerEvent?\" pointerup pointercancel\":\"touchend touchcancel mouseup\",k=/^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/,W=/^data:/,T=/^data:image\\/jpeg;base64,/,D=/^(img|canvas)$/i,H={viewMode:0,dragMode:\"crop\",aspectRatio:NaN,data:null,preview:\"\",responsive:!0,restore:!0,checkCrossOrigin:!0,checkOrientation:!0,modal:!0,guides:!0,center:!0,highlight:!0,background:!0,autoCrop:!0,autoCropArea:.8,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,wheelZoomRatio:.1,cropBoxMovable:!0,cropBoxResizable:!0,toggleDragModeOnDblclick:!0,minCanvasWidth:0,minCanvasHeight:0,minCropBoxWidth:0,minCropBoxHeight:0,minContainerWidth:200,minContainerHeight:100,ready:null,cropstart:null,cropmove:null,cropend:null,crop:null,zoom:null},Y=Number.isNaN||y.isNaN,X=Object.keys||function(i){var e=[];return t.each(i,function(t){e.push(t)}),e},O=y.location,z=/^(https?:)\\/\\/([^:/?#]+):?(\\d*)/i,E=y.navigator,N=E&&/(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(E.userAgent),R=Number.isFinite||y.isFinite,L=String.fromCharCode,P=/^data:.*,/,I={render:function(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.cropped&&this.renderCropBox()},initContainer:function(){var t=this.$element,i=this.options,e=this.$container,a=this.$cropper;a.addClass(M),t.removeClass(M),a.css(this.container={width:Math.max(e.width(),Number(i.minContainerWidth)||200),height:Math.max(e.height(),Number(i.minContainerHeight)||100)}),t.addClass(M),a.removeClass(M)},initCanvas:function(){var i=this.container,e=this.image,a=this.options.viewMode,o=Math.abs(e.rotate)%180==90,n=o?e.naturalHeight:e.naturalWidth,h=o?e.naturalWidth:e.naturalHeight,s=n/h,r=i.width,c=i.height;i.height*s>i.width?3===a?r=i.height*s:c=i.width/s:3===a?c=i.width/s:r=i.height*s;var d={aspectRatio:s,naturalWidth:n,naturalHeight:h,width:r,height:c};d.left=(i.width-r)/2,d.top=(i.height-c)/2,d.oldLeft=d.left,d.oldTop=d.top,this.canvas=d,this.limited=1===a||2===a,this.limitCanvas(!0,!0),this.initialImage=t.extend({},e),this.initialCanvas=t.extend({},d)},limitCanvas:function(t,i){var e=this.options,a=this.container,o=this.canvas,n=this.cropBox,h=e.viewMode,s=o.aspectRatio,r=this.cropped&&n;if(t){var c=Number(e.minCanvasWidth)||0,d=Number(e.minCanvasHeight)||0;h>0&&(h>1?(c=Math.max(c,a.width),d=Math.max(d,a.height),3===h&&(d*s>c?c=d*s:d=c/s)):c?c=Math.max(c,r?n.width:0):d?d=Math.max(d,r?n.height:0):r&&(c=n.width,(d=n.height)*s>c?c=d*s:d=c/s));var l=p({aspectRatio:s,width:c,height:d});c=l.width,d=l.height,o.minWidth=c,o.minHeight=d,o.maxWidth=1/0,o.maxHeight=1/0}if(i)if(h>0){var m=a.width-o.width,g=a.height-o.height;o.minLeft=Math.min(0,m),o.minTop=Math.min(0,g),o.maxLeft=Math.max(0,m),o.maxTop=Math.max(0,g),r&&this.limited&&(o.minLeft=Math.min(n.left,n.left+n.width-o.width),o.minTop=Math.min(n.top,n.top+n.height-o.height),o.maxLeft=n.left,o.maxTop=n.top,2===h&&(o.width>=a.width&&(o.minLeft=Math.min(0,m),o.maxLeft=Math.max(0,m)),o.height>=a.height&&(o.minTop=Math.min(0,g),o.maxTop=Math.max(0,g))))}else o.minLeft=-o.width,o.minTop=-o.height,o.maxLeft=a.width,o.maxTop=a.height},renderCanvas:function(t,i){var e=this.canvas,a=this.image;if(i){var o=m({width:a.naturalWidth*Math.abs(a.scaleX),height:a.naturalHeight*Math.abs(a.scaleY),degree:a.rotate}),n=o.width,h=o.height,r=e.width*(n/e.naturalWidth),c=e.height*(h/e.naturalHeight);e.left-=(r-e.width)/2,e.top-=(c-e.height)/2,e.width=r,e.height=c,e.aspectRatio=n/h,e.naturalWidth=n,e.naturalHeight=h,this.limitCanvas(!0,!1)}(e.width>e.maxWidth||e.width<e.minWidth)&&(e.left=e.oldLeft),(e.height>e.maxHeight||e.height<e.minHeight)&&(e.top=e.oldTop),e.width=Math.min(Math.max(e.width,e.minWidth),e.maxWidth),e.height=Math.min(Math.max(e.height,e.minHeight),e.maxHeight),this.limitCanvas(!1,!0),e.left=Math.min(Math.max(e.left,e.minLeft),e.maxLeft),e.top=Math.min(Math.max(e.top,e.minTop),e.maxTop),e.oldLeft=e.left,e.oldTop=e.top,this.$canvas.css({width:e.width,height:e.height,transform:s({translateX:e.left,translateY:e.top})}),this.renderImage(t),this.cropped&&this.limited&&this.limitCropBox(!0,!0)},renderImage:function(i){var e=this.canvas,a=this.image,o=a.naturalWidth*(e.width/e.naturalWidth),n=a.naturalHeight*(e.height/e.naturalHeight);t.extend(a,{width:o,height:n,left:(e.width-o)/2,top:(e.height-n)/2}),this.$clone.css({width:a.width,height:a.height,transform:s(t.extend({translateX:a.left,translateY:a.top},a))}),i&&this.output()},initCropBox:function(){var i=this.options,e=this.canvas,a=i.aspectRatio,o=Number(i.autoCropArea)||.8,n={width:e.width,height:e.height};a&&(e.height*a>e.width?n.height=n.width/a:n.width=n.height*a),this.cropBox=n,this.limitCropBox(!0,!0),n.width=Math.min(Math.max(n.width,n.minWidth),n.maxWidth),n.height=Math.min(Math.max(n.height,n.minHeight),n.maxHeight),n.width=Math.max(n.minWidth,n.width*o),n.height=Math.max(n.minHeight,n.height*o),n.left=e.left+(e.width-n.width)/2,n.top=e.top+(e.height-n.height)/2,n.oldLeft=n.left,n.oldTop=n.top,this.initialCropBox=t.extend({},n)},limitCropBox:function(t,i){var e=this.options,a=this.container,o=this.canvas,n=this.cropBox,h=this.limited,s=e.aspectRatio;if(t){var r=Number(e.minCropBoxWidth)||0,c=Number(e.minCropBoxHeight)||0,d=Math.min(a.width,h?o.width:a.width),l=Math.min(a.height,h?o.height:a.height);r=Math.min(r,a.width),c=Math.min(c,a.height),s&&(r&&c?c*s>r?c=r/s:r=c*s:r?c=r/s:c&&(r=c*s),l*s>d?l=d/s:d=l*s),n.minWidth=Math.min(r,d),n.minHeight=Math.min(c,l),n.maxWidth=d,n.maxHeight=l}i&&(h?(n.minLeft=Math.max(0,o.left),n.minTop=Math.max(0,o.top),n.maxLeft=Math.min(a.width,o.left+o.width)-n.width,n.maxTop=Math.min(a.height,o.top+o.height)-n.height):(n.minLeft=0,n.minTop=0,n.maxLeft=a.width-n.width,n.maxTop=a.height-n.height))},renderCropBox:function(){var t=this.options,i=this.container,e=this.cropBox;(e.width>e.maxWidth||e.width<e.minWidth)&&(e.left=e.oldLeft),(e.height>e.maxHeight||e.height<e.minHeight)&&(e.top=e.oldTop),e.width=Math.min(Math.max(e.width,e.minWidth),e.maxWidth),e.height=Math.min(Math.max(e.height,e.minHeight),e.maxHeight),this.limitCropBox(!1,!0),e.left=Math.min(Math.max(e.left,e.minLeft),e.maxLeft),e.top=Math.min(Math.max(e.top,e.minTop),e.maxTop),e.oldLeft=e.left,e.oldTop=e.top,t.movable&&t.cropBoxMovable&&this.$face.data(\"action\",e.width>=i.width&&e.height>=i.height?\"move\":\"all\"),this.$cropBox.css({width:e.width,height:e.height,transform:s({translateX:e.left,translateY:e.top})}),this.cropped&&this.limited&&this.limitCanvas(!0,!0),this.disabled||this.output()},output:function(){this.preview(),this.completed&&this.trigger(\"crop\",this.getData())}},U={initPreview:function(){var i=this.crossOrigin,e=i?this.crossOriginUrl:this.url,a=document.createElement(\"img\");i&&(a.crossOrigin=i),a.src=e;var o=t(a);this.$preview=t(this.options.preview),this.$clone2=o,this.$viewBox.html(o),this.$preview.each(function(a,o){var n=t(o),h=document.createElement(\"img\");n.data(\"preview\",{width:n.width(),height:n.height(),html:n.html()}),i&&(h.crossOrigin=i),h.src=e,h.style.cssText='display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;\"',n.html(h)})},resetPreview:function(){this.$preview.each(function(i,e){var a=t(e),o=a.data(\"preview\");a.css({width:o.width,height:o.height}).html(o.html).removeData(\"preview\")})},preview:function(){var i=this.image,e=this.canvas,a=this.cropBox,o=a.width,n=a.height,h=i.width,r=i.height,c=a.left-e.left-i.left,d=a.top-e.top-i.top;this.cropped&&!this.disabled&&(this.$clone2.css({width:h,height:r,transform:s(t.extend({translateX:-c,translateY:-d},i))}),this.$preview.each(function(e,a){var l=t(a),p=l.data(\"preview\"),m=p.width,g=p.height,u=m,f=g,v=1;o&&(f=n*(v=m/o)),n&&f>g&&(u=o*(v=g/n),f=g),l.css({width:u,height:f}).find(\"img\").css({width:h*v,height:r*v,transform:s(t.extend({translateX:-c*v,translateY:-d*v},i))})}))}},F={bind:function(){var i=this.$element,e=this.options,a=this.$cropper;t.isFunction(e.cropstart)&&i.on(\"cropstart\",e.cropstart),t.isFunction(e.cropmove)&&i.on(\"cropmove\",e.cropmove),t.isFunction(e.cropend)&&i.on(\"cropend\",e.cropend),t.isFunction(e.crop)&&i.on(\"crop\",e.crop),t.isFunction(e.zoom)&&i.on(\"zoom\",e.zoom),a.on(C,o(this.cropStart,this)),e.zoomable&&e.zoomOnWheel&&a.on(\"wheel mousewheel DOMMouseScroll\",o(this.wheel,this)),e.toggleDragModeOnDblclick&&a.on(\"dblclick\",o(this.dblclick,this)),t(document).on($,this.onCropMove=o(this.cropMove,this)).on(B,this.onCropEnd=o(this.cropEnd,this)),e.responsive&&t(y).on(\"resize\",this.onResize=o(this.resize,this))},unbind:function(){var i=this.$element,e=this.options,a=this.$cropper;t.isFunction(e.cropstart)&&i.off(\"cropstart\",e.cropstart),t.isFunction(e.cropmove)&&i.off(\"cropmove\",e.cropmove),t.isFunction(e.cropend)&&i.off(\"cropend\",e.cropend),t.isFunction(e.crop)&&i.off(\"crop\",e.crop),t.isFunction(e.zoom)&&i.off(\"zoom\",e.zoom),a.off(C,this.cropStart),e.zoomable&&e.zoomOnWheel&&a.off(\"wheel mousewheel DOMMouseScroll\",this.wheel),e.toggleDragModeOnDblclick&&a.off(\"dblclick\",this.dblclick),t(document).off($,this.onCropMove).off(B,this.onCropEnd),e.responsive&&t(y).off(\"resize\",this.onResize)}},S={resize:function(){var i=this.options,e=this.$container,a=this.container,o=Number(i.minContainerWidth)||200,n=Number(i.minContainerHeight)||100;if(!(this.disabled||a.width<=o||a.height<=n)){var h=e.width()/a.width;if(1!==h||e.height()!==a.height){var s=void 0,r=void 0;i.restore&&(s=this.getCanvasData(),r=this.getCropBoxData()),this.render(),i.restore&&(this.setCanvasData(t.each(s,function(t,i){s[t]=i*h})),this.setCropBoxData(t.each(r,function(t,i){r[t]=i*h})))}}},dblclick:function(){this.disabled||\"none\"===this.options.dragMode||this.setDragMode(this.$dragBox.hasClass(\"cropper-crop\")?\"move\":\"crop\")},wheel:function(t){var i=this,e=t.originalEvent||t,a=Number(this.options.wheelZoomRatio)||.1;if(!this.disabled&&(t.preventDefault(),!this.wheeling)){this.wheeling=!0,setTimeout(function(){i.wheeling=!1},50);var o=1;e.deltaY?o=e.deltaY>0?1:-1:e.wheelDelta?o=-e.wheelDelta/120:e.detail&&(o=e.detail>0?1:-1),this.zoom(-o*a,t)}},cropStart:function(i){if(!this.disabled){var e=this.options,a=this.pointers,o=i.originalEvent,n=void 0;o&&o.changedTouches?t.each(o.changedTouches,function(t,i){a[i.identifier]=d(i)}):a[o&&o.pointerId||0]=d(o||i),n=X(a).length>1&&e.zoomable&&e.zoomOnTouch?\"zoom\":t(i.target).data(\"action\"),k.test(n)&&(this.trigger(\"cropstart\",{originalEvent:o,action:n}).isDefaultPrevented()||(i.preventDefault(),this.action=n,this.cropping=!1,\"crop\"===n&&(this.cropping=!0,this.$dragBox.addClass(\"cropper-modal\"))))}},cropMove:function(i){var e=this.action;if(!this.disabled&&e){var a=this.pointers,o=i.originalEvent;i.preventDefault(),this.trigger(\"cropmove\",{originalEvent:o,action:e}).isDefaultPrevented()||(o&&o.changedTouches?t.each(o.changedTouches,function(i,e){t.extend(a[e.identifier],d(e,!0))}):t.extend(a[o&&o.pointerId||0],d(o||i,!0)),this.change(i))}},cropEnd:function(i){if(!this.disabled){var e=this.action,a=this.pointers,o=i.originalEvent;o&&o.changedTouches?t.each(o.changedTouches,function(t,i){delete a[i.identifier]}):delete a[o&&o.pointerId||0],e&&(i.preventDefault(),X(a).length||(this.action=\"\"),this.cropping&&(this.cropping=!1,this.$dragBox.toggleClass(\"cropper-modal\",this.cropped&&this.options.modal)),this.trigger(\"cropend\",{originalEvent:o,action:e}))}}},j={change:function(i){var e=this.options,a=this.pointers,o=this.container,n=this.canvas,h=this.cropBox,s=this.action,r=e.aspectRatio,d=h.left,l=h.top,p=h.width,m=h.height,g=d+p,u=l+m,f=0,v=0,w=o.width,x=o.height,b=!0,y=void 0;!r&&i.shiftKey&&(r=p&&m?p/m:1),this.limited&&(f=h.minLeft,v=h.minTop,w=f+Math.min(o.width,n.width,n.left+n.width),x=v+Math.min(o.height,n.height,n.top+n.height));var C=a[X(a)[0]],$={x:C.endX-C.startX,y:C.endY-C.startY},B=function(t){switch(t){case\"e\":g+$.x>w&&($.x=w-g);break;case\"w\":d+$.x<f&&($.x=f-d);break;case\"n\":l+$.y<v&&($.y=v-l);break;case\"s\":u+$.y>x&&($.y=x-u)}};switch(s){case\"all\":d+=$.x,l+=$.y;break;case\"e\":if($.x>=0&&(g>=w||r&&(l<=v||u>=x))){b=!1;break}B(\"e\"),p+=$.x,r&&(m=p/r,l-=$.x/r/2),p<0&&(s=\"w\",p=0);break;case\"n\":if($.y<=0&&(l<=v||r&&(d<=f||g>=w))){b=!1;break}B(\"n\"),m-=$.y,l+=$.y,r&&(p=m*r,d+=$.y*r/2),m<0&&(s=\"s\",m=0);break;case\"w\":if($.x<=0&&(d<=f||r&&(l<=v||u>=x))){b=!1;break}B(\"w\"),p-=$.x,d+=$.x,r&&(m=p/r,l+=$.x/r/2),p<0&&(s=\"e\",p=0);break;case\"s\":if($.y>=0&&(u>=x||r&&(d<=f||g>=w))){b=!1;break}B(\"s\"),m+=$.y,r&&(p=m*r,d-=$.y*r/2),m<0&&(s=\"n\",m=0);break;case\"ne\":if(r){if($.y<=0&&(l<=v||g>=w)){b=!1;break}B(\"n\"),m-=$.y,l+=$.y,p=m*r}else B(\"n\"),B(\"e\"),$.x>=0?g<w?p+=$.x:$.y<=0&&l<=v&&(b=!1):p+=$.x,$.y<=0?l>v&&(m-=$.y,l+=$.y):(m-=$.y,l+=$.y);p<0&&m<0?(s=\"sw\",m=0,p=0):p<0?(s=\"nw\",p=0):m<0&&(s=\"se\",m=0);break;case\"nw\":if(r){if($.y<=0&&(l<=v||d<=f)){b=!1;break}B(\"n\"),m-=$.y,l+=$.y,p=m*r,d+=$.y*r}else B(\"n\"),B(\"w\"),$.x<=0?d>f?(p-=$.x,d+=$.x):$.y<=0&&l<=v&&(b=!1):(p-=$.x,d+=$.x),$.y<=0?l>v&&(m-=$.y,l+=$.y):(m-=$.y,l+=$.y);p<0&&m<0?(s=\"se\",m=0,p=0):p<0?(s=\"ne\",p=0):m<0&&(s=\"sw\",m=0);break;case\"sw\":if(r){if($.x<=0&&(d<=f||u>=x)){b=!1;break}B(\"w\"),p-=$.x,d+=$.x,m=p/r}else B(\"s\"),B(\"w\"),$.x<=0?d>f?(p-=$.x,d+=$.x):$.y>=0&&u>=x&&(b=!1):(p-=$.x,d+=$.x),$.y>=0?u<x&&(m+=$.y):m+=$.y;p<0&&m<0?(s=\"ne\",m=0,p=0):p<0?(s=\"se\",p=0):m<0&&(s=\"nw\",m=0);break;case\"se\":if(r){if($.x>=0&&(g>=w||u>=x)){b=!1;break}B(\"e\"),m=(p+=$.x)/r}else B(\"s\"),B(\"e\"),$.x>=0?g<w?p+=$.x:$.y>=0&&u>=x&&(b=!1):p+=$.x,$.y>=0?u<x&&(m+=$.y):m+=$.y;p<0&&m<0?(s=\"nw\",m=0,p=0):p<0?(s=\"sw\",p=0):m<0&&(s=\"ne\",m=0);break;case\"move\":this.move($.x,$.y),b=!1;break;case\"zoom\":this.zoom(c(a),i.originalEvent),b=!1;break;case\"crop\":if(!$.x||!$.y){b=!1;break}y=this.$cropper.offset(),d=C.startX-y.left,l=C.startY-y.top,p=h.minWidth,m=h.minHeight,$.x>0?s=$.y>0?\"se\":\"ne\":$.x<0&&(d-=p,s=$.y>0?\"sw\":\"nw\"),$.y<0&&(l-=m),this.cropped||(this.$cropBox.removeClass(M),this.cropped=!0,this.limited&&this.limitCropBox(!0,!0))}b&&(h.width=p,h.height=m,h.left=d,h.top=l,this.action=s,this.renderCropBox()),t.each(a,function(t,i){i.startX=i.endX,i.startY=i.endY})}},A={crop:function(){this.ready&&!this.disabled&&(this.cropped||(this.cropped=!0,this.limitCropBox(!0,!0),this.options.modal&&this.$dragBox.addClass(\"cropper-modal\"),this.$cropBox.removeClass(M)),this.setCropBoxData(this.initialCropBox))},reset:function(){this.ready&&!this.disabled&&(this.image=t.extend({},this.initialImage),this.canvas=t.extend({},this.initialCanvas),this.cropBox=t.extend({},this.initialCropBox),this.renderCanvas(),this.cropped&&this.renderCropBox())},clear:function(){this.cropped&&!this.disabled&&(t.extend(this.cropBox,{left:0,top:0,width:0,height:0}),this.cropped=!1,this.renderCropBox(),this.limitCanvas(!0,!0),this.renderCanvas(),this.$dragBox.removeClass(\"cropper-modal\"),this.$cropBox.addClass(M))},replace:function(t,i){!this.disabled&&t&&(this.isImg&&this.$element.attr(\"src\",t),i?(this.url=t,this.$clone.attr(\"src\",t),this.ready&&this.$preview.find(\"img\").add(this.$clone2).attr(\"src\",t)):(this.isImg&&(this.replaced=!0),this.options.data=null,this.load(t)))},enable:function(){this.ready&&(this.disabled=!1,this.$cropper.removeClass(\"cropper-disabled\"))},disable:function(){this.ready&&(this.disabled=!0,this.$cropper.addClass(\"cropper-disabled\"))},destroy:function(){var t=this.$element;this.loaded?(this.isImg&&this.replaced&&t.attr(\"src\",this.originalUrl),this.unbuild(),t.removeClass(M)):this.isImg?t.off(\"load\",this.start):this.$clone&&this.$clone.remove(),t.removeData(\"cropper\")},move:function(t,i){var e=this.canvas,o=e.left,n=e.top;this.moveTo(a(t)?t:o+Number(t),a(i)?i:n+Number(i))},moveTo:function(t,i){var o=this.canvas,n=!1;a(i)&&(i=t),t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.movable&&(e(t)&&(o.left=t,n=!0),e(i)&&(o.top=i,n=!0),n&&this.renderCanvas(!0))},zoom:function(t,i){var e=this.canvas;t=(t=Number(t))<0?1/(1-t):1+t,this.zoomTo(e.width*t/e.naturalWidth,i)},zoomTo:function(t,i){var e=this.options,a=this.pointers,o=this.canvas,n=o.width,h=o.height,s=o.naturalWidth,r=o.naturalHeight;if((t=Number(t))>=0&&this.ready&&!this.disabled&&e.zoomable){var c=s*t,d=r*t,p=void 0;if(i&&(p=i.originalEvent),this.trigger(\"zoom\",{originalEvent:p,oldRatio:n/s,ratio:c/s}).isDefaultPrevented())return;if(p){var m=this.$cropper.offset(),g=a&&X(a).length?l(a):{pageX:i.pageX||p.pageX||0,pageY:i.pageY||p.pageY||0};o.left-=(c-n)*((g.pageX-m.left-o.left)/n),o.top-=(d-h)*((g.pageY-m.top-o.top)/h)}else o.left-=(c-n)/2,o.top-=(d-h)/2;o.width=c,o.height=d,this.renderCanvas(!0)}},rotate:function(t){this.rotateTo((this.image.rotate||0)+Number(t))},rotateTo:function(t){e(t=Number(t))&&this.ready&&!this.disabled&&this.options.rotatable&&(this.image.rotate=t%360,this.renderCanvas(!0,!0))},scaleX:function(t){var i=this.image.scaleY;this.scale(t,e(i)?i:1)},scaleY:function(t){var i=this.image.scaleX;this.scale(e(i)?i:1,t)},scale:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t,a=this.image,o=!1;t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.scalable&&(e(t)&&(a.scaleX=t,o=!0),e(i)&&(a.scaleY=i,o=!0),o&&this.renderCanvas(!0,!0))},getData:function(){var i=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=this.options,a=this.image,o=this.canvas,n=this.cropBox,h=void 0;if(this.ready&&this.cropped){h={x:n.left-o.left,y:n.top-o.top,width:n.width,height:n.height};var s=a.width/a.naturalWidth;t.each(h,function(t,e){e/=s,h[t]=i?Math.round(e):e})}else h={x:0,y:0,width:0,height:0};return e.rotatable&&(h.rotate=a.rotate||0),e.scalable&&(h.scaleX=a.scaleX||1,h.scaleY=a.scaleY||1),h},setData:function(i){var a=this.options,o=this.image,n=this.canvas,h={};if(t.isFunction(i)&&(i=i.call(this.element)),this.ready&&!this.disabled&&t.isPlainObject(i)){var s=!1;a.rotatable&&e(i.rotate)&&i.rotate!==o.rotate&&(o.rotate=i.rotate,s=!0),a.scalable&&(e(i.scaleX)&&i.scaleX!==o.scaleX&&(o.scaleX=i.scaleX,s=!0),e(i.scaleY)&&i.scaleY!==o.scaleY&&(o.scaleY=i.scaleY,s=!0)),s&&this.renderCanvas(!0,!0);var r=o.width/o.naturalWidth;e(i.x)&&(h.left=i.x*r+n.left),e(i.y)&&(h.top=i.y*r+n.top),e(i.width)&&(h.width=i.width*r),e(i.height)&&(h.height=i.height*r),this.setCropBoxData(h)}},getContainerData:function(){return this.ready?t.extend({},this.container):{}},getImageData:function(){return this.loaded?t.extend({},this.image):{}},getCanvasData:function(){var i=this.canvas,e={};return this.ready&&t.each([\"left\",\"top\",\"width\",\"height\",\"naturalWidth\",\"naturalHeight\"],function(t,a){e[a]=i[a]}),e},setCanvasData:function(i){var a=this.canvas,o=a.aspectRatio;t.isFunction(i)&&(i=i.call(this.$element)),this.ready&&!this.disabled&&t.isPlainObject(i)&&(e(i.left)&&(a.left=i.left),e(i.top)&&(a.top=i.top),e(i.width)?(a.width=i.width,a.height=i.width/o):e(i.height)&&(a.height=i.height,a.width=i.height*o),this.renderCanvas(!0))},getCropBoxData:function(){var t=this.cropBox;return this.ready&&this.cropped?{left:t.left,top:t.top,width:t.width,height:t.height}:{}},setCropBoxData:function(i){var a=this.cropBox,o=this.options.aspectRatio,n=void 0,h=void 0;t.isFunction(i)&&(i=i.call(this.$element)),this.ready&&this.cropped&&!this.disabled&&t.isPlainObject(i)&&(e(i.left)&&(a.left=i.left),e(i.top)&&(a.top=i.top),e(i.width)&&i.width!==a.width&&(n=!0,a.width=i.width),e(i.height)&&i.height!==a.height&&(h=!0,a.height=i.height),o&&(n?a.height=a.width/o:h&&(a.width=a.height*o)),this.renderCropBox())},getCroppedCanvas:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!this.ready||!y.HTMLCanvasElement)return null;var i=this.canvas,e=g(this.$clone[0],this.image,i,t);if(!this.cropped)return e;var a=this.getData(),o=a.x,n=a.y,h=a.width,s=a.height,r=h/s,c=p({aspectRatio:r,width:t.maxWidth||1/0,height:t.maxHeight||1/0}),d=p({aspectRatio:r,width:t.minWidth||0,height:t.minHeight||0}),l=p({aspectRatio:r,width:t.width||h,height:t.height||s}),m=l.width,u=l.height;m=Math.min(c.width,Math.max(d.width,m)),u=Math.min(c.height,Math.max(d.height,u));var f=document.createElement(\"canvas\"),v=f.getContext(\"2d\");f.width=m,f.height=u,v.fillStyle=t.fillColor||\"transparent\",v.fillRect(0,0,m,u);var w=t.imageSmoothingEnabled,x=void 0===w||w,b=t.imageSmoothingQuality;v.imageSmoothingEnabled=x,b&&(v.imageSmoothingQuality=b);var M=e.width,C=e.height,$=o,B=n,k=void 0,W=void 0,T=void 0,D=void 0,H=void 0,Y=void 0;$<=-h||$>M?($=0,k=0,T=0,H=0):$<=0?(T=-$,$=0,H=k=Math.min(M,h+$)):$<=M&&(T=0,H=k=Math.min(h,M-$)),k<=0||B<=-s||B>C?(B=0,W=0,D=0,Y=0):B<=0?(D=-B,B=0,Y=W=Math.min(C,s+B)):B<=C&&(D=0,Y=W=Math.min(s,C-B));var X=[Math.floor($),Math.floor(B),Math.floor(k),Math.floor(W)];if(H>0&&Y>0){var O=m/h;X.push(Math.floor(T*O),Math.floor(D*O),Math.floor(H*O),Math.floor(Y*O))}return v.drawImage.apply(v,[e].concat(X)),f},setAspectRatio:function(t){var i=this.options;this.disabled||a(t)||(i.aspectRatio=Math.max(0,t)||NaN,this.ready&&(this.initCropBox(),this.cropped&&this.renderCropBox()))},setDragMode:function(t){var i=this.options,e=void 0,a=void 0;this.loaded&&!this.disabled&&(e=\"crop\"===t,a=i.movable&&\"move\"===t,t=e||a?t:\"none\",this.$dragBox.data(\"action\",t).toggleClass(\"cropper-crop\",e).toggleClass(\"cropper-move\",a),i.cropBoxMovable||this.$face.data(\"action\",t).toggleClass(\"cropper-crop\",e).toggleClass(\"cropper-move\",a))}},q=function(){function t(t,i){for(var e=0;e<i.length;e++){var a=i[e];a.enumerable=a.enumerable||!1,a.configurable=!0,\"value\"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(i,e,a){return e&&t(i.prototype,e),a&&t(i,a),i}}(),Q=function(){function i(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(b(this,i),!e||!D.test(e.tagName))throw new Error(\"The first argument is required and must be an <img> or <canvas> element.\");this.element=e,this.$element=t(e),this.options=t.extend({},H,t.isPlainObject(a)&&a),this.completed=!1,this.cropped=!1,this.disabled=!1,this.isImg=!1,this.limited=!1,this.loaded=!1,this.ready=!1,this.replaced=!1,this.wheeling=!1,this.originalUrl=\"\",this.canvas=null,this.cropBox=null,this.pointers={},this.init()}return q(i,[{key:\"init\",value:function(){var t=this.$element,i=void 0;if(t.is(\"img\")){if(this.isImg=!0,i=t.attr(\"src\")||\"\",this.originalUrl=i,!i)return;i=t.prop(\"src\")}else t.is(\"canvas\")&&y.HTMLCanvasElement&&(i=t[0].toDataURL());this.load(i)}},{key:\"trigger\",value:function(i,e){var a=t.Event(i,e);return this.$element.trigger(a),a}},{key:\"load\",value:function(t){var i=this;if(t){this.url=t,this.image={};var e=this.$element,a=this.options;if(a.checkOrientation&&y.ArrayBuffer)if(W.test(t))T.test(t)?this.read(f(t)):this.clone();else{var o=new XMLHttpRequest;o.onerror=function(){i.clone()},o.onload=function(){i.read(o.response)},a.checkCrossOrigin&&n(t)&&e.prop(\"crossOrigin\")&&(t=h(t)),o.open(\"get\",t),o.responseType=\"arraybuffer\",o.withCredentials=\"use-credentials\"===e.prop(\"crossOrigin\"),o.send()}else this.clone()}}},{key:\"read\",value:function(t){var i=this.options,e=this.image,a=w(t),o=0,n=1,h=1;if(a>1){this.url=v(t,\"image/jpeg\");var s=x(a);o=s.rotate,n=s.scaleX,h=s.scaleY}i.rotatable&&(e.rotate=o),i.scalable&&(e.scaleX=n,e.scaleY=h),this.clone()}},{key:\"clone\",value:function(){var i=this.$element,e=this.options,a=this.url,o=\"\",s=void 0;e.checkCrossOrigin&&n(a)&&((o=i.prop(\"crossOrigin\"))?s=a:(o=\"anonymous\",s=h(a))),this.crossOrigin=o,this.crossOriginUrl=s;var r=document.createElement(\"img\");o&&(r.crossOrigin=o),r.src=s||a;var c=t(r);this.$clone=c,this.isImg?this.element.complete?this.start():i.one(\"load\",t.proxy(this.start,this)):c.one(\"load\",t.proxy(this.start,this)).one(\"error\",t.proxy(this.stop,this)).addClass(\"cropper-hide\").insertAfter(i)}},{key:\"start\",value:function(){var i=this,e=this.$clone,a=this.$element;this.isImg||(e.off(\"error\",this.stop),a=e),r(a[0],function(e,a){t.extend(i.image,{naturalWidth:e,naturalHeight:a,aspectRatio:e/a}),i.loaded=!0,i.build()})}},{key:\"stop\",value:function(){this.$clone.remove(),this.$clone=null}},{key:\"build\",value:function(){var i=this;if(this.loaded){this.ready&&this.unbuild();var e=this.$element,a=this.options,o=this.$clone,n=t('<div class=\"cropper-container\"><div class=\"cropper-wrap-box\"><div class=\"cropper-canvas\"></div></div><div class=\"cropper-drag-box\"></div><div class=\"cropper-crop-box\"><span class=\"cropper-view-box\"></span><span class=\"cropper-dashed dashed-h\"></span><span class=\"cropper-dashed dashed-v\"></span><span class=\"cropper-center\"></span><span class=\"cropper-face\"></span><span class=\"cropper-line line-e\" data-action=\"e\"></span><span class=\"cropper-line line-n\" data-action=\"n\"></span><span class=\"cropper-line line-w\" data-action=\"w\"></span><span class=\"cropper-line line-s\" data-action=\"s\"></span><span class=\"cropper-point point-e\" data-action=\"e\"></span><span class=\"cropper-point point-n\" data-action=\"n\"></span><span class=\"cropper-point point-w\" data-action=\"w\"></span><span class=\"cropper-point point-s\" data-action=\"s\"></span><span class=\"cropper-point point-ne\" data-action=\"ne\"></span><span class=\"cropper-point point-nw\" data-action=\"nw\"></span><span class=\"cropper-point point-sw\" data-action=\"sw\"></span><span class=\"cropper-point point-se\" data-action=\"se\"></span></div></div>'),h=n.find(\".cropper-crop-box\"),s=h.find(\".cropper-face\");this.$container=e.parent(),this.$cropper=n,this.$canvas=n.find(\".cropper-canvas\").append(o),this.$dragBox=n.find(\".cropper-drag-box\"),this.$cropBox=h,this.$viewBox=n.find(\".cropper-view-box\"),this.$face=s,e.addClass(M).after(n),this.isImg||o.removeClass(\"cropper-hide\"),this.initPreview(),this.bind(),a.aspectRatio=Math.max(0,a.aspectRatio)||NaN,a.viewMode=Math.max(0,Math.min(3,Math.round(a.viewMode)))||0,this.cropped=a.autoCrop,a.autoCrop?a.modal&&this.$dragBox.addClass(\"cropper-modal\"):h.addClass(M),a.guides||h.find(\".cropper-dashed\").addClass(M),a.center||h.find(\".cropper-center\").addClass(M),a.cropBoxMovable&&s.addClass(\"cropper-move\").data(\"action\",\"all\"),a.highlight||s.addClass(\"cropper-invisible\"),a.background&&n.addClass(\"cropper-bg\"),a.cropBoxResizable||h.find(\".cropper-line,.cropper-point\").addClass(M),this.setDragMode(a.dragMode),this.render(),this.ready=!0,this.setData(a.data),this.completing=setTimeout(function(){t.isFunction(a.ready)&&e.one(\"ready\",a.ready),i.trigger(\"ready\"),i.trigger(\"crop\",i.getData()),i.completed=!0},0)}}},{key:\"unbuild\",value:function(){this.ready&&(this.completed||clearTimeout(this.completing),this.ready=!1,this.completed=!1,this.initialImage=null,this.initialCanvas=null,this.initialCropBox=null,this.container=null,this.canvas=null,this.cropBox=null,this.unbind(),this.resetPreview(),this.$preview=null,this.$viewBox=null,this.$cropBox=null,this.$dragBox=null,this.$canvas=null,this.$container=null,this.$cropper.remove(),this.$cropper=null)}}],[{key:\"setDefaults\",value:function(i){t.extend(H,t.isPlainObject(i)&&i)}}]),i}();if(t.extend&&t.extend(Q.prototype,I,U,F,S,j,A),t.fn){var K=t.fn.cropper;t.fn.cropper=function(e){for(var o=arguments.length,n=Array(o>1?o-1:0),h=1;h<o;h++)n[h-1]=arguments[h];var s=void 0;return this.each(function(a,o){var h=t(o),r=h.data(\"cropper\");if(!r){if(/destroy/.test(e))return;var c=t.extend({},h.data(),t.isPlainObject(e)&&e);r=new Q(o,c),h.data(\"cropper\",r)}if(i(e)){var d=r[e];t.isFunction(d)&&(s=d.apply(r,n))}}),a(s)?this:s},t.fn.cropper.Constructor=Q,t.fn.cropper.setDefaults=Q.setDefaults,t.fn.cropper.noConflict=function(){return t.fn.cropper=K,this}}});"

/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20)(__webpack_require__(296))

/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var newTable = __webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(36);
__webpack_require__(940);
__webpack_require__(301);
__webpack_require__(286);
// import { DelayUpload } from 'upload';
var SettingCsIndex;
(function (SettingCsIndex) {
    $(init);
    var accT;
    var modalFlag;
    var types;
    (function (types) {
        types[types["account"] = 0] = "account";
        types[types["group"] = 1] = "group";
        types[types["document"] = 2] = "document";
    })(types || (types = {}));
    function parseLocation(location) {
        return location.uri + '?' + $.param({
            prefix: location.prefix,
            fileDir: location.fileDir,
            suffix: location.suffix
        });
    }
    function init() {
        initGlobal();
        fillGroups('#account-group', true);
        initServerAccount(); // 第一个标签页
    }
    function initGlobal() {
        $('#server-group-tab').one('shown.bs.tab', initServerGroup); // 第二个标签页
        $('#document-manage-tab').one('shown.bs.tab', initDocumentManage); // 第三个标签页
        $('#common-manage-tab').one('shown.bs.tab', initCommonManage); // 第四个标签页
    }
    function initServerAccount() {
        // 初始化客服账号表格
        $('#account-table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'setting/cs/account/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        page: tables.getPage(data),
                        rows: data.length,
                        username: $.trim($('#account-name').val()),
                        alias: $.trim($('#account-alias').val()),
                        groupid: $('#account-group').val(),
                        deleted: $('#account-status').val(),
                        sort: '',
                        order: ''
                    });
                }
            },
            scrollY: tables.getTabsTableHeight($('#server-account .cloud-search-area')),
            columns: [
                {
                    data: 'servicerHead', title: '头像', render: function (text) {
                        return "<span class=\"headIcon\" style=\"background:url('" + text + "')\"></span>";
                    }
                },
                { data: 'username', title: '用户名' },
                { data: 'alias', title: '别名' },
                { data: 'groupPrivilege', title: '分组名称', render: function (text) { return text ? text.groupname : '暂无分组'; } },
                {
                    data: 'groupPrivilege', title: '权限', width: '120px', className: 'priviShow', render: renderOptions, createdCell: function (cell, cellData) {
                        $(cell).attr('title', renderOptions(cellData));
                    }
                },
                { data: 'mobile', title: '电话', createdCell: tables.createAddTitle },
                { data: 'email', title: '邮箱' },
                { data: 'deleted', title: '状态', render: renderStatus }
            ],
            initComplete: initComplete
        }));
        function initComplete() {
            initCorpper();
            var table = $('#account-table').DataTable();
            accT = new tables.Table(table);
            var accEditRoot = $('#account-edit-modal');
            var accAddRoot = $('#account-add-modal');
            var groupRoot = $('#groups-modal');
            $('#server-acc-tab').on('shown.bs.tab', function () {
                accT.refresh(true);
            });
            // 回车查询
            utils.bindEnter($('#account-name,#account-alias'), function () {
                // table.draw();
                accT.refresh(true);
            });
            // 查询
            $('.acc-search').on('click', function () {
                // table.draw();
                accT.refresh(true);
            });
            // 编辑
            $('.acc-edit').on('click', function () {
                modalFlag = 'edit';
                tables.checkLength({
                    action: '编辑',
                    table: table,
                    name: '客服账号',
                    unique: true,
                    cb: function (data) {
                        accEditRoot.find('.cropper').prop('src', data.servicerHead);
                        accEditRoot.find('.password').val('');
                        accEditRoot.modal('show');
                        getData('.password').forEach(function (v) {
                            accEditRoot.find(v.el).val(data[v.name]);
                            if (v.el === '.groupid') {
                                fillGroups('.groupid');
                                accEditRoot.find(v.el).val(data.groupPrivilege.id);
                            }
                        });
                    }
                });
            });
            // 编辑模态框中的确定
            $('#acc-edit-submit-btn').on('click', function () {
                accSubmit(accEditRoot, 'edit', 'setting/cs/account/update', '.password', $(this));
            });
            // 添加
            $('.acc-add').on('click', function () {
                modalFlag = 'add';
                groupsModal(accAddRoot);
            });
            // 添加模态框中的确定--获取值并校验 ajax传给后台
            $('#acc-add-submit-btn').on('click', function () {
                accSubmit(accAddRoot, 'add', 'setting/cs/account/add', '.id', $(this));
            });
            // 启用
            $('.acc-reopen').on('click', function () {
                var ids = [];
                var select = tables.getSelected(table);
                select.forEach(function (v) {
                    ids.push(v.id);
                });
                if (ids.length === 0) {
                    utils.alertMessage('请选择至少一条客服信息！');
                }
                else {
                    groupsModal(groupRoot);
                }
            });
            // 启用后的分组选项中的确定按钮
            $('#group-submit-btn').on('click', function () {
                var changedGroupid = groupRoot.find('.groupid').val();
                var addData = { groupid: changedGroupid };
                var msg = '请选择正确的账号或分组(分组未发生改变)!';
                if (changeStatus($(this), 'setting/cs/account/reopen', msg, addData)) {
                    groupRoot.modal('hide');
                }
            });
            // 禁用
            $('.acc-block').on('click', function () {
                var msg = '请选择至少一条未被禁用的客服信息！';
                changeStatus($(this), 'setting/cs/account/delete', msg);
            });
            /**
             *
             * 分组框
             * @param {JQuery} root modal的jqeury对象
             */
            function groupsModal(root) {
                root.find('.groupid').empty();
                fillGroups('.groupid');
                root.modal('show');
            }
            /**
             *
             * 修改启用或者禁用状态
             * @param {JQuery} el 按钮
             * @param {string} url 后台接口Url
             * @param {string} msgs 错误提示信息
             * @param {*} [addData] 启用功能附加的字段
             * @returns
             */
            function changeStatus(el, url, msgs, addData) {
                var endLoading = utils.loadingBtn(el);
                var ids = [];
                var select = tables.getSelected(table);
                if (addData) {
                    select.forEach(function (v) {
                        if (!(v.deleted === 0 && v.groupPrivilege.id === parseInt(addData.groupid))) {
                            ids.push(v.id);
                        }
                    });
                }
                else {
                    select.forEach(function (v) {
                        if (v.deleted !== 1) {
                            ids.push(v.id);
                        }
                    });
                }
                if (ids.length === 0) {
                    utils.alertMessage(msgs);
                    endLoading();
                    return false;
                }
                else {
                    var sendData = { ids: ids.join(',') };
                    if (addData) {
                        Object.assign(sendData, addData);
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: sendData,
                        success: function (msg) {
                            if (!msg.error) {
                                // table.draw();
                                accT.refresh();
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                    endLoading();
                    return true;
                }
            }
            /**
             *
             * 添加和编辑的确定按钮的通用方法
             * @param {JQuery} root 模态框
             * @param {string} type 编辑或者添加的标识符
             * @param {string} url 后台接口Url
             * @param {string} filter 需要被过滤掉的不被校验的元素
             */
            function accSubmit(root, type, url, filter, btn) {
                var result = validator(root, type);
                var bool = (type === 'add' ? true : false);
                // 头像
                var servicerHead = bool ? $('#account-add-modal').find('img.cropper').attr('src') : $('#account-edit-modal').find('img.cropper').attr('src');
                if (result) {
                    var endLoading_1 = utils.loadingBtn(btn);
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: Object.assign({ servicerHead: servicerHead }, result),
                        success: function (msg) {
                            if (!msg.error) {
                                root.modal('hide');
                                // table.draw();
                                accT.refresh(bool);
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            endLoading_1();
                        }
                    });
                }
            }
            accAddRoot.on('hidden.bs.modal', function () {
                var sr = accAddRoot.find('img.cropper').data('src');
                accAddRoot.find('img.cropper').attr('src', sr);
                getData().forEach(function (v) {
                    if (v.name === 'deleted') {
                        accAddRoot.find(v.el).val('0');
                    }
                    else {
                        accAddRoot.find(v.el).val('');
                    }
                });
            });
        }
        function renderStatus(text) {
            switch (text) {
                case 0:
                    return '已启用';
                case 1:
                    return '已禁用';
                default:
                    return '';
            }
        }
        function renderOptions(text) {
            if (text) {
                var optionIds_1 = text.operationids.split(',');
                var optionNames_1 = [];
                operationList.forEach(function (v) {
                    optionIds_1.forEach(function (m) {
                        if (v.id === parseInt(m)) {
                            optionNames_1.push(v.opname);
                        }
                    });
                });
                return optionNames_1;
            }
            else {
                return '暂无权限';
            }
        }
    }
    function initServerGroup() {
        var getAll;
        // 初始化分组管理表格
        $('#group-table').DataTable({
            ajax: {
                url: 'setting/cs/groupPrivilege/list',
                type: 'POST',
                dataSrc: function (data) {
                    if (getAll) {
                        fetchGroupsData(data);
                    }
                    return data.rows;
                },
                data: function (data) {
                    var d = utils.cleanObject({
                        groupname: $('#grounp-name').val(),
                        rows: 99999,
                        sort: '',
                        order: ''
                    });
                    if (d.groupname === '') {
                        getAll = true;
                    }
                    else {
                        getAll = false;
                        $.ajax({
                            type: 'POST',
                            url: 'setting/cs/groupPrivilege/list',
                            data: {
                                groupname: '',
                                rows: 99999,
                                sort: '',
                                order: ''
                            },
                            success: fetchGroupsData
                        });
                    }
                    return d;
                }
            },
            scrollY: tables.getTabsTableHeight($('#server-group .cloud-search-area')) + 'px',
            serverSide: false,
            pageLength: 20,
            pagingType: 'simple_numbers',
            paging: true,
            select: {
                style: 'os',
                blurable: false,
                info: false,
                selector: 'tr td:not(.prevent)'
            },
            columns: [
                { data: 'groupname', title: '分组名称' },
                { data: 'operationids', title: '权限', render: renderGroupOptions },
                { data: 'tsp', title: '更新时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime.toString() }
            ],
            initComplete: initComplete
        });
        function initComplete() {
            var table = $('#group-table').DataTable();
            var groupT = new tables.Table(table);
            var groupEditRoot = $('#group-edit-modal');
            var groupAddRoot = $('#group-add-modal');
            $('#server-group-tab').on('shown.bs.tab', function () {
                groupT.refresh(true);
            });
            // 回车查询
            utils.bindEnter($('#grounp-name'), function () {
                // table.ajax.reload();
                groupT.refresh(true);
            });
            // 查询
            $('#group-search-btn').on('click', function () {
                // table.ajax.reload();
                groupT.refresh(true);
            });
            // 编辑
            $('#group-edit-btn').on('click', function () {
                var elroot = groupEditRoot.find('.operationids');
                elroot.empty();
                tables.checkLength({
                    action: '编辑',
                    table: table,
                    name: '分组管理信息',
                    unique: true,
                    cb: function (data) {
                        getData('', types.group).forEach(function (v) {
                            groupEditRoot.find(v.el).val(data[v.name]);
                        });
                        operationList.forEach(function (v) {
                            elroot.append("<label class='checkbox-inline'>\n                                    <input class='operationids' type=\"checkbox\" value=" + v.id + " name='operationids' id='operation" + v.id + "'/>" + v.opname + "\n                                </label>");
                        });
                        // 给复选框 勾上默认值
                        var checkedids = data.operationids.split(',');
                        for (var i = 0; i < operationList.length; i++) {
                            for (var j = 0; j < checkedids.length; j++) {
                                if (operationList[i].id === parseInt(checkedids[j])) {
                                    elroot.find("#operation" + checkedids[j]).prop('checked', 'checked');
                                }
                            }
                        }
                        $('#group-edit-modal .checkbox-inline:first').css({ 'margin-left': '10px' });
                        groupEditRoot.modal('show');
                    }
                });
            });
            // 编辑模态框里的确定按钮
            $('#group-edit-submit-btn').on('click', function () {
                var result = validator(groupEditRoot, 'edit', types.group);
                var chkValue = [];
                $('#group-edit-modal input[name="operationids"]:checked').each(function () {
                    chkValue.push($(this).val());
                });
                if (chkValue.length < 1) {
                    utils.alertMessage('权限选择不能为空');
                    return;
                }
                result.operationids = chkValue.join(',');
                if (result) {
                    var endLoading_2 = utils.loadingBtn($(this));
                    $.ajax({
                        url: 'setting/cs/groupPrivilege/update',
                        type: 'POST',
                        data: result,
                        success: function (msg) {
                            if (!msg.error) {
                                groupEditRoot.modal('hide');
                                // table.ajax.reload().draw();
                                groupT.refresh();
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            // $('#account-table').DataTable().ajax.reload();
                            accT.refresh();
                            endLoading_2();
                        }
                    });
                }
            });
            // 添加
            $('#group-add-btn').on('click', function () {
                var elroot = groupAddRoot.find('.operationids');
                elroot.empty();
                operationList.forEach(function (v) {
                    elroot.append("<label class='checkbox-inline'>\n                            <input type=\"checkbox\" value=" + v.id + " name='operationids'/>" + v.opname + "\n                        </label>");
                });
                $('#group-add-modal .checkbox-inline:first').css({ 'margin-left': '10px' });
                groupAddRoot.modal('show');
            });
            // 添加模态框中的确定按钮
            $('#group-add-submit-btn').on('click', function () {
                var result = validator(groupAddRoot, 'add', types.group);
                var chkValue = [];
                $('#group-add-modal input[name="operationids"]:checked').each(function () {
                    chkValue.push($(this).val());
                });
                if (chkValue.length < 1) {
                    utils.alertMessage('权限选择不能为空');
                    return;
                }
                result.operationids = chkValue.join(',');
                if (result) {
                    var endLoading_3 = utils.loadingBtn($(this));
                    $.ajax({
                        url: 'setting/cs/groupPrivilege/add',
                        type: 'POST',
                        data: result,
                        success: function (msg) {
                            if (!msg.error) {
                                groupAddRoot.modal('hide');
                                groupT.refresh(true);
                                // table.ajax.reload();
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            accT.refresh();
                            // $('#account-table').DataTable().ajax.reload();
                            endLoading_3();
                        }
                    });
                }
            });
            // 删除
            var options = {
                el: $('#group-del-btn'),
                table: table,
                name: '分组管理信息',
                url: 'setting/cs/groupPrivilege/delete'
            };
            tables.delBtnClick(options);
            function clearData(groupRoot) {
                groupRoot.find('.groupname').val('');
                groupRoot.find('.operationids').val('');
            }
            groupAddRoot.on('hidden.bs.modal', function () {
                clearData(groupAddRoot);
            });
            groupEditRoot.on('hidden.bs.modal', function () {
                clearData(groupEditRoot);
            });
        }
        function renderGroupOptions(text) {
            var optionIds = text.split(',');
            var optionNames = [];
            operationList.forEach(function (v) {
                optionIds.forEach(function (m) {
                    if (v.id === parseInt(m)) {
                        optionNames.push(v.opname);
                    }
                });
            });
            return optionNames;
        }
        function fetchGroupsData(data) {
            groups = [];
            data.rows.forEach(function (v) {
                var m = {};
                m.id = v.id;
                m.groupname = v.groupname;
                groups.push(m);
            });
            fillGroups('#account-group', true);
            fillGroups('.groupid');
        }
    }
    function initDocumentManage() {
        doctypeList.forEach(function (v) {
            $('.doctype').append("<option value=" + v + ">" + v + "</option>");
        });
        // 初始化文档管理表格
        $('#document-table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'setting/cs/document/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        docname: $.trim($('.docname').val()),
                        doctype: $.trim($('.doctype').val()),
                        page: tables.getPage(data),
                        rows: data.length,
                        sort: '',
                        order: ''
                    });
                }
            },
            scrollY: tables.getTabsTableHeight($('#document-manage .cloud-search-area')),
            columns: [
                { data: 'docname', title: '文档名称' },
                { data: 'doctype', title: '文档类型' },
                { data: 'docsize', title: '文档大小' },
                {
                    data: 'location', title: '操作', render: function (locationJson) {
                        var uri = locationJson.startsWith('{') ? parseLocation(JSON.parse(locationJson)) : locationJson.slice(1);
                        return "<a href=\"" + uri + "\">\u4E0B\u8F7D\u9644\u4EF6</a>";
                    },
                    class: 'prevent'
                },
                { data: 'createtime', title: '创建时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime },
                { data: 'tsp', title: '更新时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime }
            ],
            initComplete: initComplete
        }));
        function initComplete() {
            var table = $('#document-table').DataTable();
            var docT = new tables.Table(table);
            var documentEditRoot = $('#document-edit-modal');
            var documentAddRoot = $('#document-add-modal');
            $('#document-manage-tab').on('shown.bs.tab', function () {
                docT.refresh(true);
            });
            // 回车查询
            utils.bindEnter($('.docname'), function () {
                // table.draw();
                docT.refresh(true);
            });
            // 查询
            $('#document-search-btn').on('click', function () {
                // table.draw();
                docT.refresh(true);
            });
            // 编辑
            $('#document-edit-btn').on('click', function () {
                tables.checkLength({
                    action: '编辑',
                    table: table,
                    name: '文档管理信息',
                    unique: true,
                    cb: function (data) {
                        documentEditRoot.modal('show');
                        getData('', types.document).forEach(function (v) {
                            documentEditRoot.find(v.el).val(data[v.name]);
                        });
                    }
                });
            });
            // 编辑上传
            var editUpload = new utils.Upload({
                url: 'setting/cs/document/update',
                accept: 'application/msword,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                name: 'attach',
                bindChangeEvent: false,
                ableEmpty: true,
                success: function (msg) {
                    if (!msg.error) {
                        documentEditRoot.modal('hide');
                        docT.refresh();
                    }
                    utils.alertMessage(msg.msg, !msg.error, false);
                },
                onChange: function () {
                    var editFile = editUpload.getFiles();
                    if (editFile) {
                        documentEditRoot.find('.attach').attr('data-text', editFile[0].name);
                    }
                },
                clearCallback: function () {
                    documentEditRoot.find('.attach').attr('data-text', '点击此处上传新附件(若不上传则默认使用原附件)');
                },
                complete: function () {
                    enda();
                }
            });
            documentEditRoot.find('.attach').on('click', function () {
                editUpload.select();
            });
            // 编辑模态框里的确定按钮
            var enda;
            $('#document-edit-submit-btn').on('click', function () {
                var result = validator(documentEditRoot, 'edit', types.document);
                if (result) {
                    enda = utils.loadingBtn($(this));
                    editUpload.upload({ 'id': result.id, 'docname': result.docname });
                }
            });
            // 添加
            $('#document-add-btn').on('click', function () {
                documentAddRoot.modal('show');
            });
            var addUpload = new utils.Upload({
                url: 'setting/cs/document/add',
                accept: 'application/msword,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                name: 'attach',
                bindChangeEvent: false,
                success: function (msg) {
                    if (!msg.error) {
                        documentAddRoot.modal('hide');
                        docT.refresh(true);
                    }
                    utils.alertMessage(msg.msg, !msg.error, false);
                },
                onChange: function () {
                    var addFile = addUpload.getFiles();
                    if (addFile) {
                        documentAddRoot.find('.attach').attr('data-text', addFile[0].name);
                    }
                },
                clearCallback: function () {
                    documentAddRoot.find('.attach').attr('data-text', '点击此处上传附件');
                },
                complete: function () {
                    addEnda();
                }
            });
            documentAddRoot.find('.attach').on('click', function () {
                addUpload.select();
            });
            // 添加模态框中的确定按钮
            var addEnda;
            $('#document-add-submit-btn').on('click', function () {
                var result = validator(documentAddRoot, 'add', types.document);
                if (result) {
                    if (!addUpload.getFiles()) {
                        utils.alertMessage('附件不能为空！');
                        return;
                    }
                    addEnda = utils.loadingBtn($(this));
                    addUpload.upload({ 'docname': result.docname });
                }
            });
            documentAddRoot.on('hidden.bs.modal', function () {
                documentAddRoot.find('.docname').val('');
            });
            // 删除
            var options = {
                el: $('#document-del-btn'),
                table: table,
                name: '文档管理信息',
                url: 'setting/cs/document/delete'
            };
            tables.delBtnClick(options);
        }
    }
    function updateGroups() {
        return $.get('setting/qucikReply/queryQRGroup')
            .then(function (res) { return updateCommonGroups(res.msg); });
    }
    function initCommonManage() {
        updateGroups()
            .then(function () {
            var table = new newTable.Table({
                el: $('#common-table'),
                options: {
                    ajax: {
                        url: 'setting/qucikReply/queryQuickReply',
                        dataSrc: function (res) { return res.msg; },
                        data: function () {
                            return {
                                groupId: $('#common-group').val()
                            };
                        }
                    },
                    select: false,
                    scrollY: tables.getTabsTableHeight($('#common-manage .cloud-search-area')),
                    columns: [{
                            title: '常用语',
                            data: 'content'
                        }, {
                            title: '分组',
                            data: 'qrGroup.content'
                        }, {
                            title: '操作',
                            data: 'id',
                            width: '80px',
                            render: function (id) {
                                return "\n\t\t\t\t\t\t\t\t<a href=\"javascript:;\" data-id=\"" + id + "\" class=\"common-edit-btn\">\u7F16\u8F91</a>\n\t\t\t\t\t\t\t\t<a href=\"javascript:;\" data-id=\"" + id + "\" class=\"common-delete-btn\">\u5220\u9664</a>\n\t\t\t\t\t\t\t\t";
                            }
                        }],
                    initComplete: function () { return commonManageInitComponent(table); }
                }
            });
        });
    }
    function commonManageInitComponent(t) {
        var dt = t.dt;
        var activeRow;
        var activeGroup;
        $('#common-table').on('click', '.common-edit-btn', function (e) {
            activeRow = dt.row($(e.currentTarget).closest('tr')).data();
            $('#common-edit-input').val(activeRow.content);
            $('#common-edit-group').val(activeRow.qrGroup.id);
            $('#common-edit-modal').modal('show');
        })
            .on('click', '.common-delete-btn', function (e) {
            var id = $(e.currentTarget).data('id');
            utils.confirmModal({
                msg: '确认删除选中常用语吗？',
                cb: function (modal, btn) {
                    var end = utils.loadingBtn(btn);
                    $.ajax('setting/qucikReply/deleteQucikReply', {
                        method: 'POST',
                        data: {
                            replyId: id
                        }
                    })
                        .done(function (res) {
                        if (!res.error) {
                            modal.modal('hide');
                            t.reload();
                        }
                    })
                        .always(function () { return end(); });
                }
            });
        });
        $('#common-add-btn').on('click', function () {
            $('#common-add-modal').modal('show');
        });
        $('#common-search-btn').on('click', function () {
            t.reload(true);
        });
        $('#common-group-submit-btn').on('click', function () {
            var input = $('#common-group-input').val().trim();
            if (!input) {
                utils.alertMessage('请输入分组名称');
                return;
            }
            var end = utils.loadingBtn($('#common-group-submit-btn'));
            $.ajax('setting/qucikReply/addOrUpdateQRGroup', {
                method: 'POST',
                data: {
                    content: input
                }
            })
                .done(function (res) {
                utils.alertMessage(res.msg, !res.error);
                if (!res.error) {
                    $('#common-group-input').val('');
                    updateGroups();
                }
            })
                .always(function () { return end(); });
        });
        $('#common-group-table').on('click', '.common-group-delete-btn', function (e) {
            var id = $(e.currentTarget).data('id');
            utils.confirmModal({
                msg: '确定要删除选中分组吗？',
                cb: function (modal, btn) {
                    var end = utils.loadingBtn(btn);
                    $.ajax('setting/qucikReply/deleteQRGroup', {
                        method: 'POST',
                        data: {
                            groupId: id
                        }
                    })
                        .done(function (res) {
                        if (!res.error) {
                            modal.modal('hide');
                            updateGroups();
                        }
                        utils.alertMessage(res.msg, !res.error);
                    })
                        .always(function () { return end(); });
                }
            });
        })
            .on('click', '.common-group-edit-btn', function (e) {
            var _a = $(e.currentTarget).data(), content = _a.content, id = _a.id;
            activeGroup = id;
            $('#common-group-edit-input').val(content);
            $('#common-group-edit-modal').modal('show');
        });
        $('#common-group-edit-submit-btn').on('click', function (e) {
            var content = $('#common-group-edit-input').val().trim();
            if (!content) {
                utils.alertMessage('请输入分组名称');
                return;
            }
            var end = utils.loadingBtn($(e.currentTarget));
            $.ajax('setting/qucikReply/addOrUpdateQRGroup', {
                method: 'POST',
                data: {
                    groupId: activeGroup,
                    content: content
                }
            })
                .done(function (res) {
                if (!res.error) {
                    $('#common-group-edit-modal').modal('hide');
                    updateGroups();
                }
                utils.alertMessage(res.msg, !res.error);
            })
                .always(function () { return end(); });
        });
        $('#common-edit-submit-btn').on('click', function () {
            var content = $('#common-edit-input').val().trim(), groupId = $('#common-edit-group').val();
            if (!content || !groupId) {
                return;
            }
            var end = utils.loadingBtn($('#common-edit-submit-btn'));
            $.ajax('setting/qucikReply/addOrUpdateQucikReply', {
                method: 'POST',
                data: {
                    replyId: activeRow.id,
                    groupId: groupId,
                    content: content
                }
            })
                .always(function () { return end(); })
                .done(function (res) {
                $('#common-edit-input').val('');
                $('#common-edit-group').find('option:first').prop('selected', true);
                $('#common-edit-modal').modal('hide');
                t.reload();
            });
        });
        $('#common-add-submit-btn').on('click', function () {
            var content = $('#common-add-input').val().trim(), groupId = $('#common-add-group').val();
            if (!content || !groupId) {
                utils.alertMessage('常用语或分组不能为空');
                return;
            }
            var end = utils.loadingBtn($('#common-add-submit-btn'));
            $.ajax('setting/qucikReply/addOrUpdateQucikReply', {
                method: 'POST',
                data: {
                    groupId: groupId,
                    content: content
                }
            })
                .always(function () { return end(); })
                .done(function (res) {
                $('#common-add-input').val('');
                $('#common-add-group').find('option:first').prop('selected', true);
                $('#common-add-modal').modal('hide');
                t.reload();
            });
        });
        $('#common-group-btn').on('click', function () {
            $('#common-group-modal').modal('show');
        });
    }
    function updateCommonGroups(commonGroups) {
        var el = $('#common-group');
        var lastVal = el.val();
        var tbody = $('#common-group-table');
        el.empty();
        tbody.empty();
        el.append('<option value="">全部</option>');
        var groupsHtml = commonGroups.map(function (v) {
            tbody.append("\n\t\t\t\t<tr>\n\t\t\t\t\t<td>" + v.content + "</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<a href=\"javascript:;\" data-id=\"" + v.id + "\" data-content=\"" + v.content + "\" class=\"common-group-edit-btn\">\u7F16\u8F91</a>\n\t\t\t\t\t\t<a href=\"javascript:;\" data-id=\"" + v.id + "\" class=\"common-group-delete-btn\">\u5220\u9664</a>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t");
            return "<option value=\"" + v.id + "\">" + v.content + "</option>";
        }).join('');
        $('#common-add-group').html(groupsHtml);
        $('#common-edit-group').html(groupsHtml);
        el.append(groupsHtml);
        if (lastVal) {
            el.val(lastVal);
        }
    }
    /**
     *
     * 给select添加分组的option选项
     * @param {any} el 被添加的select的id或样式
     * @param {any} [selectedOption] 被选中的option标识符（编辑模态框初始化的时候使用）
     */
    function fillGroups(el, total) {
        if (total === void 0) { total = false; }
        var html = total ? '<option value="">全部分组</opton>' : '';
        groups.forEach(function (v) {
            html += "<option value=" + v.id + ">" + v.groupname + "</opton>";
        });
        $(el).html(html);
    }
    /**
     *
     * @param {any} el 要进行表单验证的modal框
     * @param {any} msg 用于区分要过滤那个表单元素的标识符
     * @returns 如果表单校验不通过，返回值为空；表单校验通过，则返回将要传个后台的数据
     */
    function validator(el, msg, type) {
        var currentData = [];
        if (!type) {
            if (msg === 'add') {
                currentData = getData('.id');
            }
            else if (msg === 'edit') {
                currentData = getData();
            }
        }
        if (type === types.group) {
            if (msg === 'add') {
                currentData = getData('.id', type);
            }
            else if (msg === 'edit') {
                currentData = getData('', type);
            }
        }
        if (type === types.document) {
            if (msg === 'add') {
                currentData = getData('.id', type);
            }
            else if (msg === 'edit') {
                currentData = getData('', type);
            }
        }
        var ajaxData = {};
        for (var _i = 0, currentData_1 = currentData; _i < currentData_1.length; _i++) {
            var v = currentData_1[_i];
            var input = el.find(v.el);
            var val = $.trim(input.val());
            var name_1 = input.parent().prev().text();
            // 如果是编辑模块 则对密码校验时 若不为空，则进行正则校验；  而如果是添加模块 则需要进行为空和正则校验
            if (v.name === 'password' && msg === 'edit') {
                if (val !== '') {
                    if (v.pattern && !v.pattern.test(val)) {
                        if (val.length < 6) {
                            utils.alertMessage('密码格式不正确，至少为6个字符！');
                            return false;
                        }
                        else if (val.length > 16) {
                            utils.alertMessage('密码格式不正确，最多16个字符！');
                            return false;
                        }
                        else {
                            utils.alertMessage("" + (v.patternMsg ? name_1 + '的格式不正确！' + v.patternMsg : name_1 + '的格式不正确！'));
                            return false;
                        }
                    }
                }
            }
            else {
                if (v.require && val === '') {
                    utils.alertMessage(name_1 + "\u7684\u503C\u4E0D\u80FD\u4E3A\u7A7A");
                    return false;
                }
                if (!v.require && val !== '' && v.pattern && !v.pattern.test(val) || v.require && v.pattern && !v.pattern.test(val)) {
                    utils.alertMessage("" + (v.patternMsg ? name_1 + '的格式不正确！' + v.patternMsg : name_1 + '的格式不正确！'));
                    return false;
                }
            }
            ajaxData[v.name] = val;
        }
        return ajaxData;
    }
    /**
     *
     * 提交表单之前获取表单中的数据
     * @param {string[]} [filter]  需要被过滤掉的值
     * @returns 返回对应的表单中的数据
     */
    function getData(filter, type) {
        // 页面中各个表单里通用的表单域值及其相关信息
        var data;
        if (type === types.account || !type) {
            data = [
                {
                    name: 'id',
                    require: true,
                    el: '.id'
                },
                {
                    name: 'groupid',
                    require: true,
                    el: '.groupid'
                },
                {
                    name: 'username',
                    require: true,
                    el: '.username'
                },
                {
                    name: 'password',
                    pattern: /^\w{6,16}$/,
                    patternMsg: '（密码由6~16位字母、数字或下划线组成）',
                    require: true,
                    el: '.password'
                },
                {
                    name: 'alias',
                    require: true,
                    el: '.alias'
                },
                {
                    name: 'mobile',
                    pattern: /(((\+86)|(86))?(1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}))|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))/,
                    require: false,
                    el: '.mobile'
                },
                {
                    name: 'email',
                    pattern: /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
                    require: false,
                    el: '.email'
                },
                {
                    name: 'deleted',
                    require: false,
                    el: '.deleted'
                }
            ];
        }
        if (type === types.group) {
            data = [
                {
                    name: 'id',
                    require: true,
                    el: '.id'
                },
                {
                    name: 'groupname',
                    require: true,
                    el: '.groupname'
                }
            ];
        }
        if (type === types.document) {
            data = [
                {
                    name: 'id',
                    require: true,
                    el: '.id'
                },
                {
                    name: 'docname',
                    require: true,
                    el: '.docname'
                }
            ];
        }
        if (filter) {
            var d_1 = [];
            data.forEach(function (v) {
                if (filter !== v.el) {
                    d_1.push(v);
                }
            });
            return d_1;
        }
        return data;
    }
    /* 头像裁剪 */
    function initCorpper() {
        var cropper = $('#cropper-image').cropper({
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            preview: '.cropper-preview',
            minContainerHeight: 400,
            zoomOnTouch: false
        });
        var headEl;
        $('.account').on('click', '.cropper', function () {
            var el = $('<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" />');
            headEl = $(this);
            el.one('change', function () {
                if (!this.value || !this.files || this.files.length !== 1) {
                    return;
                }
                var file = this.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    showCropper();
                    cropper.cropper('replace', e.currentTarget.result);
                };
            });
            el.click(); // IE弹窗会阻塞页面,一定要放在绑定事件之后
        });
        $('#cancel-btn').on('click', hideCropper);
        $('#crop-btn').on('click', function () {
            if (!headEl) {
                return;
            }
            var loading = utils.loadingBtn($('#crop-btn'));
            cropper.cropper('getCroppedCanvas', {
                width: 80,
                height: 80
            }).toBlob(function (blob) {
                var data = new FormData(), elData = headEl.data();
                data.append(elData.name, blob);
                $.ajax({
                    url: elData.url,
                    type: 'POST',
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function (msg) {
                        if (!msg.error) {
                            headEl.prop('src', msg.msg);
                            /* if (elData.changeHeadSrc) {
                                $('.cloud-heading-image').prop('src', msg.msg);
                            } */
                            hideCropper();
                            utils.alertMessage('修改成功', true);
                        }
                        else {
                            utils.alertMessage(msg.msg);
                        }
                    },
                    complete: function () {
                        loading();
                    }
                });
            });
        });
    }
    function showCropper() {
        $('.box1').hide();
        modalFlag === 'add' ? $('#account-add-modal').hide() : $('#account-edit-modal').hide();
        $('#cropper-wrap').show();
    }
    function hideCropper() {
        $('.box1').show();
        modalFlag === 'add' ? $('#account-add-modal').show() : $('#account-edit-modal').show();
        $('#cropper-wrap').hide();
    }
})(SettingCsIndex || (SettingCsIndex = {}));


/***/ }),

/***/ 940:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1142]);
//# sourceMappingURL=19.js.map