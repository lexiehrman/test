var resize = {

  config: {

  },

  init: function(){

    resize.config.winWidth = $(window).width();
    resize.config.winHeight = $(window).height();
    resize.config.small = 480;
    resize.config.medium = 768;
    resize.config.large = 1024;

    var resizeTimer;

    // Throttle Resize event
    $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout( resize.update, 100);
    });

  },

  update: function(){

    // Global Updates
    resize.config.winWidth = $(window).width();
    resize.config.winHeight = $(window).height();

    // Template Specific Updates
    if ( app.config.template === 'index') {

    }

    if ( app.config.template === 'product') {
      product.relatedInfo();
    }

    // Track document progress
    app.debug('resized!');
  }

};
