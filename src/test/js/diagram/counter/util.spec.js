'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: '.'
});

var util;

before(function(done) {
  requirejs(['main/resources/plugin-webapp/centaur/app/diagram/counter/util'], function(utl) {
    util = utl;
    done();
  });
});

it('should find duration util file', function() {
  expect(util).to.not.be.undefined;
});

describe('check createHTML', function () {
    var executionSequenceCounter, returnValue;

    describe('check create HTML', function () {
        beforeEach(function () {
            executionSequenceCounter = '6000';

            returnValue = util.createHTML(executionSequenceCounter);
        });
        it('check if returns correct values', function () {
            expect(returnValue).to.eql('<div class="counterText"> Counter: 6000</div>');
        });

    });


});