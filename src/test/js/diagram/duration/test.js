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
    requirejs(['main/resources/plugin-webapp/centaur/app/diagram/duration/util'], function(utl) {
        util = utl;
        done();
    });
});

it('should find duration util file', function() {
    expect(util).to.not.be.undefined;
});

describe('calculate current duration test', function(){


});

describe('check times conversion test', function () {

    var spy;
    var duration;
    describe('duration is 2 seconds', function () {
        beforeEach(function() {
            spy = sinon.spy();
            var localStorage = {setItem: spy, getItem: stub};

            util.setChecked(localStorage, prefix, data);
        });
    })


});
