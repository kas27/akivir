"use strict";

  export function toggleShow() {
    $('.select_icon').on('click', function() {
      var parent = $(this).parent('.select');
      parent.siblings().removeClass('show');
      parent.toggleClass('show');
   });
  }
  

  function removeClass() {
    $('.select').each(function() {
      $(this).removeClass('show');
    });
  }

  export function takeItem() {
    $('.select__list a').on('click', function(e) {
      var valueItem = $(this).html();
      $(this).closest('.select').find('.select__input').val(valueItem);
      e.preventDefault();
      removeClass();
    });
  }
