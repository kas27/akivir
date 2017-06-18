"use strict";


import welcome from '../templates/modules/welcome';
import custom from '../templates/modules/custom';
import login from '../templates/modules/login';
import logout from '../templates/modules/logout';
import { toggleShow, takeItem } from '../templates/modules/form-elements/select-custom';
import { bindMenuHandler} from '../templates/partials/menu/';
import tabs from '../templates/modules/tabs';

document.addEventListener('DOMContentLoaded', function () {



  welcome('home');
  custom();
  login();
  logout();
  toggleShow();
  takeItem();
  bindMenuHandler();
  tabs('.tabs');
  // unbindMenuHandler();


  exports.welcome = welcome;
});
