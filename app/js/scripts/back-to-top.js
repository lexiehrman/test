///////////////////////////////////////////////////////////////////////////////
// --------------------------------------------------------------------------//
// back-to-top.js
// --------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////

var backToTop = {

  // Set up Variables / Reference Elements
  /////////////////////////////////////////////////////////////////////////////
  config:{

  },

  init: function(){
    // Cache DOM elements
    this.config.$element = $('.back-to-top');

    this.bindUIActions();
  },

  // Add Event Handlers
  /////////////////////////////////////////////////////////////////////////////
  bindUIActions: function() {
    this.config.$element.on("click", function(e) {
      backToTop.scrollToTop();
    });
  },

  // Handle Scroll
  /////////////////////////////////////////////////////////////////////////////
  scrollToTop: function(){
    $("html,body").animate({ scrollTop: 0 }, "fast");
    return false;
  }
};
