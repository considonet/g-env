// G.env 1.0.5.20180215
// Environment variables
// Copyright (C) 2013-2018 ConsidoNet Solutions / www.considonet.com
// Released under MIT Licence

// Properties:
// env.isTouchDevice - detects if a touch device is being used
// env.isMobile - detects mobile devices (if so provides platform information)
// env.browserInfo - provides browser information (especially on retarded browsers)

/*
VERSION HISTORY
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
  const _env = {};

  // Touch device detection
  _env.isTouchDevice = ("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
  if (typeof (_env.isTouchDevice) === 'undefined') {
    _env.isTouchDevice = false;
  }

  _env.isMobile = {};
  _env.browserInfo = {
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
  _env.browserInfo.appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));

  // Chrome version detection
  const regExChrome = new RegExp(/Chrome\/([\d.]+)/);
  const resultChromeRegEx = regExChrome.exec(navU);
  _env.browserInfo.chromeVersion = (resultChromeRegEx === null ? null : parseFloat(regExChrome.exec(navU)[1]));

  if(isMobileiOS || isMobileBlackBerry || isMobileAndroid || isMobileWindows) {

    _env.isMobile.Android = isMobileAndroid;
    _env.isMobile.Windows = isMobileWindows;
    _env.isMobile.BlackBerry = isMobileBlackBerry;
    _env.isMobile.iOS = isMobileiOS;

    _env.browserInfo.isAndroidBrowser = (isMobileAndroid && (_env.browserInfo.appleWebKitVersion !== null && _env.browserInfo.appleWebKitVersion < 537)) || (_env.browserInfo.chromeVersion !== null && _env.browserInfo.chromeVersion < 37);

  } else {
    _env.isMobile = false;
  }

  // iOS version detection
  if (/iP(hone|od|ad)/.test(navigator.platform)) {

    _env.browserInfo.iOSVersion = (() => {
      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    })();

  }

  // Windows 7 IE detection
  _env.browserInfo.IEWindows7 = ((('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) || Boolean(window.ActiveXObject)) && navigator.userAgent.indexOf('Windows NT 6.1')!==-1);

  // IE Version (incl. Edge)
  _env.browserInfo.IEVersion = (() => {
    const msie = navU.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(navU.substring(msie + 5, navU.indexOf('.', msie)), 10);
    }

    const trident = navU.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = navU.indexOf('rv:');
      return parseInt(navU.substring(rv + 3, navU.indexOf('.', rv)), 10);
    }

    const edge = navU.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(navU.substring(edge + 5, navU.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  })();

  // CSS3 Transitions support
  _env.browserInfo.supportsTransitions = (() => {
    const b = document.body || document.documentElement;
    const s = b.style;
    let p = 'transition';

    if (typeof s[p] === 'string') {
      return true;
    }

    // Tests for vendor specific prop
    const v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (let i=0; i<v.length; i++) {
      if (typeof s[v[i] + p] === 'string') {
        return true;
      }
    }

    return false;
  })();

  // CSS3 Animations support
  _env.browserInfo.supportsAnimations = (() => {

    let animation = false;
    const domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
    const elm = document.createElement('div');

    if (elm.style.animationName !== undefined) {
      animation = true;
    }

    if (animation === false) {
      for (let i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
          animation = true;
          break;
        }
      }
    }

    return animation;

  })();

  // Scrollbar width measure
  if(_env.browserInfo.IEVersion===10 || _env.browserInfo.IEVersion===11 || _env.browserInfo.IEVersion===12 || _env.browserInfo.IEVersion===13) {
    _env.browserInfo.scrollbarWidth = 0;
  } else {
    // Create the measurement node
    const scrollDiv = document.createElement("div");
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);
    _env.browserInfo.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }

  return _env;

})();
