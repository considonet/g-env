// G.env 2.1.1
// Environment variables
// Copyright (C) 2013-2018 ConsidoNet Solutions / www.considonet.com
// Released under MIT Licence

// Properties:
// env.isTouchDevice - detects if a touch device is being used
// env.isMobile - detects mobile devices (if so provides platform information)
// env.browserInfo - provides browser information (especially on retarded browsers)

/*
VERSION HISTORY
2.1.1 (20181129) @pg
* ignore files fixes
* cleanup

2.1.0 (20181129) @pg
+ Switched to git (now available on github), file cleanup
+ Now built with rollup

2.0.0 (20180718) @pg
+ Switched to semver
* Dist package now transpiled from ES6 (compatibility with building environments not transpiling node_modules)
+ Source linted with tslint

1.0.5.20180215 @pg
+ TypeScript declarations

1.0.4.20171106 @pg
* Now acting as a separate npm module

1.0.3.20170529 @pg
+ ES6

1.0.1.20170306 @pg
* Bugfixes and code syntax optimization

1.0.0.20170126 @pg
+ Initial version

*/

export default (() => {

  "use strict";
  const Env = {};

  // Touch device detection
  Env.isTouchDevice = ("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
  if (typeof (Env.isTouchDevice) === "undefined") {
    Env.isTouchDevice = false;
  }

  Env.isMobile = {};
  Env.browserInfo = {
    "appleWebKitVersion": null,
    "chromeVersion": null,
    "isAndroidBrowser": false,
    "iOSVersion": null,
    "IEWindows7": false,
    "supportsTransitions": false,
    "supportsAnimations": false,
    "IEVersion": false,
    "scrollbarWidth": 0
  };

  // Mobile device detection
  const navU = window.navigator.userAgent;
  const isMobileAndroid = /Android/i.test(navU);
  const isMobileWindows = /IEMobile/i.test(navU) || /Windows Phone/i.test(navU);
  const isMobileBlackBerry = /BlackBerry/i.test(navU);
  const isMobileiOS = /iPhone|iPad|iPod/i.test(navU);

  // Apple webkit version detection
  const regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
  const resultAppleWebKitRegEx = regExAppleWebKit.exec(navU);
  Env.browserInfo.appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));

  // Chrome version detection
  const regExChrome = new RegExp(/Chrome\/([\d.]+)/);
  const resultChromeRegEx = regExChrome.exec(navU);
  Env.browserInfo.chromeVersion = (resultChromeRegEx === null ? null : parseFloat(regExChrome.exec(navU)[1]));

  if(isMobileiOS || isMobileBlackBerry || isMobileAndroid || isMobileWindows) {

    Env.isMobile.Android = isMobileAndroid;
    Env.isMobile.Windows = isMobileWindows;
    Env.isMobile.BlackBerry = isMobileBlackBerry;
    Env.isMobile.iOS = isMobileiOS;

    Env.browserInfo.isAndroidBrowser = (isMobileAndroid && (Env.browserInfo.appleWebKitVersion !== null && Env.browserInfo.appleWebKitVersion < 537)) || (Env.browserInfo.chromeVersion !== null && Env.browserInfo.chromeVersion < 37);

  } else {
    Env.isMobile = false;
  }

  // iOS version detection
  if (/iP(hone|od|ad)/.test(navigator.platform)) {

    Env.browserInfo.iOSVersion = (() => {
      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    })();

  }

  // Windows 7 IE detection
  Env.browserInfo.IEWindows7 = ((("-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style) || Boolean(window.ActiveXObject)) && navigator.userAgent.indexOf("Windows NT 6.1")!==-1);

  // IE Version (incl. Edge)
  Env.browserInfo.IEVersion = (() => {
    const msie = navU.indexOf("MSIE ");
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(navU.substring(msie + 5, navU.indexOf(".", msie)), 10);
    }

    const trident = navU.indexOf("Trident/");
    if (trident > 0) {
      // IE 11 => return version number
      const rv = navU.indexOf("rv:");
      return parseInt(navU.substring(rv + 3, navU.indexOf(".", rv)), 10);
    }

    const edge = navU.indexOf("Edge/");
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(navU.substring(edge + 5, navU.indexOf(".", edge)), 10);
    }

    // other browser
    return false;
  })();

  // CSS3 Transitions support
  Env.browserInfo.supportsTransitions = (() => {
    const b = document.body || document.documentElement;
    const s = b.style;
    let p = "transition";

    if (typeof s[p] === "string") {
      return true;
    }

    // Tests for vendor specific prop
    const v = ["Moz", "webkit", "Webkit", "Khtml", "O", "ms"];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (let i = 0; i<v.length; i++) {
      if (typeof s[v[i] + p] === "string") {
        return true;
      }
    }

    return false;
  })();

  // CSS3 Animations support
  Env.browserInfo.supportsAnimations = (() => {

    let animation = false;
    const domPrefixes = "Webkit Moz O ms Khtml".split(" ");
    const elm = document.createElement("div");

    if (elm.style.animationName !== undefined) {
      animation = true;
    }

    if (animation === false) {
      for (let i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + "AnimationName"] !== undefined) {
          animation = true;
          break;
        }
      }
    }

    return animation;

  })();

  // Scrollbar width measure
  if(Env.browserInfo.IEVersion===10 || Env.browserInfo.IEVersion===11 || Env.browserInfo.IEVersion===12 || Env.browserInfo.IEVersion===13) {
    Env.browserInfo.scrollbarWidth = 0;
  } else {
    // Create the measurement node
    const scrollDiv = document.createElement("div");
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);
    Env.browserInfo.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }

  return Env;

})();
