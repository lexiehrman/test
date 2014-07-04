// (c) Copyright 2014 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

/*
 * Ajaxify the add to cart experience and flip the button for inline confirmation,
 * show the cart in a modal, or a 3D drawer.
 *
 * This file includes:
 *    - Modernizer | Slim custom build
 *    - Basic Shopify Ajax API calls
 *    - Ajaxify plugin
 *
 * This requires:
 *    - jQuery 1.8+
 *    - handlebars.min.js (for cart template)
 *    - snippet/ajax-cart-template.liquid
*/

/*
 * Plugin Documentation
 *
 * View the complete documentation at http://shopify.com/timber
*/

// JQUERY API (c) Copyright 2009-2014 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
// Includes slight modifications to addItemFromForm.

if ((typeof Shopify) === 'undefined') { Shopify = {}; }

// -------------------------------------------------------------------------------------
// API Helper Functions
// -------------------------------------------------------------------------------------
function floatToString(numeric, decimals) {
  var amount = numeric.toFixed(decimals).toString();
  if(amount.match(/^\.\d+/)) {return "0"+amount; }
  else { return amount; }
}
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
}
function getCookie(c_name) {
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  }
  else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

// -------------------------------------------------------------------------------------
// API Functions
// -------------------------------------------------------------------------------------
Shopify.formatMoney = function(cents, format) {

  if ( typeof cents == 'string'){
    cents = cents.replace('.','');
  }
  var value = '';
  var patt = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function addCommas(moneyString) {
    return moneyString.replace(/(\d+)(\d{3}[\.,]?)/,'$1,$2');
  }

  switch(formatString.match(patt)[1]) {
    case 'amount':
      value = addCommas(floatToString(cents/100.0, 2));
      break;
    case 'amount_no_decimals':
      value = addCommas(floatToString(cents/100.0, 0));
      break;
    case 'amount_with_comma_separator':
      value = floatToString(cents/100.0, 2).replace(/\./, ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = addCommas(floatToString(cents/100.0, 0)).replace(/\./, ',');
      break;
  }
  return formatString.replace(patt, value);
};

Shopify.onProduct = function(product) {
  // alert('Received everything we ever wanted to know about ' + product.title);
};

Shopify.onCartUpdate = function(cart) {
  // alert('There are now ' + cart.item_count + ' items in the cart.');
};

Shopify.updateCartNote = function(note, callback) {
  var params = {
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        Shopify.onCartUpdate(cart);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      Shopify.onError(XMLHttpRequest, textStatus);
    }
  };
  jQuery.ajax(params);
};

Shopify.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    alert(data.message + '(' + data.status  + '): ' + data.description);
  } else {
    alert('Error : ' + Shopify.fullMessagesFromErrors(data).join('; ') + '.');
  }
};

// POST to cart/add.js returns the JSON of the line item associated with the added item
Shopify.addItem = function(variant_id, quantity, callback) {
  var quantity = quantity || 1;
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: 'quantity=' + quantity + '&id=' + variant_id,
    dataType: 'json',
    success: function(line_item) {
      if ((typeof callback) === 'function') {
        callback(line_item);
      }
      else {
        Shopify.onItemAdded(line_item);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      Shopify.onError(XMLHttpRequest, textStatus);
    }
  };
  jQuery.ajax(params);
};

