
var header = {

  cache: {

  },

  init: function(){
    header.mainNav();

  },

  mainNav: function(){

    $('.nav').on( 'click', '.nav__item--has-subnav', function(){
      if( !$('.nav').hasClass('open') ){
        $('.nav').addClass('open')
      } else {
        $('.nav').removeClass('open')
      }
    });


  }

}
