(function () {
    if (!window._pgjssdk) {
        var baseUrl = 'ads.personagraph.com/ad/med/ss',
            impBaseUrl = 'ec2-54-161-6-100.compute-1.amazonaws.com/med/tracking/impression',
            intOverlay,
            intOverlayId,
            intOverlayAdContainer,
            intOverlayAdContainerId,
            versionString = 'v1.0',
            defaultParams = {
                pid: '',
                ua: navigator.userAgent,
                device_id: 'pg-web-cookie',
                bundle_id: window.location.host,
                sdk: 'true',
                ad_source:'js-sdk',
                ad_type: 'false',
                adv_type: 'DISPLAY'
            },
            mandatoryParams = ['pid', 'ad_width', 'ad_height','container_id'],
            acceptedParams = {
                pid: 'pid',
                ad_width: 'ad_width',
                ad_height: 'ad_height',
                ua: 'ua',
                ad_source:'ad_source',
                device_id: 'device_id',
                bundle_id: 'bundle_id',
                sdk: 'sdk',
                adv_type: 'adv_type',
                ad_type:'ad_type'
            },
            valid_ad_slots = [
                '120X20',
                '168X28',
                '216X36',
                '300X50',
                '320X48',
                '300X250',
                '720X98',
                '468X60',
                '120X600',
                '320X480',
                '320X50',
                '768X1024',
                '800X1280',
                '160X600',
                '480X75',
                '500X130',
                '292X60',
                '250X250',
                '250X125',
                '480X320',
                '1024X768',
                '1280X800',
                '320X100'
            ];


        var validateConfig = function (config) {
            for (var i = 0; i < mandatoryParams.length; i++) {

                var k = mandatoryParams[i];

                if (!config.hasOwnProperty(k) || config[k] === null || config[k].length === 0) {
                    throw "pgsdk.js: ERROR: missing required config parameter '" + k + "'"
                } else {

                }

                if(isMobile()){
                    if(!config.device_id)
                        throw "pgsdk.js: ERROR: missing required config parameter device_id"
                    if(!config.device_id)
                        throw "pgsdk.js: ERROR: missing required config parameter device_id"
                }

                if(config.ad_type == 'int'){
                    config.ad_type = true;
                }
            }
            var adSlot = config.ad_width + "X" + config.ad_height;
            if (valid_ad_slots.indexOf(adSlot) == -1) {
                throw "pgsdk.js: ERROR: invalid value of ad dimension";
            }
        }

        var getProtocol = function () {
            var protocol = isMobile()?'http:':window.location.protocol;
            return protocol ? protocol : 'http:'
        }

        var mergeDefaultParams = function (config) {
            for (var k in defaultParams) {
                if(!config[k]){
                    config[k] = defaultParams[k];
                }
            }
        }

        var isMobile = function() {
            var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
            if (app) {
                return true;
            } else {
                return false;
            }

        }

        var getQueryString = function (config) {

            var qry = [], k;
            for (k in config) {
                if(k != 'ad_container_id'){
                    var value = config[k];
                    qry.push(encodeURIComponent(k) + "=" + encodeURIComponent(value))
                }
            }
            qry.push("sdk-version=" + encodeURIComponent(versionString));
            qry.push("format=html");
            qry.push("__t=" + (new Date()).getTime());
            return qry.join("&");

        }

        var getReqUrl = function (config) {
            var url = getProtocol() + "//" + baseUrl + "?" + getQueryString(config);
            return url;
        }

        var getRandomId = function () {
            var str = "", charsets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i;
            for (i = 0; i < 6; i++) {
                str += charsets.charAt(Math.floor(Math.random() * charsets.length))
            }
            return str;
        }

        var wrapResponseInHtml = function (a) {
            var b = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/></head><body style="margin: 0px;padding: 0px;background-color: black;">';
            return b += a, b += "</body></html>"
        }

        var getResponse = function(iframe,a){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var e = xhttp.responseText;
                    -1 == e.indexOf("<html") && (e = wrapResponseInHtml(e))
                    e.replace("<body>", '<body style="margin:0px;padding:0px;">')
                    iframe.contentWindow.document.open(), iframe.contentWindow.document.write(e), iframe.contentWindow.document.close();
                }
            };
            xhttp.open("GET", a, true);
            xhttp.send();
        }

        var ad = function (ad, config) {
            if (typeof config == "object" && config != null) {
                ad.config = config
            } else {
                ad.config = defaultParams;
            }
            //ad.iFrameRef.src = getReqUrl(config) + "&iframe=" + ad.iFrameRef.id;

            var url = getReqUrl(config);

            if(config.madhouse){
                url = getProtocol()+'//'+window.location.host+'/js/'+config.madhouse;
            }

            var response = getResponse(ad.iFrameRef,url);

            ad.iFrameRef.style.display = "block";
            ad.iFrameRef.style.width = ad.iFrameRef.parentNode.style.width = config.ad_width + "px";
            ad.iFrameRef.style.height = ad.iFrameRef.parentNode.style.height = config.ad_height + "px";
            return ad
        }

        var createAd = function (iFrame, config) {
            return {
                iFrameRef: iFrame,
                config: config,
                getNewAd: function (config) {
                    return ad(this, config)
                }
            }
        }

        var trackImpression = function(config){
            var url = getProtocol()+'//'+impBaseUrl+'?'+getQueryString(config);
            var img = document.createElement("img");
            img.src = url;
        }

        var adCloseButton = function(iframe,config){
            var closeButton = document.createElement("div");
            closeButton.setAttribute("class", "pg-sdk-close-btn");
            var wid = (parseInt(config.ad_width) - 42);
            wid = (wid > 0 ? wid : 0) + "px";
            closeButton.setAttribute("style", "position: absolute; margin-top:10px; margin-left:" + wid + ";");
            closeButton.innerHTML = "<img src='http://ec2-54-198-185-45.compute-1.amazonaws.com/sdk/closeIcon.png' width='40px' height='40px' onclick='window._pgjssdk.closeAd(this);' />";
            iframe.parentNode.insertBefore(closeButton, iframe.parentNode.firstChild)
        }

        var initAd = function (config) {

            var randomId = getRandomId();
            var iFrameID = 'pg-ifame-'+randomId, iframe, ad;
            var iframe = document.createElement("iframe");
            var adContainer = document.createElement("div");

            console.log(intOverlay);
            if(config.ad_type === 'int' || config.ad_type == true ){

                if(!intOverlay){
                    adContainer.style.position = 'absolute';
                    adContainer.style.top = "0px";
                    var marginLeft = Math.ceil((window.innerWidth - config.ad_width)/2);
                    marginLeft = marginLeft > 0?marginLeft:0;
                    var marginTop = Math.ceil((window.innerHeight - config.ad_height)/2);
                    marginTop = marginTop > 0?marginTop:0;
                    adContainer.style.marginLeft=marginLeft+'px';
                    adContainer.style.marginTop=marginTop+'px';
                    document.body.appendChild(adContainer);
                    intOverlay = document.createElement("div");
                    intOverlayId = 'pg-int-overlay-'+randomId;
                    intOverlay.id = intOverlayId;
                    intOverlay.style.position = 'absolute';
                    intOverlay.display = 'block';
                    intOverlay.style.top = "0px";
                    intOverlay.style.background= "#999";
                    intOverlay.style.opacity = 0.5;
                    intOverlay.style.zIndex=999;
                    intOverlay.style.width="100%";
                    intOverlay.style.height="100%";
                    adContainer.style.zIndex = 10000;
                }

            }else{
                var scriptContainer = document.getElementById(config.container_id);
                if(scriptContainer){
                    scriptContainer.parentNode.insertBefore(adContainer,scriptContainer);
                }
            }

            iframe.class = "pg-sdk-ad";
            iframe.id= iFrameID;
            iframe.style.width = config.ad_width;
            iframe.style.height = config.ad_height;
            iframe.style.border = "none";
            iframe.style.overflow = "hidden";
            iframe.scrolling = "no";

            adContainer.appendChild(iframe);

            iframe.onload = function (event) {
                if(config.ad_type == 'int' || config.ad_type == true){
                    adCloseButton(this,config);
                    document.body.appendChild(intOverlay);
                }
                trackImpression(config);
            }
            ad = createAd(iframe, config);
            ad.getNewAd(config);
        }

        window._pgjssdk = {

            showAd: function (config, cb) {
                setTimeout(function () {
                    validateConfig(config)
                    mergeDefaultParams(config);
                    initAd(config);
                }, 0);
            },

            closeAd:function(ele){
                var rmEl = ele.parentNode.parentNode;
                if (rmEl) {
                    ele.parentNode.parentNode.parentNode.removeChild(rmEl)
                }
                if(intOverlay){
                    document.body.removeChild(intOverlay);
                }
            }
        }

    }else{
        console.log('File was already included');
    }
})();