// POST to cart/add.js returns the JSON of the line item
//   - Allow use of form element instead of id
//   - Allow custom error callback
Shopify.addItemFromForm = function(form, callback, errorCallback) {
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: jQuery(form).serialize(),
    dataType: 'json',
    success: function(line_item) {
      if ((typeof callback) === 'function') {
        callback(line_item, form);
      }
      else {
        Shopify.onItemAdded(line_item, form);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      if ((typeof errorCallback) === 'function') {
        errorCallback(XMLHttpRequest, textStatus);
      }
      else {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    }
  };
  jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
Shopify.getCart = function(callback) {
  jQuery.getJSON('/cart.js', function (cart, textStatus) {
    if ((typeof callback) === 'function') {
      callback(cart);
    }
    else {
      Shopify.onCartUpdate(cart);
    }
  });
};

// GET products/<product-handle>.js returns the product in JSON
Shopify.getProduct = function(handle, callback) {
  jQuery.getJSON('/products/' + handle + '.js', function (product, textStatus) {
    if ((typeof callback) === 'function') {
      callback(product);
    }
    else {
      Shopify.onProduct(product);
    }
  });
};

// POST to cart/change.js returns the cart in JSON
Shopify.changeItem = function(variant_id, quantity, callback) {
  var params = {
    type: 'POST',
    url: '/cart/change.js',
    data:  'quantity='+quantity+'&id='+variant_id,
    dataType: 'json',
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        Shopify.onCartUpdate(cart);
      }
    },
    error: function(XMLHttpRequest, textStatus) {
      Shopify.onError(XMLHttpRequest, textStatus);
    }
  };
  jQuery.ajax(params);
};


// -------------------------------------------------------------------------------------
// Ajaxify Shopify Add To Cart
// -------------------------------------------------------------------------------------

