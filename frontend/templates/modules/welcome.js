"use strict";

export default function(message) {
  if (NODE_ENV == 'development') {
    console.log('development');
  }
  else{
    console.log('user');
  }
  // alert(`Welcome ${message}`);
};