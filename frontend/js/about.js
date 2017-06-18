'use strict';

import welcome from '../templates/modules/welcome';
import custom from '../templates/modules/custom';

welcome('home');
custom();

exports.welcome = welcome;
