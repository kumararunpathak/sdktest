!function(){if(window._pgjssdk)console.log("File was already included");else{var e,t,n="ads.personagraph.com/ad/med/ss",i=!1,o="v1.0",d={pid:"",ua:navigator.userAgent,device_id:"pg-web-cookie",bundle_id:window.location.host,sdk:"true",ad_source:"js-sdk",ad_type:"false",adv_type:"DISPLAY",in_app:"false"},r=["pid","ad_width","ad_height"],a=["88X31","120X20","120X60","120X240","125X125","180X150","168X28","216X36","200X200","200X446","300X50","320X48","300X250","336X280","728X90","468X60","120X600","320X480","320X50","768X1024","800X1280","160X600","480X75","500X130","292X60","250X250","250X125","480X320","1024X768","1280X800","320X100","220X90","234X60","240X133","292X30","300X31","300X100","300X600","300X1050","320X100","960X90","970X66","970X250"],s=function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)},c=function(){return s()+s()+"-"+s()+"-"+s()+"-"+s()+"-"+s()+s()+s()},l=function(){var e="_pg-c-users",t=c(),n=31536e4;if(n){var i=new Date;i.setTime(i.getTime()+1e3*n);var n="expires="+i.toGMTString()}else var n="";return document.cookie=e+"="+t+"; "+n+";path=/;",t},p=function(){var e="_pg-c-users";return document.cookie.length>0&&(c_start=document.cookie.indexOf(e+"="),-1!=c_start)?(c_start=c_start+e.length+1,c_end=document.cookie.indexOf(";",c_start),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(c_start,c_end))):""},u=function(e){for(var t=0;t<r.length;t++){var n=r[t];if(!e.hasOwnProperty(n)||null===e[n]||0===e[n].length)throw"pgsdk.js: ERROR: missing required config parameter '"+n+"'"}if(g()){if(!e.device_id)throw"pgsdk.js: ERROR: missing required config parameter device_id";if(!e.bundle_id)throw"pgsdk.js: ERROR: missing required config parameter bundle_id"}var i=e.ad_width+"X"+e.ad_height;if(-1==a.indexOf(i))throw"pgsdk.js: ERROR: invalid value of ad dimension"},h=function(){var e=g()?"http:":window.location.protocol;return e?e:"http:"},m=function(e){for(var t in d)e[t]||(e[t]=d[t]);if(g())e.in_app="true";else{var n=p();n||(n=l()),e.device_id=n}return e.ad_type&&"int"===e.ad_type.toLowerCase()&&(e.ad_type=!0),e},g=function(){var e=-1===document.URL.indexOf("http://")&&-1===document.URL.indexOf("https://");return e?!0:!1},f=function(e){var t,n=[];for(t in e)if("container_id"!=t){var i=e[t];n.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}return n.push("sdk-version="+encodeURIComponent(o)),n.join("&")},w=function(e){var t=h()+"//"+n+"?"+f(e);return t},y=function(){var e,t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(e=0;6>e;e++)t+=n.charAt(Math.floor(Math.random()*n.length));return t},X=function(e){var t='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/></head><body style="margin: 0px;padding: 0px;background-color: black;">';return t+=e,t+="</body></html>"},v=function(e,t){var n;n=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var e=n.responseText;-1==e.indexOf("<html")&&(e=X(e)),e.replace("<body>",'<body style="margin:0px;padding:0px;">'),t(null,e)}else t({message:"some error"})},n.open("GET",e,!0),n.send()},_=function(e,t){var n=document.createElement("div");n.setAttribute("class","pg-sdk-close-btn"),n.setAttribute("style","position: fixed; top:10px; right:10px"),n.innerHTML="<img src='http://ec2-54-198-185-45.compute-1.amazonaws.com/sdk/closeIcon.png' width='40px' height='40px' onclick='window._pgjssdk.closeAd(this);' />",e.parentNode.insertBefore(n,e.parentNode.firstChild)},x=function(){e||(e=document.createElement("div"),t="pg-int-overlay-"+y(),e.id=t,e.style.position="absolute",e.display="block",e.style.top="0px",e.style.background="#999",e.style.opacity=.5,e.style.zIndex=6000001,e.style.width="100%",e.style.height=document.body.clientHeight+"px",e.scrolling="no",document.body.appendChild(e))},b=function(e,t){if(i)return t&&t(0),!0;var n,o,d=y(),r="pg-ifame-"+d,n=document.createElement("iframe"),a=document.createElement("div");if(a.style.display="none","int"!==e.ad_type&&1!=e.ad_type||i){var s=document.getElementById("_pgads");s&&s.parentNode.insertBefore(a,s)}else{a.style.position="absolute",a.style.top="0px",a.scrolling="no";var c=Math.ceil((window.innerWidth-e.ad_width)/2);c=c>0?c:0;var l=Math.ceil((window.innerHeight-e.ad_height)/2);l=l>0?l:0,a.style.marginLeft=c+"px",a.style.marginTop=l+"px",document.body.appendChild(a),a.style.zIndex=6000002}n["class"]="pg-sdk-ad",n.id=r,n.style.width=e.ad_width,n.style.height=e.ad_height,n.style.border="none",n.style.overflow="hidden",n.scrolling="no",n.marginHeight="0px",n.marginWidth="0px";var p=w(e);v(p,function(d,r){return d||i?t&&t(0):(a.appendChild(n),n.contentWindow.document.open(),n.contentWindow.document.write(r),n.contentWindow.document.close(),n.style.display="block",n.style.width=e.ad_width+"px",n.style.height=e.ad_height+"px",a.style.display="block",n.style.display="block",("int"==e.ad_type||1==e.ad_type)&&(_(n,e),x()),i=!0,t&&t(!0)),o})};window._pgjssdk={showAd:function(e,t){setTimeout(function(){u(e),e=m(e),b(e,t)},0)},closeAd:function(t){var n=t.parentNode.parentNode;n&&t.parentNode.parentNode.parentNode.removeChild(n),e&&document.body.removeChild(e)}}}}();