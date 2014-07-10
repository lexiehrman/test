var resize = {

  cache: {
    winWidth: $(window).width(),
    winHeight: $(window).height(),
    small: 480,
    medium: 768,
    large: 1024,
  },

  init: function(){
    var resizeTimer;

    // Throttle Resize event
    $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout( resize.update, 100);
    });

  },

  update: function(){

    // Global Updates
    resize.cache.winWidth = $(window).width();
    resize.cache.winHeight = $(window).height();

    // Template Specific Updates
    if ( app.cache.template === 'index') {

    }

    if ( app.cache.template === 'product') {
      product.relatedInfo();
    }

    // Track document progress
    app.debug('resized!');
  }

};
