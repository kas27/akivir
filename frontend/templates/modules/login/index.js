"use strict";

export default function() {
  document.querySelector('.loginButton').onclick = function() {
    require.ensure([], function() {
      require('./login');
    }, 'authorization');
  }
};

