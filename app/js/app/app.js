///////////////////////////////////////////////////////////////////////////////
// --------------------------------------------------------------------------//
// app.js
//
// -- Concatenated last after all libraries, plugins and scripts
// -- Initializes Global Scripts, Page-Level Scripts and Event Listeners
// --------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////

var app = {

  cache:{
    awsURL: 'http://s3.amazonaws.com/callina/',
    $content: $('#content'),
    template: $('#content').data( "template" ),
    debug: true
  },

  init: function(){

    // Initialize Global Libraries / Plugins
    FastClick.attach(document.body);

    // Detect if IE
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
      $('body').addClass('ie');
    }

    // Initialize Desktop Only Scripts
    var mobile = isMobile.any();
    if( mobile === false ){

    }

    // Initialize Global Scripts
    header.init();
    forms.init();
    resize.init();
    app.update();

    // Trace App Operations
    app.debug('app.init');
  },

  // Called from theme.liquid
  ajax: function( format ){
    ajaxifyShopify.init({
      method: 'flip', // Method options are drawer, modal, and flip. Default is drawer.
      wrapperClass: null, //'wrapper', // The class that defines your site width. Default is null.
      formSelector: 'form[action^="/cart/add"]', // Default is form[action^="/cart/add"].
      addToCartSelector: 'button[type="submit"]', // Default is input[type="submit"] within 'formSelector'.
      cartCountSelector: '#cartCount', // Update number of items in the cart when a product is added. Default is null.
      cartCostSelector: '#cartCost', // Update the total cart cost when a product is added. Default is null.
      toggleCartButton: '#cartToggle', // To toggle drawer/modal cart, include the selector here. Default is null and will take you to /cart page.
      useCartTemplate: false, // True to use cart.liquid markup. False to use handlebars.js for template. Default is true.
      btnClass: 'btn--dark', // Your main button class for styling purposes if useCartTemplate is set to false. Default is null.
      moneyFormat: format, // Your shop money format, defined in liquid.
      disableAjaxCart: false, // If for some reason you want to disable the cart, set to true. Default is false.
      enableQtySelectors: true, // Enable the quantity selectors on your templates, even if disableAjaxCart is false. Default is true.
      prependDrawerTo: '#cartPanel' // The element selector where the cart is prepended. This is used for the drawer and flip methods. Default is $('body').
    });
  },

  update: function(){
    // Update location from pJax Load
    /////////////////////////////////////////////////////////////////////////////
    this.cache.$content = $('#content');
    this.cache.template = $('#content').data( "template" );
    this.cache.title = $('#content').data( "title" );

    // Global Update Scripts
    /////////////////////////////////////////////////////////////////////////////


    // Initialize Page-Conditional Scripts
    /////////////////////////////////////////////////////////////////////////////
    // Index Page
    if ( app.cache.template === 'index') {
      index.init();
    }
    // Collection Page
    if ( app.cache.template === 'collection' ) {
      //collection.init();
    }
    // Product Pages
    if ( app.cache.template === 'product' ) {
     // product.init();
    }
    // Blog
    if ( app.cache.template === 'blog' || app.cache.template === 'article' ) {
      //blog.init();
    }
    // Search
    if ( app.cache.template === 'search' ) {
      //search.init();
    }
    // Page
    if ( app.cache.template === 'page' ) {
      //page.init();
    }


    //Shopify API
    /////////////////////////////////////////////////////////////////////////////
    Shopify.getCart();


    // Layout Tweaks
    /////////////////////////////////////////////////////////////////////////////
    resize.update();


    // Trace App Operations
    app.debug('template: ' + this.cache.template + ', title: ' + this.cache.title );
    app.debug('app.update');

  },

  debug: function( test ){
    if( app.cache.debug === true ){
        console.log( test );
    }
  }

};


// Kick things off!
///////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    app.init();
});

