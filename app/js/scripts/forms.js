///////////////////////////////////////////////////////////////////////////////
// --------------------------------------------------------------------------//
// forms.js
// --------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////

var forms = {

  init: function(){
    this.placeHolders();
    this.validate();
  },

  // Set up Variables / Reference Elements
  ///////////////////////////////////////////////////////////////////////////
  placeHolders: function(){
    $('[placeholder]').each(function(){
      if ($(this).val() === '') {
        var hint = $(this).attr('placeholder');
        $(this).val(hint).addClass('hint');
      }
    });
    $('[placeholder]').focus(function() {
      if ($(this).val() === $(this).attr('placeholder')) {
        $(this).val('').removeClass('hint');
      }
    }).blur(function() {
      if ($(this).val() === '') {
        $(this).val($(this).attr('placeholder')).addClass('hint');
      }
    });
  },

  validate: function(){
    $('input.error, textarea.error').focus(function() {
      $(this).removeClass('error');
    });

    $('form :submit').click(function() {
      $(this).parents('form').find('input.hint, textarea.hint').each(function() {
        $(this).val('').removeClass('hint');
      });
      return true;
    });
  }

};
