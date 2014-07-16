// Main and SubNavigation
///////////////////////////////////////////////////////////////////////////////
var mainNav = {

  cache: {
    $body: $('body'),
    $header: $('#header'),
    $nav: $('#nav'),
    $navItemHasSubnav: $('.nav__item--has-subnav'),
    $navItemHasSubnavLink: $('.nav__item--has-subnav > a'),
    $navItemOpen: $('.nav__item--open'),
    $navSubItems: $('.nav__subitems'),
    $menuToggle: $('#menuToggle')
  },


  init: function(){
    mainNav.bindUIActions();
    mainNav.checkStateOnLoad();
  },


  bindUIActions: function(){

    // Delegate click functions for items with subnavs
    mainNav.cache.$navItemHasSubnavLink.on( 'click', function(event){
      event.preventDefault();
      mainNav.handleClick( $(this) );
    });

    mainNav.cache.$menuToggle.on('click', function(event){
      $(this).toggleClass('active');
      mainNav.cache.$nav.toggleClass('open');
    });

  },


  // Handle a Desktop Click
  handleClick: function( $navLink ){

    // Our links subnav reference
    var $subnavToShow = $navLink.next( 'ul' );
    // Is our main nav open?
    var isHeaderOpen = mainNav.cache.$header.hasClass('open');
    // Is our subnav already open?
    var isSubnavShowing = $subnavToShow.hasClass('show');

    // Header is Closed, open it and show subnav
    if( isHeaderOpen === false ) {
      mainNav.showSubnav( $subnavToShow );
      mainNav.setHighlightLink( $navLink );

    // Header is Open but our subnav isnt showing
    } else if( isHeaderOpen === true && isSubnavShowing === false ){
      mainNav.showSubnav( $subnavToShow );
      mainNav.setHighlightLink( $navLink );

    // Header is Open, subnav is showing, lets toggle it closed
    } else if( isHeaderOpen === true && isSubnavShowing === true ){
      mainNav.closeSubnav();
    }

  },



  // Handle a Mobile Click
  mobileClick: function( $item ){

  },


  setHighlightLink: function( $navItem ){
    mainNav.cache.$navItemHasSubnavLink.removeClass("highlight");
    if( !$navItem.hasClass('active') ){
      $navItem.addClass("highlight");
    }
  },


  closeSubnav: function(){
    // Close header, and remove added classes to subnav and links
    mainNav.cache.$header.removeClass('open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
      mainNav.cache.$navSubItems.removeClass('show');
      mainNav.cache.$navItemHasSubnavLink.removeClass("highlight");
    });

  },


  showSubnav: function( $subnavToShow ){
    // Open header and show passed in subnav
    mainNav.cache.$header.addClass('open').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    mainNav.cache.$navSubItems.removeClass('show');
    $subnavToShow.addClass('show');
  },


  checkStateOnLoad: function(){
    // If we load a page with an active sublink, open the header and show the subnav
    if ( mainNav.cache.$navItemOpen.length ) {
      var $subnavToShow = mainNav.cache.$navItemOpen.find( mainNav.cache.$navSubItems );
      mainNav.showSubnav( $subnavToShow );
    }
  },

}



// Header
///////////////////////////////////////////////////////////////////////////////
var header = {

  cache: {

  },

  init: function(){
    mainNav.init();
  },

}
