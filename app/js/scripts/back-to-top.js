///////////////////////////////////////////////////////////////////////////////
// --------------------------------------------------------------------------//
// back-to-top.js
// --------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////

var backToTop = {

  // Set up Variables / Reference Elements
  /////////////////////////////////////////////////////////////////////////////
  cache:{
   // $element; $('.back-to-top'),
  },

  init: function(){
    this.bindUIActions();
  },

  // Add Event Handlers
  /////////////////////////////////////////////////////////////////////////////
  bindUIActions: function() {
    this.cache.$element.on("click", function(e) {
      backToTop.scrollToTop();
    });
  },

  // Handle Scroll
  /////////////////////////////////////////////////////////////////////////////
  scrollToTop: function(){
    // replace with velocity
    $("html,body").animate({ scrollTop: 0 }, "fast");
    return false;
  }
};
