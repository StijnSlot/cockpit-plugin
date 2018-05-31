'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs  = require('requirejs');
requirejs.config({
    baseUrl: '.'
});

var util;

before(function(done) {
    requirejs(['main/resources/plugin-webapp/centaur/app/diagram/processInstance/util'], function(utl) {
        util = utl;
        done();
    });
});

it('should find util for instanceVar', function() {
    expect(util).to.exist;
});

describe('execution variables tests', function() {
    describe('addActivityElements tests', function() {

    });
});