var ajaxifyShopify = (function(module, $) {

  'use strict';

  // Public functions
  var init;

  // Private general variables
  var settings, cartInit, $drawerHeight, $cssTransforms, $cssTransforms3d, $isTouch, $nojQueryLoad, $w, $body;

  // Private plugin variables
  var $formContainer, $btnClass, $wrapperClass, $addToCart, $flipClose, $flipCart, $flipContainer, $cartCountSelector, $cartCostSelector, $toggleCartButton, $modal, $cartContainer, $drawerCaret, $modalContainer, $modalOverlay, $closeCart, $drawerContainer, $prependDrawerTo;

  // Private functions
  var updateCountPrice, flipSetup, revertFlipButton, modalSetup, showModal, sizeModal, hideModal, drawerSetup, showDrawer, hideDrawer, sizeDrawer, loadCartImages, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, setToggleButtons, flipCartUpdateCallback, buildCart, cartTemplate, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, scrollTop;

  /**
   * Initialise the plugin and define global options
   */
  init = function (options) {

    // Default settings
    settings = {
      debug: false,
      method: 'drawer', // Method options are drawer, modal, and flip. Default is drawer.
      formSelector: 'form[action^="/cart/add"]',
      addToCartSelector: 'input[type="submit"]',
      cartCountSelector: null,
      cartCostSelector: null,
      toggleCartButton: null,
      btnClass: null,
      wrapperClass: null,
      useCartTemplate: false,
      moneyFormat: '${{amount}}',
      disableAjaxCart: false,
      enableQtySelectors: true,
      prependDrawerTo: 'body'
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Make sure method is lower case
    settings.method = settings.method.toLowerCase();

    // Select DOM elements
    $formContainer     = $(settings.formSelector);
    $btnClass          = settings.btnClass;
    $wrapperClass      = settings.wrapperClass;
    $addToCart         = $formContainer.find(settings.addToCartSelector);
    $flipContainer     = null;
    $flipClose         = null;
    $cartCountSelector = $(settings.cartCountSelector);
    $cartCostSelector  = $(settings.cartCostSelector);
    $toggleCartButton  = $(settings.toggleCartButton);
    $modal             = null;
    $prependDrawerTo   = $(settings.prependDrawerTo);

    // CSS Checks
    $cssTransforms   = Modernizr.csstransforms;
    $cssTransforms3d = Modernizr.csstransforms3d;
    $isTouch         = Modernizr.touch;

    // General Selectors
    $w    = $(window);
    $body = $('body');

    // Touch check
    if ($isTouch) {
      $body.addClass('ajaxify-touch');
    } else {
      $body.addClass('ajaxify-notouch');
    }

    // Check if we can use .load
    $nojQueryLoad = $('html').hasClass('lt-ie9');
    if ($nojQueryLoad) {
      settings.useCartTemplate = false;
    }

    // Setup ajax quantity selectors on the any template if enableQtySelectors is true
    if (settings.enableQtySelectors) {
      qtySelectors();
    }

    // Enable the ajax cart
    if (!settings.disableAjaxCart) {
      // Handle each case add to cart method
      switch (settings.method) {
        case 'flip':
          flipSetup();
          break;

        case 'drawer':
          drawerSetup();
          break;
      }

      if ( $addToCart.length ) {
        // Take over the add to cart form submit
        formOverride();
      }
    }

    // Run this function in case we're using the quantity selector outside of the cart
    adjustCart();
  };

  updateCountPrice = function (cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count);
    }
    if ($cartCostSelector) {
      $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
    }
  };

  flipSetup = function () {
    // Build and append the drawer in the DOM
    drawerSetup();

    // Stop if there is no add to cart button
    if ( !$addToCart.length ) {
      return
    }

    // Wrap the add to cart button in a div
    $addToCart.addClass('flip-front').wrap('<div class="flip"></div>');

    // Write a (hidden) Checkout button, a loader, and the extra view cart button
    var checkoutBtn = $('<a href="/cart" class="flip-back">Checkout</a>').addClass($btnClass),
        flipLoader = $('<div class="css-loader ajaxifyCart-loader">Loading...</div>'),
        flipExtra = $('<div class="flip-extra"><span>- or -</span> <a href="/collections/all" class="flip-cart">Continue Shopping</a></div>');

    // Append checkout button and loader
    checkoutBtn.insertAfter($addToCart);
    // flipLoader.insertAfter('.' + $btnClass );

    // Setup new selectorsflip-cart
    $flipContainer = $('.flip');

    if (!$cssTransforms3d) {
      $flipContainer.addClass('no-transforms')
    }

    // Setup extra selectors once appended
    flipExtra.insertAfter($flipContainer);
    $flipCart = $('.flip-cart');

    $flipCart.on('click', function(e) {
      // e.preventDefault();
      //  showDrawer(true);
    });

    // Reset the button if a user changes a variation
    $('input[type="checkbox"], input[type="radio"], select', $formContainer).on('click', function() {
      revertFlipButton();
    });

    // Trigger the checkout button in the cart form if someone clicks checkout button
    $('.flip-back').on( 'click', function(e){
      e.preventDefault();
      $('#ajaxifyCart input[type="submit"]').trigger('click');
    });

  };

  revertFlipButton = function () {
    $flipContainer.removeClass('is-flipped');

    // Using velocity instead of css here for more power
    $('.flip-back').velocity({ opacity: 0 }, { duration: 200, display: "none",
      complete: function(){
        $('.flip-front').velocity({ opacity: 1 }, { duration: 200, display: "inline-block" });
      }
    });
  };

  drawerSetup = function () {
    // Create drawer DOM elements with handlebars.js template
    var source   = $("#drawerTemplate").html(),
        template = Handlebars.compile(source),
        data = {
          wrapperClass: $wrapperClass
        };

    // Append drawer (defaults to body)
    $prependDrawerTo.prepend(template(data));

    // Drawer selectors
    $drawerContainer = $('#ajaxifyDrawer');
    $cartContainer   = $('#ajaxifyCart');

    // Toggle drawer with cart button
    setToggleButtons();

  };

  showDrawer = function (toggle) {
    // If we're toggling with the flip method, use a special callback
    if (settings.method == 'flip') {
      Shopify.getCart(flipCartUpdateCallback);
    }
    // opening the drawer for the first time
    else if ( !cartInit && toggle) {
      Shopify.getCart(cartUpdateCallback);
    }
    // simple toggle? just size it
    else if ( cartInit && toggle ) {
      sizeDrawer();
    }

    // trigger panel open -> header.
    var $toggle = $('.cart-toggle');
    header.panelControl( $toggle, 'cart-panel', 'open' );

    // Show the drawer
    $drawerContainer.addClass('is-visible');

    scrollTop();
  };

  hideDrawer = function () {
    $drawerContainer.removeAttr('style').removeClass('is-visible');
    scrollTop();
  };

  sizeDrawer = function ($empty) {
    if ($empty) {
      // $drawerContainer.css('height', '0px');
    } else {
      // $drawerHeight = $cartContainer.outerHeight();
      // $drawerContainer.css('height',  $drawerHeight + 'px');
    }
  };

  loadCartImages = function () {
    // Size cart once all images are loaded
    var cartImages = $('img', $cartContainer),
        count = cartImages.length,
        index = 0;

    cartImages.on('load', function() {
      index++;

      if (index==count) {
        switch (settings.method) {
          case 'flip':
          case 'drawer':
            sizeDrawer();
            break;
        }
      }
    });
  };

  formOverride = function () {
    $formContainer.submit(function(e) {
      e.preventDefault();

      // Remove any previous quantity errors
      $('.qty-error').remove();

      Shopify.addItemFromForm(e.target, itemAddedCallback, itemErrorCallback);

      // Set the flip button to a loading state
      switch (settings.method) {
        case 'flip':
          $flipContainer.addClass('flip--is-loading');
          break;
      }
    });

  };

  itemAddedCallback = function (product) {
    // Slight delay of flip to mimic a longer load
    switch (settings.method) {
      case 'flip':
        setTimeout(function () {
          $flipContainer.removeClass('flip--is-loading').addClass('is-flipped');

          // Using velocity instead of css here for more power
          $('.flip-front').velocity({ opacity: 0 }, { duration: 200, display: "none",
            complete: function(){
              $('.flip-back').velocity({ opacity: 1 }, { duration: 200, display: "inline-block" });
            }
          });

          showDrawer(true);

        }, 600);
        break;
    }
    Shopify.getCart(cartUpdateCallback);
  };

  itemErrorCallback = function (XMLHttpRequest, textStatus) {
    switch (settings.method) {
      case 'flip':
        $flipContainer.removeClass('flip--is-loading');
        break;
    }

    var data = eval('(' + XMLHttpRequest.responseText + ')');
    if (!!data.message) {
      if (data.status == 422) {
        $formContainer.after('<div class="errors qty-error">'+ data.description +'</div>')
      }
    }
  };

  cartUpdateCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);

    switch (settings.method) {
      case 'flip':
        // $('.flip-cart span').html(cart.item_count);
        break;
      case 'drawer':
        buildCart(cart);
        showDrawer();
        break;
    }

  };

  setToggleButtons = function () {
    // Reselect the element in case it just loaded
    $toggleCartButton  = $(settings.toggleCartButton);

    if ($toggleCartButton) {
      // Turn it off by default, in case it's initialized twice
      // $toggleCartButton.off('click');

      // Toggle the cart, based on the method
      $toggleCartButton.on('click', function(e) {
        e.preventDefault();

        app.debug('cart toggle clicked: ajaxify.js');

        switch (settings.method) {
          case 'drawer':
          case 'flip':
            if ( $drawerContainer.hasClass('is-visible') ) {
              hideDrawer();
            } else {
              showDrawer(true);
            }
            break;
        }

      });

    }
  };

  flipCartUpdateCallback = function (cart) {
    buildCart(cart);
  };

  buildCart = function (cart) {
    // Empty cart if using default layout or not using the .load method to get /cart
    if (!settings.useCartTemplate || cart.item_count === 0) {
      $cartContainer.empty();
    }

    // Show empty cart
    if (cart.item_count === 0) {
      $cartContainer.append('<h2 class="ajaxifyCart--empty">Your cart is empty</h2>');

      switch (settings.method) {
        case 'flip':
        case 'drawer':
          sizeDrawer();

          if (!$drawerContainer.hasClass('is-visible') && cartInit) {
            sizeDrawer(true);
          }
          break;
      }
      return;
    }

    // Use the /cart template, or Handlebars.js layout based on theme settings
    if (settings.useCartTemplate) {
      cartTemplate(cart);
      return;
    }

    // Handlebars.js cart layout
    var items = [],
        item = {},
        data = {};

    var source   = $("#cartTemplate").html(),
        template = Handlebars.compile(source);

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {

      var itemAdd = cartItem.quantity + 1,
          itemMinus = cartItem.quantity - 1,
          itemQty = cartItem.quantity + ' x';

      /* Hack to get product image thumbnail
       *   - Remove file extension, add _small, and re-add extension
      */
      var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1");
      var prodName = cartItem.title.replace(/(\-[^-]*)$/, "");
      var prodVariation = cartItem.title.replace(/^[^\-]*/, "").replace(/-/, "");

      // Create item's data object and add to 'items' array
      item = {
        id: cartItem.variant_id,
        url: cartItem.url,
        img: prodImg,
        name: prodName,
        variation: prodVariation,
        itemAdd: itemAdd,
        itemMinus: itemMinus,
        itemQty: itemQty,
        price: Shopify.formatMoney(cartItem.price, settings.moneyFormat)
      };

      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items: items,
      totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat),
      btnClass: $btnClass
    }
    $cartContainer.append(template(data));

    // With new elements we need to relink the adjust cart functions
    adjustCart();

    // Setup close modal button and size drawer
    switch (settings.method) {
      case 'flip':
      case 'drawer':
        if (cart.item_count > 0) {
          loadCartImages();
        } else {
          sizeDrawer(true);
        }
        break;
      default:
        break;
    }

    // Mark the cart as built
    cartInit = true;
  };

  cartTemplate = function (cart) {
    $cartContainer.load('/cart form[action="/cart"]', function() {

      // With new elements we need to relink the adjust cart functions
      adjustCart();

      // Size drawer at this point
      switch (settings.method) {
        case 'flip':
        case 'drawer':
          if (cart.item_count > 0) {
            loadCartImages();
          } else {
            sizeDrawer(true);
          }
          break;
        default:
          break;
      }

      // Mark the cart as built
      cartInit = true;
    });
  }

  adjustCart = function () {
    // This function runs on load, and when the cart is reprinted

    // Create ajax friendly quantity fields and remove links in the ajax cart
    if (settings.useCartTemplate) {
      createQtySelectors();
    }

    // Update quantify selectors
    var qtyAdjust = $('.ajaxifyCart--qty span');

    // Add or remove from the quantity
    qtyAdjust.off('click');
    qtyAdjust.on('click', function() {
      var el = $(this),
          id = el.data('id'),
          qtySelector = el.siblings('.ajaxifyCart--num'),
          qty = parseInt( qtySelector.val() );

      // Add or subtract from the current quantity
      if (el.hasClass('ajaxifyCart--add')) {
        qty = qty + 1;
      } else {
        qty = qty - 1;
        if (qty <= 0){
          qty = 0;
        }
      }

      // If it has a data-id, update the cart.
      // Otherwise, just update the input's number
      if (id) {
        updateQuantity(id, qty);
      } else {
        qtySelector.val(qty);
      }

    });

    // Update quantity based on input on change
    var qtyInput = $('.ajaxifyCart--num');
    qtyInput.off('change');
    qtyInput.on('change', function() {
      var el = $(this),
          id = el.data('id'),
          qty = el.val();

      // Make sure we have a valid integer
      if( (parseFloat(qty) == parseInt(qty)) && !isNaN(qty) ) {
        // We have a number!
      } else {
        // Not a number. Default to 1.
        el.val(1);
        return;
      }

      // Only update the cart via ajax if we have a variant ID to work with
      if (id) {
        updateQuantity(id, qty);
      }
    });

    // Highlight the text when focused
    qtyInput.off('focus');
    qtyInput.on('focus', function() {
      var el = $(this);
      setTimeout(function() {
        el.select();
      }, 50);
    });

    // Completely remove product
    $('.ajaxifyCart--remove').on('click', function(e) {
      var el = $(this),
          id = el.data('id') || null,
          qty = 0;

      // Without an id, let the default link action take over
      if (!id) {
        return;
      }

      e.preventDefault();
      updateQuantity(id, qty);
    });

    function updateQuantity(id, qty) {
      var row;
      // Add activity classes when changing cart quantities
      if (!settings.useCartTemplate) {
        row = $('.ajaxifyCart--row[data-id="' + id + '"]').addClass('ajaxifyCart--is-loading');
      } else {
        row = $('.cart-row[data-id="' + id + '"]').addClass('ajaxifyCart--is-loading');
      }

      if ( qty === 0 ) {
        row.addClass('is-removed');
      }

      // Slight delay to make sure removed animation is done
      setTimeout(function() {
        Shopify.changeItem(id, qty, adjustCartCallback);
      }, 250);
    }

    // Save note anytime it's changed
    var noteArea = $('textarea[name="note"]');
    noteArea.off('change');
    noteArea.on('change', function() {
      var newNote = $(this).val();

      // Simply updating the cart note in case they don't click update/checkout
      Shopify.updateCartNote(newNote, function(cart) {});
    });

  };

  adjustCartCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);

    // Hide the modal or drawer if we're at 0 items
    if ( cart.item_count === 0 ) {
      // Handle each add to cart method
      switch (settings.method) {
        case 'flip':
        case 'drawer':
          hideDrawer();
          break;
      }
    }

    // Reprint cart on short timeout so you don't see the content being removed
    setTimeout(function() {
      Shopify.getCart(buildCart);
    }, 150)
  };

  createQtySelectors = function() {
    // If there is a normal quantity number field in the ajax cart, replace it with our version
    if ($('input[type="number"]', $cartContainer).length) {
      $('input[type="number"]', $cartContainer).each(function() {
        var el = $(this),
            currentQty = el.val();

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty + ' x';

        var source   = $("#ajaxifyQty").html(),
            template = Handlebars.compile(source),
            data = {
              id: el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus
            };

        // Append new quantity selector then remove original
        el.after(template(data)).remove();
      });
    }

    // If there is a regular link to remove an item, add attributes needed to ajaxify it
    if ($('a[href^="/cart/change"]', $cartContainer).length) {
      $('a[href^="/cart/change"]', $cartContainer).each(function() {
        var el = $(this).addClass('ajaxifyCart--remove');
      });
    }
  };

  qtySelectors = function() {
    // Change number inputs to JS ones, similar to ajax cart but without API integration.
    // Make sure to add the existing name and id to the new input element
    var numInputs = $('input[type="number"]');

    if (numInputs.length) {
      numInputs.each(function() {
        var el = $(this),
            currentQty = el.val(),
            inputName = el.attr('name'),
            inputId = el.attr('id');

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty + 'x';

        var source   = $("#jsQty").html(),
            template = Handlebars.compile(source),
            data = {
              id: el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus,
              inputName: inputName,
              inputId: inputId
            };

        // Append new quantity selector then remove original
        el.after(template(data)).remove();
      });

      // Setup listeners to add/subtract from the input
      $('.js--qty-adjuster').on('click', function() {
        var el = $(this),
            id = el.data('id'),
            qtySelector = el.siblings('.js--num'),
            qty = parseInt( qtySelector.val() );

        // Add or subtract from the current quantity
        if (el.hasClass('js--add')) {
          qty = qty + 1;
        } else {
          qty = qty - 1;
          if (qty <= 1){
            qty = 1;
          }
        }

        // Update the input's number
        qtySelector.val(qty + 'x');
      });
    }
  };

  scrollTop = function () {
    /*
    if ($body.scrollTop() > 0) {
      $('html, body').animate({
        scrollTop: 0
      }, 250, 'swing');
    }
    */
  };

  module = {
    init: init
  };

  return module;

}(ajaxifyShopify || {}, jQuery));