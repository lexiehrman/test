
var header = {

  cache: {

  },

  init: function(){
    header.mainNav();

  },

  mainNav: function(){

    // If we load a page with an active which has a subnav, open the subnav
    if ($('.nav__item--open').length ) {
      $('#header').addClass('open')
      $('.nav__item--open').find('.nav__subitems').addClass('show');
    }

    // Delegate click functions based on state
    $('.nav__item--has-subnav > a').on( 'click', function(event){

      event.preventDefault();

      var $item = $(this).parent();

      if( $('body').hasClass('small') ){
        mobileClick( $item );
      } else {
        desktopClick( $item );
      }

    });

    // Handle a Desktop Click
    function desktopClick( $item ){
      app.debug('desktop click');

      // Menu Already Open
      if( !$('#header').hasClass('open') ){
        $('#header').addClass('open');
        $('.nav__subitems').removeClass('show');
        $item.children(":first").addClass("active");
        $item.find('.nav__subitems').addClass('show');
      } else {
        $('#header').removeClass('open');
      }

    }

    // Handle a Mobile Click
    function mobileClick( $item ){
      app.debug('mobile click');
    }

    // Track Active state of Main Nav
    function setActiveLink( $item ){

    }


  }

}
