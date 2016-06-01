(function () {
    if (!window._pgjssdk) {

        var baseUrl = 'ads.personagraph.com/ad/med/ss',
            intOverlay,
            intOverlayId,
            adLoaded = false,
            intOverlayAdContainer,
            intOverlayAdContainerId,
            versionString = 'v1.0',
            defaultParams = {
                pid: '',
                ua: navigator.userAgent,
                device_id: 'pg-web-cookie',
                bundle_id: window.location.host,
                sdk: 'true',
                ad_source: 'js-sdk',
                ad_type: 'false',
                adv_type: 'DISPLAY',
                in_app: 'false'
            },
            mandatoryParams = ['pid', 'ad_width', 'ad_height'],
            acceptedParams = {
                pid: 'pid',
                ad_width: 'ad_width',
                ad_height: 'ad_height',
                ua: 'ua',
                ad_source: 'ad_source',
                device_id: 'device_id',
                bundle_id: 'bundle_id',
                sdk: 'sdk',
                adv_type: 'adv_type',
                ad_type: 'ad_type'
            },
            valid_ad_slots = [
                '88X31',
                '120X20',
                '120X60',
                '120X240',
                '125X125',
                '180X150',
                '168X28',
                '216X36',
                '200X200',
                '200X446',
                '300X50',
                '320X48',
                '300X250',
                '336X280',
                '728X90',
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
                '320X100',
                '220X90',
                '234X60',
                '240X133',
                '292X30',
                '300X31',
                '300X100',
                '300X600',
                '300X1050',
                '320X100',
                '960X90',
                '970X66',
                '970X250'
            ];
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        var createCookieId = function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        var createCookie = function () {

            var name = '_pg-c-users';
            var value = createCookieId();
            var exp = 10 * 365 * 24 * 3600;

            if (exp) {
                var date = new Date();
                date.setTime(date.getTime() + (exp * 1000));
                var exp = "expires=" + date.toGMTString();
            }
            else {
                var exp = "";
            }
            document.cookie = name + "=" + value + "; " + exp + ";path=/;";
            return value;
        }

        var getCookie = function () {
            var c_name = '_pg-c-users';
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        }


        var validateConfig = function (config) {

            for (var i = 0; i < mandatoryParams.length; i++) {
                var k = mandatoryParams[i];
                if (!config.hasOwnProperty(k) || config[k] === null || config[k].length === 0) {
                    throw "pgsdk.js: ERROR: missing required config parameter '" + k + "'"
                }
            }

            if (isMobile()) {
                if (!config.device_id)
                    throw "pgsdk.js: ERROR: missing required config parameter device_id"
                if (!config.bundle_id)
                    throw "pgsdk.js: ERROR: missing required config parameter bundle_id"
            }

            var adSlot = config.ad_width + "X" + config.ad_height;

            if (valid_ad_slots.indexOf(adSlot) == -1) {
                throw "pgsdk.js: ERROR: invalid value of ad dimension";
            }
        }

        var getProtocol = function () {
            var protocol = isMobile() ? 'http:' : window.location.protocol;
            return protocol ? protocol : 'http:'
        }

        var mergeDefaultParams = function (config) {

            for (var k in defaultParams) {
                if (!config[k]) {
                    config[k] = defaultParams[k];
                }
            }

            if (!isMobile()) {
                var c_id = getCookie();
                if (!c_id) {
                    c_id = createCookie();
                }
                config.device_id = c_id;
            } else {
                config.in_app = 'true';
            }

            if (config.ad_type && config.ad_type.toLowerCase() === 'int') {
                config.ad_type = true;
            }
            return config
        }

        var isMobile = function () {
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
                if (k != 'container_id') {
                    var value = config[k];
                    qry.push(encodeURIComponent(k) + "=" + encodeURIComponent(value))
                }
            }
            qry.push("sdk-version=" + encodeURIComponent(versionString));
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

        var getAdFromServer = function(url,cb){
            var xmlhttp;
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var e = xmlhttp.responseText;
                    -1 == e.indexOf("<html") && (e = wrapResponseInHtml(e))
                    e.replace("<body>", '<body style="margin:0px;padding:0px;">')
                    cb(null,e);
                }else{
                    cb({message:"some error"});
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();

        }

        var createAd = function (iFrame, adContainer, config) {
            return {
                iFrameRef: iFrame,
                adContainer:adContainer,
                config: config,
                getNewAd: function (config) {
                    return ad(this, config)
                }
            }
        }

        var adCloseButton = function (iframe, config) {
            var closeButton = document.createElement("div");
            closeButton.setAttribute("class", "pg-sdk-close-btn");
            closeButton.setAttribute("style", "position: fixed; top:10px; right:10px");
            closeButton.innerHTML = "<img src='http://ec2-54-198-185-45.compute-1.amazonaws.com/sdk/closeIcon.png' width='40px' height='40px' onclick='window._pgjssdk.closeAd(this);' />";
            iframe.parentNode.insertBefore(closeButton, iframe.parentNode.firstChild)
        }

        var showBGPopup = function(){
            if(!intOverlay){
                intOverlay = document.createElement("div");
                intOverlayId = 'pg-int-overlay-' + getRandomId();
                intOverlay.id = intOverlayId;
                intOverlay.style.position = 'absolute';
                intOverlay.display = 'block';
                intOverlay.style.top = "0px";
                intOverlay.style.background = "#999";
                intOverlay.style.opacity = 0.5;
                intOverlay.style.zIndex = 6000001;
                intOverlay.style.width = "100%";
                intOverlay.style.height = document.body.clientHeight + 'px';
                intOverlay.scrolling = "no";
                document.body.appendChild(intOverlay);
            }
        }

        var initAd = function (config) {

            if(adLoaded){
                return true;
            }

            var randomId = getRandomId();
            var iFrameID = 'pg-ifame-' + randomId, iframe, ad;
            var iframe = document.createElement("iframe");
            var adContainer = document.createElement("div");
            adContainer.style.display = 'none';

            if ((config.ad_type === 'int' || config.ad_type == true) && !adLoaded) {
                adContainer.style.position = 'absolute';
                adContainer.style.top = "0px";
                adContainer.scrolling = "no";
                var marginLeft = Math.ceil((window.innerWidth - config.ad_width) / 2);
                marginLeft = marginLeft > 0 ? marginLeft : 0;
                var marginTop = Math.ceil((window.innerHeight - config.ad_height) / 2);
                marginTop = marginTop > 0 ? marginTop : 0;
                adContainer.style.marginLeft = marginLeft + 'px';
                adContainer.style.marginTop = marginTop + 'px';
                document.body.appendChild(adContainer);
                adContainer.style.zIndex = 6000002;
            } else {
                var scriptContainer = document.getElementById('_pgads');
                if (scriptContainer) {
                    scriptContainer.parentNode.insertBefore(adContainer, scriptContainer);
                }
            }

            iframe.class = "pg-sdk-ad";
            iframe.id = iFrameID;
            iframe.style.width = config.ad_width;
            iframe.style.height = config.ad_height;
            iframe.style.border = "none";
            iframe.style.overflow = "hidden";
            iframe.scrolling = "no";
            iframe.marginHeight = "0px";
            iframe.marginWidth="0px";
            var url = getReqUrl(config);

            getAdFromServer(url,function(err,response){
                if(!err && !adLoaded){
                    adContainer.appendChild(iframe);
                    iframe.contentWindow.document.open();
                    iframe.contentWindow.document.write(response);
                    iframe.contentWindow.document.close();
                    iframe.style.display = "block";
                    iframe.style.width =  config.ad_width + "px";
                    iframe.style.height = config.ad_height + "px";
                    adContainer.style.display = 'block';
                    iframe.style.display="block";
                    if(config.ad_type == 'int' || config.ad_type == true){
                        adCloseButton(iframe,config);
                        showBGPopup();
                    }
                    adLoaded = true;
                }
                return ad
            });

        }

        window._pgjssdk = {

            showAd: function (config, cb) {
               setTimeout(function () {
                    validateConfig(config);
                    config = mergeDefaultParams(config);
                    initAd(config);
               }, 0);
            },

            closeAd: function (ele) {
                var rmEl = ele.parentNode.parentNode;
                if (rmEl) {
                    ele.parentNode.parentNode.parentNode.removeChild(rmEl)
                }
                if (intOverlay) {
                    document.body.removeChild(intOverlay);
                }
            }
        }

    } else {
        console.log('File was already included');
    }

})();