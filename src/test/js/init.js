'use strict';

import angular0 from "angular";

global.sinon = require('sinon');
global.chai = require('chai');
global.angular = angular0;
global.expect = chai.expect;
global.requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

global.window = window;
global.$ = global.jQuery = require('jquery');
