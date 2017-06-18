"use strict";


export default function (block) {

  if(block.length < 0) return;
  
  $(block + ' .tabs__menu-link').on('click', runShowTab);
  
  function runShowTab() {
    var href = $(this).attr('href');
    $('.tabs__content-item').siblings().removeClass('active');
    $(href).addClass('active');

    runShowTabFirst(this);
    runShowTabSecond(this);
  }

  function runShowTabFirst(link) {
    var linkParent = $(link).parent();
    linkParent.siblings().removeClass('show');
    linkParent.siblings().find('.show').removeClass('show');
    linkParent.toggleClass('show');
  }

  function runShowTabSecond(link) {
    var linkParent = $(link).parent().siblings();
    linkParent.find('.tabs__list_second-level').slideUp();
    linkParent.find('.tabs__list_third-level').slideUp();
    $(link).siblings().slideToggle();
  }
}


