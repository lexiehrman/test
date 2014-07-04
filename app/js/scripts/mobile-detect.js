// Device Detection
/////////////////////////////////////////////////////////////////////////////
var isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i) ? true : false;
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i) ? true : false;
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  iOSphone: function() {
      return navigator.userAgent.match(/iPhone|iPod/i) ? true : false;
  },
  iOSpad: function() {
      return navigator.userAgent.match(/iPad/i) ? true : false;
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) ? true : false;
  },
  any: function() {
      return ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows() );
  }
};
