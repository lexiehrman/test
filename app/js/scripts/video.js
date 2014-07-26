var video ={

  init: function(){

    if( $('.main').find('#video').length ){
      if( isMobile.iOSpad() ){
        showVideoControls();
      }
      if( isMobile.Android() ){
        $('#video-wrapper').remove();
      }
    }

    function showVideoControls(){
      $('#video-wrapper').prepend('<svg class="video-play-button" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><path fill="#A59186" d="M75 147c-39.701 0-72-32.299-72-72s32.299-72 72-72 72 32.299 72 72-32.299 72-72 72zm0-129c-31.43 0-57 25.57-57 57s25.57 57 57 57 57-25.57 57-57-25.57-57-57-57z"/><polygon fill="#A59186" points="54,36 113,74.5 54,113"/></svg>');
      var hasControl = true;
      var vid = $("#video").get(0);

      $('#video-wrapper').on("touchstart",function(){
        if (vid.paused) {
          vid.play();
        } else {
          vid.pause();
        }
        if( hasControl === true ){
          $('.video-play-button').remove();
          hasControl = false;
        }
      });
    }

    var video = $("#video").get(0);

    if( $('.main').find('#video').length ){
      video.load();
    }

    $('#video-wrapper').on('touchstart',function(){
      video.load();
      video.play();
    },false);

  }

}
