'use strict'

export function bindMenuHandler() {
  $('.menu__drop').bind('mouseenter mouseleave', showMenu);
}

// export function unbindMenuHandler() {
//   $('.menu__drop').unbind('hover', showMenu);
// }

function showMenu() {
  $('.menu').toggleClass('active');
}