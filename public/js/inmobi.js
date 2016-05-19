(function() {
    if (!window._inmobi) {
        var adServerURL = "http://js.w.inmobi.com/showad",
            templateBaseUrl = "http://cfinmobi-a.akamaihd.net/ad/adFormats/",
            INMOBI_CACHE_KEY_PREFIX = "inmobi_ads_",
            INMOBI_NATIVE_SECONDS_TO_EXPIRE = 3540,
            INMOBI_NATIVE_DEFAULT_ADS_COUNT = 5;
        versionString = "pr-JSAC-DTBTB-20160418", randomString = function() {
            var text = "",
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                i;
            for (i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
            }
            return text
        }, generateIframeId = function() {
            return iframeIdPrefix + randomString()
        }, jsonConfigParamsAccepted = {
            uIdMap: "u-id-map"
        }, configParamsAccepted = {
            siteid: "mk-siteid",
            slot: "mk-ad-slot",
            reftag: "reftag",
            age: "u-age",
            gender: "u-gender",
            location: "u-location",
            interests: "u-interests",
            postalCode: "u-postalCode",
            areaCode: "u-areaCode",
            dateOfBirth: "u-dateOfBirth",
            income: "u-income",
            latlong: "u-latlong-accu",
            education: "u-education",
            ethnicity: "u-ethnicity",
            adtype: "adtype",
            targetWindow: "targetWindow",
            testdeviceid: "d_tdid"
        }, slotSizes = {
            "1": {
                width: 120,
                height: 20
            },
            "2": {
                width: 168,
                height: 28
            },
            "3": {
                width: 216,
                height: 36
            },
            "4": {
                width: 300,
                height: 50
            },
            "9": {
                width: 320,
                height: 48
            },
            "10": {
                width: 300,
                height: 250
            },
            "11": {
                width: 728,
                height: 90
            },
            "12": {
                width: 468,
                height: 60
            },
            "13": {
                width: 120,
                height: 600
            },
            "14": {
                width: 320,
                height: 480
            },
            "15": {
                width: 320,
                height: 50
            },
            "16": {
                width: 768,
                height: 1024
            },
            "17": {
                width: 800,
                height: 1280
            },
            "18": {
                width: 160,
                height: 600
            },
            "21": {
                width: 480,
                height: 75
            },
            "27": {
                width: 500,
                height: 130
            },
            "28": {
                width: 292,
                height: 60
            },
            "29": {
                width: 250,
                height: 250
            },
            "30": {
                width: 250,
                height: 125
            },
            "32": {
                width: 480,
                height: 320
            },
            "33": {
                width: 1024,
                height: 768
            },
            "34": {
                width: 1280,
                height: 800
            },
            "37": {
                width: 320,
                height: 100
            }
        }, configParamsRequired = ["slot", "siteid"], iframeIdPrefix = "inmobi-iframe-", mraidStatus = "", ads = [], _getAd = function(iFrame) {
            for (var i = 0; i < ads.length; i++) {
                if (ads[i].iFrameRef === iFrame) {
                    return ads[i]
                }
            }
            return null
        }, _removeAd = function(ad) {
            try {
                ad.iFrameRef.parentNode.parentNode.removeChild(ad.iFrameRef.parentNode)
            } catch (e) {}
            var i, j = ads.length;
            for (i = 0; i < j; i++) {
                if (ads[i] === ad) {
                    ads.splice(i, 1);
                    i--
                }
            }
        }, getAdFromParent = function(el) {
            for (var i = 0; i < ads.length; i++) {
                if (ads[i].iFrameRef.parentNode.parentNode == el) {
                    return ads[i]
                }
            }
            return null
        }, parseJSON = function(j) {
            if (typeof(j) == "object") {
                return j
            }
            if (JSON) {
                return JSON.parse(j)
            } else {
                return j
            }
        }, getSlotSize = function(ad) {
            return slotSizes["" + ad.config.slot]
        }, validateConfig = function(ad) {
            var i, k, config = ad.config;
            if (config === null) {
                throw "Expected config object, got null, make sure inmobi_conf variable is set for each ad slot."
            }
            if (typeof config !== "object") {
                throw "Expected config object, got " + (typeof config) + " make sure inmobi_conf variable is set for each ad slot."
            }
            for (i = 0; i < configParamsRequired.length; i++) {
                k = configParamsRequired[i];
                if (!config.hasOwnProperty(k) || config[k] === null || config[k].length === 0) {
                    throw "inmobi.js: ERROR: missing required config parameter '" + k + "'"
                }
            }
            if (!slotSizes["" + config.slot]) {
                throw "inmobi.js: ERROR: inmobi_vars config slot param, '" + config.slot + "', is not a valid slot number."
            }
        }, confToString = function(ad) {
            var qry = [],
                k, config = ad.config;
            for (k in config) {
                var value = config[k];
                if (configParamsAccepted.hasOwnProperty(k)) {
                    var keyName = configParamsAccepted[k];
                    qry.push(encodeURIComponent(keyName) + "=" + encodeURIComponent(value))
                } else {
                    if (jsonConfigParamsAccepted.hasOwnProperty(k)) {
                        var keyName = jsonConfigParamsAccepted[k];
                        var encVal = JSON.stringify(value);
                        qry.push(encodeURIComponent(keyName) + "=" + encodeURIComponent(encVal))
                    }
                }
            }
            qry.push("mk-ads=1");
            qry.push("mk-version=" + encodeURIComponent(versionString));
            qry.push("format=html");
            qry.push("__t=" + (new Date()).getTime() + "-" + randomString());
            return qry.join("&")
        }, getURL = function(ad) {
            return adServerURL + (adServerURL.indexOf("?") === -1 ? "?" : "&") + confToString(ad)
        }, _getNewAd = function(ad, config) {
            if (typeof config == "object" && config != null) {
                ad.config = config
            }
            if (typeof ad.config == "undefined" && typeof inmobi_conf == "object") {
                ad.config = inmobi_conf
            }
            var rmEl, interval, slotSize;
            console.log("load new ad called");
            window.clearTimeout(ad.refresh);
            if (typeof(ad.config) == "object" && typeof(ad.config.autoRefresh) != "undefined") {
                interval = ad.config.autoRefresh - 0;
                if (!isNaN(interval)) {
                    if (interval < 20) {
                        interval = 20
                    }
                    ad.refresh = window.setTimeout(function(ad) {
                        ad.getNewAd()
                    }, interval * 1000, ad)
                } else {
                    console.log("Refresh interval is invalid")
                }
            }
            try {
                if (!window.navigator.onLine) {
                    return
                }
            } catch (e) {}
            if (ad.adData.state == "expanded" || (ad.adData.state == "loading" && typeof(ad.config.adtype) != "undefined" && ad.config.adtype == "int")) {
                return
            }
            try {
                rmEl = ad.iFrame.parentNode.getElementsByClassName("inmobi-rm")[0];
                if (rmEl) {
                    rmEl.parentNode.removeChild(rmEl)
                }
            } catch (e) {}
            validateConfig(ad);
            slotSize = getSlotSize(ad);
            if (!ad.iFrameRef) {
                ad.iFrameRef = document.createElement("iframe");
                ad.iFrameRef.style.border = "none";
                ad.iFrameRef.style.overflow = "hidden";
                ad.iFrameRef.id = _inmobi.generateIframeId();
                ad.iFrameRef.setAttribute("class", "inmobi-ad");
                ad.iFrameRef.setAttribute("scrolling", "no")
            } else {
                ad.iFrameRef.style.width = slotSize.width + "px";
                ad.iFrameRef.style.height = slotSize.height + "px"
            }
            ad.iFrameRef.src = getURL(ad) + "&iframe=" + ad.iFrameRef.id;
            ad.iFrameRef.style.display = "block";
            ad.iFrameRef.style.width = ad.iFrameRef.parentNode.style.width = slotSize.width + "px";
            ad.iFrameRef.style.height = ad.iFrameRef.parentNode.style.height = slotSize.height + "px";
            return ad
        }, _useAdFormat = function(ad, format, extraParameters) {
            var s = document.createElement("script"),
                adFormat;
            if ((ad.adData.state != "default") && (ad.adData.state != "init")) {
                console.log("InMobi: adFormat cannot be changed when in not in default or init state");
                return
            }
            if (ad.format) {
                ad.format.deinit(ad);
                delete ad.format
            }
            if (format == "" || format == "int" || format == "banner") {
                return
            }
            if (_inmobi.adFormats[format]) {
                adFormat = _inmobi.adFormats[format]();
                adFormat.init(ad, extraParameters);
                ad.format = adFormat;
                return
            }
            s.setAttribute("src", templateBaseUrl + format + ".js");
            s.onload = function() {
                adFormat = _inmobi.adFormats[format]();
                adFormat.init(ad, extraParameters);
                ad.format = adFormat
            };
            document.head.appendChild(s)
        }, _handleExpand = function(ad, exp) {
            var adData = ad.adData,
                url = exp.url,
                expandProperties = exp.expandProperties,
                closeButton, wid, config = ad.config,
                container = ad.iFrameRef;
            if (adData.state == "expanded") {
                ad.postToContainer("fireEvent", {
                    event: "error",
                    eventData: "Can expanded when in expanded state."
                });
                return
            }
            if (typeof(url) != "undefined" && url != null && url != "") {
                container.src = url
            }
            if (typeof(expandProperties.width) == "undefined") {
                expandProperties.width = 0
            }
            if (typeof(expandProperties.height) == "undefined") {
                expandProperties.height = 0
            }
            if (typeof(expandProperties.useCustomClose) == "undefined") {
                expandProperties.useCustomClose = false
            }
            if (typeof(expandProperties.isModal) == "undefined") {
                expandProperties.isModal = false
            }
            if (isNaN(parseInt(expandProperties.width))) {
                expandProperties.width = 0
            }
            if (isNaN(parseInt(expandProperties.height))) {
                expandProperties.height = 0
            }
            if (expandProperties.width == 0) {
                expandProperties.width = window.innerWidth
            }
            if (expandProperties.height == 0) {
                expandProperties.height = window.innerHeight
            }
            if (expandProperties.width > 0) {
                container.parentNode.style.width = container.style.width = expandProperties.width + "px"
            }
            if (expandProperties.height > 0) {
                container.parentNode.style.height = container.style.height = expandProperties.height + "px"
            }
            if (!expandProperties.useCustomClose) {
                closeButton = document.createElement("div");
                closeButton.setAttribute("class", "inmobi-close-button");
                wid = (parseInt(container.style.width) - 50);
                wid = (wid > 0 ? wid : 0) + "px";
                closeButton.setAttribute("style", "position: absolute; margin-left:" + wid + ";");
                closeButton.innerHTML = "<img src='http://inmobi-sandbox.s3.amazonaws.com/image/close.png' width='50px' height='50px' onclick='window._inmobi.closeAd(window._inmobi.getAd(event.target.parentNode.parentNode.getElementsByTagName(\"iframe\")[0]));' />";
                container.parentNode.insertBefore(closeButton, container.parentNode.firstChild)
            }
            if ((typeof(config.adtype) == "undefined") || config.adtype != "int") {
                ad.setState("expanded");
                ad.postToContainer("fireEvent", {
                    event: "stateChange",
                    eventData: "expanded"
                })
            }
        }, _resizeToDefault = function(ad) {
            var slotSize = getSlotSize(ad);
            ad.iFrameRef.parentNode.style.width = ad.iFrameRef.style.width = slotSize.width + "px";
            ad.iFrameRef.parentNode.style.height = ad.iFrameRef.style.height = slotSize.height + "px"
        }, _handleClose = function(ad) {
            _closeAd(ad)
        }, _closeAd = function(ad) {
            var buttons = ad.iFrameRef.parentNode.getElementsByClassName("inmobi-close-button"),
                config = ad.config,
                adData = ad.adData;
            if (buttons.length > 0) {
                buttons[0].parentNode.removeChild(buttons[0])
            }
            if ((typeof(config.adtype) == "undefined") || config.adtype != "int") {
                if (adData.state != "expanded") {
                    ad.postToContainer("fireEvent", {
                        event: "error",
                        eventData: "Can't close a non-expanded ad."
                    });
                    return
                }
                _resizeToDefault(ad);
                ad.setState("default");
                ad.postToContainer("fireEvent", {
                    event: "stateChange",
                    eventData: "default"
                })
            } else {
                ad.setState("init");
                ad.iFrameRef.parentNode.style.height = ad.iFrameRef.style.height = "0px";
                ad.iFrameRef.src = "";
                _inmobi.dispatchEvent("close", {
                    container: ad.iFrameRef.parentNode
                })
            }
        }, makeAdView = function(iFrame, config) {
            return {
                iFrameRef: iFrame,
                config: config,
                adData: {
                    state: "init"
                },
                refresh: null,
                getNewAd: function(config) {
                    return _getNewAd(this, config)
                },
                setState: function(state) {
                    this.adData.state = state;
                    if (typeof this.stateChanged == "function") {
                        this.stateChanged(state)
                    }
                },
                stateChanged: function(state) {},
                postToContainer: function(arg0, arg1) {
                    this.iFrameRef.contentWindow.postMessage({
                        action: arg0,
                        data: arg1,
                        inmobiMessage: true
                    }, "*")
                }
            }
        }, listener = function(event) {
            var i, msg, ad = null;
            for (i = 0; i < ads.length; i++) {
                if (ads[i].iFrameRef.contentWindow === event.source) {
                    ad = ads[i]
                }
            }
            if (ad != null) {
                msg = parseJSON(event.data);
                if (msg.action != undefined) {
                    mraidStatus = msg.action
                }
                switch (msg.topic) {
                    case "nfr":
                        _removeAd(ad);
                        if (typeof ad.config.onError == "function") {
                            ad.config.onError("nfr")
                        }
                        break;
                    case "fill":
                        if (typeof ad.config.onSuccess == "function") {
                            ad.config.onSuccess()
                        }
                        break
                }
                switch (msg.action) {
                    case "error":
                        if (typeof ad.config.onError == "function") {
                            ad.config.onError(msg.data.message)
                        }
                        break;
                    case "collapse":
                        _handleClose(ad);
                        break;
                    case "close":
                        _handleClose(ad);
                        break;
                    case "expand":
                        _handleExpand(ad, msg.data);
                        break;
                    case "log":
                        console.log(msg.data);
                        break;
                    case "useAdFormat":
                        _useAdFormat(ad, msg.data.format, msg.data.params);
                        break
                }
            }
        }, getStickyStr = function(config) {
            var sticky = "";
            if (typeof(config) != "undefined" && typeof(config.sticky) != "undefined") {
                switch (config.sticky) {
                    case "top":
                    case "left":
                        sticky = "top:0px;left:0px;";
                        break;
                    case "right":
                        sticky = "top:0px;right:0px;";
                        break;
                    case "bottom":
                        sticky = "bottom:0px;left:0px;";
                        break
                }
            }
            if (sticky == "") {
                return ""
            }
            return "position:fixed;" + sticky
        }, writeIframe = function(config) {
            var iFrameID = generateIframeId(),
                stickyStr = "",
                iframe, ad;
            stickyStr = getStickyStr(config);
            document.write('<div style="display:inline-block;' + stickyStr + '"><iframe scrolling="no" class="inmobi-ad" id="' + iFrameID + '" style="border:none;overflow:hidden;"></iframe></div>');
            iframe = document.getElementById(iFrameID);
            ad = makeAdView(iframe, config);
            initAd(ad, config)
        }, makeIframe = function(config) {
            var iFrameID = generateIframeId(),
                stickyStr = "",
                iframe, ad;
            stickyStr = getStickyStr(config);
            iframe = document.createElement("iframe"), div = document.createElement("div");
            div.setAttribute("style", "display:inline-block;" + stickyStr);
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("class", "inmobi-ad");
            iframe.setAttribute("id", iFrameID);
            iframe.setAttribute("style", "border:none;overflow:hidden;");
            div.appendChild(iframe);
            ad = makeAdView(iframe, config);
            ad.getNewAd(config);
            initAd(ad, config);
            return div
        }, initAd = function(ad, config) {
            ad.iFrameRef.width = ad.iFrameRef.style.width = "0px";
            ad.iFrameRef.height = ad.iFrameRef.style.height = "0px";
            ad.iFrameRef.style.backgroundColor = "white";
            ads.push(ad);
            if (!(typeof(config) != "undefined" && typeof(config.manual) != "undefined" && config.manual)) {
                ad.getNewAd()
            }
            if (typeof config.onLoad == "function") {
                iframe.addEventListener("load", function(e) {
                    config.onLoad(e)
                }, false)
            }
        }, _getNativeAd = function(elem, config) {
            if (elem == null || typeof elem === "undefined") {
                console.log("Error: Please pass a valid non-null HTML element to display the ad");
                return
            }
            if (!validateNativeConfig(config)) {
                return
            }
            clearExpiredAds(INMOBI_NATIVE_SECONDS_TO_EXPIRE, config);
            if (window.hasOwnProperty("navigator") && window.navigator.hasOwnProperty("onLine") && !window.navigator.onLine) {
                if (typeof config.onError == "function") {
                    config.onError("nfr", elem)
                }
                return
            }
            getNativeAd(function(ad) {
                if (ad === null) {
                    if (typeof config.onError == "function") {
                        config.onError("nfr", elem)
                    }
                    return
                }
                var ns = ad.namespace;
                var iframe = document.createElement("iframe");
                iframe.setAttribute("height", "1px");
                iframe.setAttribute("width", "1px");
                iframe.setAttribute("srcdoc", ad.contextCode);
                iframe.style.display = "none";
                elem.appendChild(iframe);
                var nativeAd = JSON.parse(decodeURIComponent(escape(window.atob(ad.pubContent))));
                nativeAd.reportAdClick = function() {
                    iframe.contentWindow.eval(ns + "recordEvent(8);")
                };
                nativeAd.reportAndHandleAdClick = function() {
                    nativeAd.reportAdClick();
                    iframe.contentWindow.eval(ns + "openLandingPage();")
                };
                iframe.onload = function(event) {
                    config.onSuccess(nativeAd, elem);
                    trackImpression(elem, iframe, ns)
                }
            }, config)
        }, getNativeAd = function(callback, config) {
            var adsJson = localStorage.getItem(getCacheKey(config));
            if (adsJson !== null) {
                var length = (JSON.parse(adsJson).length);
                if (length === 0) {
                    localStorage.removeItem(getCacheKey(config));
                    adsJson = null
                }
            }
            if (adsJson !== null) {
                var ads = JSON.parse(adsJson);
                var ad = ads[0];
                ads.splice(0, 1);
                localStorage.setItem(getCacheKey(config), JSON.stringify(ads));
                callback(ad);
                return
            }
            if (!(config.key in nativeCallbacks)) {
                nativeCallbacks[config.key] = []
            }
            nativeCallbacks[config.key].push(callback);
            if (isNativeFetchInProgress[config.key]) {
                return
            }
            isNativeFetchInProgress[config.key] = true;
            getNativeAdsFromServer(config, INMOBI_NATIVE_DEFAULT_ADS_COUNT)
        }, getNativeAdsFromServer = function(config, n) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("height", "1px");
            iframe.setAttribute("width", "1px");
            iframe.setAttribute("src", getNativeFetchURL(config, n));
            iframe.style.display = "none";
            document.getElementsByTagName("body")[0].appendChild(iframe);
            var messageListener = function(event) {
                msg = event.data;
                if (iframe.contentWindow === event.source) {
                    removeEventListener("message", messageListener);
                    var ads = msg.ads;
                    ads = filterValidAds(ads);
                    for (var i = 0; i < ads.length; i++) {
                        ads[i].timestamp = new Date().getTime()
                    }
                    var len = nativeCallbacks[config.key].length;
                    if (ads.length === 0) {
                        for (var i = 0; i < len; i++) {
                            nativeCallbacks[config.key][i](null)
                        }
                        delete nativeCallbacks[config.key]
                    } else {
                        if (len < ads.length) {
                            for (var i = 0; i < len; i++) {
                                var ad = ads[i];
                                nativeCallbacks[config.key][i](ad)
                            }
                            ads.splice(0, len);
                            nativeCallbacks[config.key].splice(0, len);
                            localStorage.setItem(getCacheKey(config), JSON.stringify(ads));
                            isNativeFetchInProgress[config.key] = false
                        } else {
                            for (var i = 0; i < ads.length; i++) {
                                var ad = ads[i];
                                nativeCallbacks[config.key][i](ad)
                            }
                            nativeCallbacks[config.key].splice(0, ads.length);
                            getNativeAdsFromServer(config, INMOBI_NATIVE_DEFAULT_ADS_COUNT)
                        }
                    }
                }
            };
            addEventListener("message", messageListener)
        }, filterValidAds = function(ads) {
            var filteredAds = [];
            for (var i = 0; i < ads.length; i++) {
                var isValid = true;
                if (!ads[i].hasOwnProperty("pubContent") || ads[i].pubContent == null || ads[i].pubContent.trim() === "") {
                    isValid = false
                }
                if (!ads[i].hasOwnProperty("namespace") || ads[i].namespace == null || ads[i].namespace.trim() === "") {
                    isValid = false
                }
                if (!ads[i].hasOwnProperty("contextCode") || ads[i].contextCode == null || ads[i].contextCode.trim() === "") {
                    isValid = false
                }
                if (isValid) {
                    filteredAds.push(ads[i])
                }
            }
            return filteredAds
        }, trackImpression = function(elem, iframe, ns) {
            if (elem === null || iframe === null) {
                return
            }
            var handleImpression = function() {
                iframe.contentWindow.eval(ns + "recordEvent(18);")
            };
            var callback = function(event) {
                if (isInViewport(elem)) {
                    clearInterval(timerId);
                    handleImpression()
                }
            };
            var timerId = setInterval(callback, 500)
        }, isInViewport = function(el) {
            var rect = el.getBoundingClientRect();
            var t = rect.top;
            var b = rect.bottom;
            var l = rect.left;
            var r = rect.right;
            var h = window.innerHeight || document.documentElement.clientHeight;
            var w = window.innerWidth || document.documentElement.clientWidth;
            var isPointInViewport = function(x, y) {
                return x >= 0 && x <= w && y >= 0 && y <= h
            };
            points = [
                [l, (t + b) / 2],
                [r, (t + b) / 2],
                [(l + r) / 2, t],
                [(l + r) / 2, b]
            ];
            var count = 0;
            for (var i = 0; i < points.length; i++) {
                if (isPointInViewport(points[i][0], points[i][1])) {
                    count++
                }
            }
            return count >= 2
        }, clearExpiredAds = function(secsToExpire, config) {
            if (localStorage.getItem(getCacheKey(config)) === null) {
                return
            }
            var currentTS = new Date().getTime();
            var ads = JSON.parse(localStorage.getItem(getCacheKey(config)));
            var nonExpiredAds = [];
            for (var i = 0; i < ads.length; i++) {
                if ((ads[i].timestamp + secsToExpire * 1000) > currentTS) {
                    nonExpiredAds.push(ads[i])
                }
            }
            localStorage.setItem(getCacheKey(config), JSON.stringify(nonExpiredAds))
        }, NATIVE_CONFIG_PARAMS_ACCEPTED = {
            siteid: "mk-siteid",
            plid: "im-plid",
            reftag: "reftag",
            age: "u-age",
            gender: "u-gender",
            location: "u-location",
            interests: "u-interests",
            postalCode: "u-postalCode",
            areaCode: "u-areaCode",
            dateOfBirth: "u-dateOfBirth",
            income: "u-income",
            latlong: "u-latlong-accu",
            education: "u-education",
            ethnicity: "u-ethnicity",
            targetWindow: "targetWindow",
            testdeviceid: "d_tdid"
        }, validateNativeConfig = function(config) {
            if (typeof config === "undefined") {
                console.log("Error: Invalid config object defined. Please check the validity of the InMobi config object");
                return false
            }
            if (typeof config.onSuccess != "function") {
                console.log("Error: Please provide an onSuccess handler to be notified when an ad is successfully received ");
                return false
            }
            var count = 0,
                key;
            if (config.hasOwnProperty("siteid")) {
                key = config.siteid;
                count++
            }
            if (config.hasOwnProperty("plid")) {
                count++;
                key = config.plid
            }
            if (count == 0) {
                console.log("Error: Please provide a valid Site ID or Placement Id ");
                return false
            }
            if (count == 2) {
                console.log("Error: Please provide either Property ID or Placement ID, not both");
                return false
            }
            if (key === "") {
                console.log("Error: Site Id or Placement Id cannot be empty. Please provide at least one parameter and its value");
                return false
            }
            config.key = key;
            return true
        }, getNativeFetchURL = function(config, adsCount) {
            adsCount = typeof adsCount !== "undefined" ? adsCount : 5;
            var qry = [];
            for (var k in config) {
                if (NATIVE_CONFIG_PARAMS_ACCEPTED.hasOwnProperty(k)) {
                    qry.push(encodeURIComponent(NATIVE_CONFIG_PARAMS_ACCEPTED[k]) + "=" + encodeURIComponent(config[k]))
                }
            }
            qry.push("mk-ads=" + encodeURIComponent(adsCount.toString()));
            qry.push("mk-version=" + encodeURIComponent(versionString));
            qry.push("adtype=native");
            qry.push("format=html");
            qry.push("__t=" + (new Date()).getTime() + "-" + randomString());
            return adServerURL + "?" + qry.join("&")
        }, getCacheKey = function(config) {
            return INMOBI_CACHE_KEY_PREFIX + config.key
        }, isNativeFetchInProgress = new Array(), nativeCallbacks = new Array();
        window._inmobi = {
            events: ["close"],
            listeners: {},
            getNewAd: function(el, config) {
                var ad = getAdFromParent(el);
                if (ad == null) {
                    try {
                        if (typeof config != "object") {
                            config = window.inmobi_conf
                        }
                        if (typeof config != "undefined") {
                            delete config.manual
                        }
                        el.appendChild(makeIframe(config))
                    } catch (e) {
                        console.log("IM: Something went wrong. Please check integration. Error: " + e)
                    }
                } else {
                    if (typeof ad == "object") {
                        ad.getNewAd(config)
                    }
                }
            },
            getAd: function(a, b) {
                return _getAd(a)
            },
            getNativeAd: function(elem, config) {
                _getNativeAd(elem, config)
            },
            closeAd: function(ad) {
                _closeAd(ad)
            },
            addEventListener: function(type, func) {
                if (this.events.indexOf(type) == -1) {
                    throw "inmobi.js: ERROR: Unknown event type '" + type + "'"
                }
                if (!this.listeners[type]) {
                    this.listeners[type] = []
                }
                this.listeners[type].push(func)
            },
            dispatchEvent: function(type, arg) {
                var i;
                if (this.events.indexOf(type) == -1) {
                    throw "inmobi.js: ERROR: Unknown event type '" + type + "'"
                }
                if (!this.listeners[type]) {
                    return
                }
                for (i = 0; i < this.listeners[type].length; i++) {
                    (this.listeners[type][i])(arg)
                }
            },
            writeIframe: function(config) {
                writeIframe(config)
            },
            removeAd: function(ad) {
                _removeAd(ad)
            },
            adFormats: {}
        };
        window.addEventListener("message", listener, false)
    }
    if (typeof inmobi_conf == "undefined") {
        inmobi_conf = {
            manual: true
        }
    }
    if (!inmobi_conf.manual) {
        _inmobi.writeIframe(inmobi_conf)
    }
})();
