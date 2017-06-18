"use strict";

export default function(){

  window.onload = function(){
    let images = document.getElementsByTagName('img');
    for(let i = 0; i < images.length; i++) {
      var image = images[i];
      if (image.addEventListener) {
        image.addEventListener('click', hide, false);
      }
      else {
         image.attachEvent('onclick', hide);
      }
    }

    function hide(event) {
      event.target.style.visibility = "hidden";
    }
  };
};