var resize = {

  cache: {
    $body: $(document.body),
    winWidth: $(window).width(),
    winHeight: $(window).height(),
    small: 320,
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

    // Add classes to body based on width
    resize.responsiveClasses( resize.cache.winWidth );

    // Template Specific Updates
    if ( app.cache.template === 'index') {

    }

    if ( app.cache.template === 'product') {

    }

    // Track document progress
    app.debug('resized!');
  },

  responsiveClasses: function( width ){
    var newClass =  width >= resize.cache.large ? 'large' :
                    width >= resize.cache.medium ? 'medium' :
                    width >= resize.cache.small ? 'small' : '';

    resize.cache.$body.removeClass('small medium large').addClass(newClass);
  }

};
