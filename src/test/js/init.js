'use strict';

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;
global.requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

global.window = window;
global.$ = global.jQuery = require('jquery');
