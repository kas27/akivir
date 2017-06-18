"use strict";

export default function() {
  document.querySelector('.logoutButton').onclick = function() {
    require.ensure([], function() {
      require('./logout');
    }, 'authorization');
  }
};